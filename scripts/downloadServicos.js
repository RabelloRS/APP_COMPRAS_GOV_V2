const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const API_DELAY_MS = 200;

async function fetchAndRetry(url) {
  let success = false;
  let data = null;
  while (!success) {
    try {
      const response = await axios.get(url);
      data = response.data;
      success = true;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        const message = (error.response.data || {}).message || 'Rate limit atingido.';
        console.warn(`${message} Tentando novamente em 60 segundos para a URL: ${url}`);
        await sleep(60000);
      } else {
        console.error(`Erro não relacionado ao rate limit ao buscar ${url}:`, error.message);
        throw error;
      }
    }
  }
  return data;
}

async function baixarServicos() {
  const db = new sqlite3.Database('comprasgov.db');
  // Tabelas
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS secoes_servico (
      codigoSecao INTEGER PRIMARY KEY,
      nomeSecao TEXT,
      statusSecao BOOLEAN,
      dataHoraAtualizacao TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS divisoes_servico (
      codigoDivisao INTEGER PRIMARY KEY,
      codigoSecao INTEGER,
      nomeDivisao TEXT,
      statusDivisao BOOLEAN,
      dataHoraAtualizacao TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS grupos_servico (
      codigoGrupo INTEGER PRIMARY KEY,
      codigoDivisao INTEGER,
      nomeGrupo TEXT,
      statusGrupo BOOLEAN,
      dataHoraAtualizacao TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS classes_servico (
      codigoClasse INTEGER PRIMARY KEY,
      codigoGrupo INTEGER,
      nomeClasse TEXT,
      statusClasse BOOLEAN,
      dataHoraAtualizacao TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS subclasses_servico (
      codigoSubclasse INTEGER PRIMARY KEY,
      codigoClasse INTEGER,
      nomeSubclasse TEXT,
      statusSubclasse BOOLEAN,
      dataHoraAtualizacao TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS itens_servico (
      codigoServico INTEGER,
      codigoSubclasse INTEGER,
      nomeServico TEXT,
      statusServico BOOLEAN,
      exclusivoCentralCompras BOOLEAN,
      dataHoraAtualizacao TEXT,
      PRIMARY KEY (codigoServico, codigoSubclasse)
    )`);
  });

  // 1. Seções
  console.log('Baixando seções...');
  const secoesData = await fetchAndRetry('https://dadosabertos.compras.gov.br/modulo-servico/1_consultarSecaoServico');
  const secoes = secoesData.resultado;
  db.serialize(() => {
    const stmt = db.prepare('INSERT OR REPLACE INTO secoes_servico (codigoSecao, nomeSecao, statusSecao, dataHoraAtualizacao) VALUES (?, ?, ?, ?)');
    secoes.forEach(s => stmt.run(s.codigoSecao, s.nomeSecao, s.statusSecao ? 1 : 0, s.dataHoraAtualizacao));
    stmt.finalize();
  });
  console.log(`${secoes.length} seções baixadas.`);

  // 2. Divisões
  console.log('Baixando divisões...');
  let divisoes = [];
  for (const secao of secoes) {
    const url = `https://dadosabertos.compras.gov.br/modulo-servico/2_consultarDivisaoServico?codigoSecao=${secao.codigoSecao}`;
    console.log(`Buscando divisões para a seção ${secao.codigoSecao}...`);
    const data = await fetchAndRetry(url);
    const resultado = data.resultado;
    divisoes = divisoes.concat(resultado);
    db.serialize(() => {
      const stmt = db.prepare('INSERT OR REPLACE INTO divisoes_servico (codigoDivisao, codigoSecao, nomeDivisao, statusDivisao, dataHoraAtualizacao) VALUES (?, ?, ?, ?, ?)');
      resultado.forEach(d => stmt.run(d.codigoDivisao, d.codigoSecao, d.nomeDivisao, d.statusDivisao ? 1 : 0, d.dataHoraAtualizacao));
      stmt.finalize();
    });
    await sleep(API_DELAY_MS);
  }
  console.log(`${divisoes.length} divisões baixadas.`);

  // 3. Grupos
  console.log('Baixando grupos...');
  let grupos = [];
  for (const divisao of divisoes) {
    const url = `https://dadosabertos.compras.gov.br/modulo-servico/3_consultarGrupoServico?codigoDivisao=${divisao.codigoDivisao}`;
    console.log(`Buscando grupos para a divisão ${divisao.codigoDivisao}...`);
    const data = await fetchAndRetry(url);
    const resultado = data.resultado;
    grupos = grupos.concat(resultado);
    db.serialize(() => {
      const stmt = db.prepare('INSERT OR REPLACE INTO grupos_servico (codigoGrupo, codigoDivisao, nomeGrupo, statusGrupo, dataHoraAtualizacao) VALUES (?, ?, ?, ?, ?)');
      resultado.forEach(g => stmt.run(g.codigoGrupo, g.codigoDivisao, g.nomeGrupo, g.statusGrupo ? 1 : 0, g.dataHoraAtualizacao));
      stmt.finalize();
    });
    await sleep(API_DELAY_MS);
  }
  console.log(`${grupos.length} grupos baixados.`);

  // 4. Classes
  console.log('Baixando classes...');
  let classes = [];
  for (const grupo of grupos) {
    const url = `https://dadosabertos.compras.gov.br/modulo-servico/4_consultarClasseServico?codigoGrupo=${grupo.codigoGrupo}`;
    console.log(`Buscando classes para o grupo ${grupo.codigoGrupo}...`);
    const data = await fetchAndRetry(url);
    const resultado = data.resultado;
    classes = classes.concat(resultado);
    db.serialize(() => {
      const stmt = db.prepare('INSERT OR REPLACE INTO classes_servico (codigoClasse, codigoGrupo, nomeClasse, statusClasse, dataHoraAtualizacao) VALUES (?, ?, ?, ?, ?)');
      resultado.forEach(c => stmt.run(c.codigoClasse, c.codigoGrupo, c.nomeClasse, c.statusClasse ? 1 : 0, c.dataHoraAtualizacao));
      stmt.finalize();
    });
    await sleep(API_DELAY_MS);
  }
  console.log(`${classes.length} classes baixadas.`);

  // 5. Subclasses
  console.log('Baixando subclasses...');
  let subclasses = [];
  for (const classe of classes) {
    const url = `https://dadosabertos.compras.gov.br/modulo-servico/5_consultarSubclasseServico?codigoClasse=${classe.codigoClasse}`;
    console.log(`Buscando subclasses para a classe ${classe.codigoClasse}...`);
    const data = await fetchAndRetry(url);
    const resultado = data.resultado;
    subclasses = subclasses.concat(resultado);
    db.serialize(() => {
      const stmt = db.prepare('INSERT OR REPLACE INTO subclasses_servico (codigoSubclasse, codigoClasse, nomeSubclasse, statusSubclasse, dataHoraAtualizacao) VALUES (?, ?, ?, ?, ?)');
      resultado.forEach(s => stmt.run(s.codigoSubclasse, s.codigoClasse, s.nomeSubclasse, s.statusSubclasse ? 1 : 0, s.dataHoraAtualizacao));
      stmt.finalize();
    });
    await sleep(API_DELAY_MS);
  }
  console.log(`${subclasses.length} subclasses baixadas.`);

  // 6. Itens de serviço
  console.log('Baixando itens de serviço...');
  for (const subclasse of subclasses) {
    let pagina = 1;
    let total = 1;
    const pageSize = 500;
    while ((pagina - 1) * pageSize < total) {
      const url = `https://dadosabertos.compras.gov.br/modulo-servico/6_consultarItemServico?codigoSubclasse=${subclasse.codigoSubclasse}&tamanhoPagina=${pageSize}&pagina=${pagina}`;
      console.log(`Buscando itens para a subclasse ${subclasse.codigoSubclasse}, página ${pagina}...`);
      const data = await fetchAndRetry(url);
      const itens = data.resultado || [];
      total = data.totalRegistros || itens.length;
      db.serialize(() => {
        const stmt = db.prepare('INSERT OR REPLACE INTO itens_servico (codigoServico, codigoSubclasse, nomeServico, statusServico, exclusivoCentralCompras, dataHoraAtualizacao) VALUES (?, ?, ?, ?, ?, ?)');
        itens.forEach(i => {
          stmt.run(
            i.codigoServico,
            i.codigoSubclasse,
            i.nomeServico,
            i.statusServico ? 1 : 0,
            i.exclusivoCentralCompras ? 1 : 0,
            i.dataHoraAtualizacao
          );
        });
        stmt.finalize();
      });
      console.log(`Subclasse ${subclasse.codigoSubclasse}: página ${pagina} (${itens.length} itens) de um total de ${total}`);
      pagina++;
      await sleep(API_DELAY_MS);
    }
  }

  db.close();
  console.log('Serviços salvos no banco comprasgov.db');
}

baixarServicos(); 