const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

async function baixarGrupos() {
  const db = new sqlite3.Database('comprasgov.db');
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS grupos (
        codigoGrupo INTEGER PRIMARY KEY,
        nomeGrupo TEXT,
        statusGrupo BOOLEAN,
        dataHoraAtualizacao TEXT
      )
    `);
  });

  const url = 'https://dadosabertos.compras.gov.br/modulo-material/1_consultarGrupoMaterial?pagina=1';
  const resp = await axios.get(url);
  const grupos = resp.data.resultado;

  db.serialize(() => {
    const stmt = db.prepare('INSERT OR REPLACE INTO grupos (codigoGrupo, nomeGrupo, statusGrupo, dataHoraAtualizacao) VALUES (?, ?, ?, ?)');
    grupos.forEach(g => {
      stmt.run(g.codigoGrupo, g.nomeGrupo, g.statusGrupo ? 1 : 0, g.dataHoraAtualizacao);
    });
    stmt.finalize();
  });

  db.close();
  console.log('Grupos salvos no banco comprasgov.db');
}

baixarGrupos(); 