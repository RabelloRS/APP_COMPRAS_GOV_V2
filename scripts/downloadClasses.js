const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

async function baixarClasses() {
  const db = new sqlite3.Database('comprasgov.db');
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS classes (
        codigoClasse INTEGER PRIMARY KEY,
        codigoGrupo INTEGER,
        nomeGrupo TEXT,
        nomeClasse TEXT,
        statusClasse BOOLEAN,
        dataHoraAtualizacao TEXT
      )
    `);
  });

  let pagina = 1;
  let totalPaginas = 1;
  let classes = [];

  do {
    const url = `https://dadosabertos.compras.gov.br/modulo-material/2_consultarClasseMaterial?pagina=${pagina}&bps=false`;
    const resp = await axios.get(url);
    const resultado = resp.data.resultado || [];
    classes = classes.concat(resultado);
    totalPaginas = resp.data.totalPaginas || 1;
    pagina++;
  } while (pagina <= totalPaginas);

  db.serialize(() => {
    const stmt = db.prepare('INSERT OR REPLACE INTO classes (codigoClasse, codigoGrupo, nomeGrupo, nomeClasse, statusClasse, dataHoraAtualizacao) VALUES (?, ?, ?, ?, ?, ?)');
    classes.forEach(c => {
      stmt.run(c.codigoClasse, c.codigoGrupo, c.nomeGrupo, c.nomeClasse, c.statusClasse ? 1 : 0, c.dataHoraAtualizacao);
    });
    stmt.finalize();
  });

  db.close();
  console.log('Classes salvas no banco comprasgov.db');
}

baixarClasses(); 