const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

async function baixarItens(codigoGrupo, codigoClasse) {
  const db = new sqlite3.Database('comprasgov.db');
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS itens (
        codigoItem INTEGER,
        codigoGrupo INTEGER,
        nomeGrupo TEXT,
        codigoClasse INTEGER,
        nomeClasse TEXT,
        codigoPdm INTEGER,
        nomePdm TEXT,
        descricaoItem TEXT,
        statusItem BOOLEAN,
        itemSustentavel BOOLEAN,
        codigo_ncm TEXT,
        descricao_ncm TEXT,
        aplica_margem_preferencia TEXT,
        dataHoraAtualizacao TEXT,
        PRIMARY KEY (codigoItem, codigoGrupo, codigoClasse)
      )
    `);
  });

  const pageSize = 500;
  let pagina = 1;
  let total = 1;

  while ((pagina - 1) * pageSize < total) {
    let url = `https://dadosabertos.compras.gov.br/modulo-material/4_consultarItemMaterial?codigoGrupo=${codigoGrupo}&tamanhoPagina=${pageSize}&pagina=${pagina}`;
    if (codigoClasse) url += `&codigoClasse=${codigoClasse}`;
    const resp = await axios.get(url);
    const data = resp.data;
    const itens = data.resultado || [];
    total = data.totalRegistros || itens.length;

    db.serialize(() => {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO itens (
          codigoItem, codigoGrupo, nomeGrupo, codigoClasse, nomeClasse, codigoPdm, nomePdm,
          descricaoItem, statusItem, itemSustentavel, codigo_ncm, descricao_ncm, aplica_margem_preferencia, dataHoraAtualizacao
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      itens.forEach(i => {
        stmt.run(
          i.codigoItem,
          i.codigoGrupo,
          i.nomeGrupo,
          i.codigoClasse,
          i.nomeClasse,
          i.codigoPdm,
          i.nomePdm,
          i.descricaoItem,
          i.statusItem ? 1 : 0,
          i.itemSustentavel ? 1 : 0,
          i.codigo_ncm,
          i.descricao_ncm,
          i.aplica_margem_preferencia,
          i.dataHoraAtualizacao
        );
      });
      stmt.finalize();
    });

    console.log(`Baixados página ${pagina} (${itens.length} itens) de um total de ${total}`);
    pagina++;
  }

  db.close();
  console.log('Itens salvos no banco comprasgov.db');
}

// Exemplo de uso: node scripts/downloadItens.js 56 [1615]
const codigoGrupo = process.argv[2];
const codigoClasse = process.argv[3];
if (!codigoGrupo) {
  console.error('Informe o código do grupo. Ex: node scripts/downloadItens.js 56 [1615]');
  process.exit(1);
}
baixarItens(codigoGrupo, codigoClasse); 