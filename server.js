const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Listar grupos
app.get('/api/grupos', (req, res) => {
  const db = new sqlite3.Database('comprasgov.db');
  db.all('SELECT * FROM grupos', [], (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Listar classes (opcionalmente filtrando por grupo)
app.get('/api/classes', (req, res) => {
  const db = new sqlite3.Database('comprasgov.db');
  const { codigoGrupo } = req.query;
  let sql = 'SELECT * FROM classes';
  let params = [];
  if (codigoGrupo) {
    sql += ' WHERE codigoGrupo = ?';
    params.push(codigoGrupo);
  }
  db.all(sql, params, (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Listar itens (opcionalmente filtrando por grupo e classe)
app.get('/api/itens', (req, res) => {
  const db = new sqlite3.Database('comprasgov.db');
  const { codigoGrupo, codigoClasse } = req.query;
  let sql = 'SELECT * FROM itens WHERE 1=1';
  let params = [];
  if (codigoGrupo) {
    sql += ' AND codigoGrupo = ?';
    params.push(codigoGrupo);
  }
  if (codigoClasse) {
    sql += ' AND codigoClasse = ?';
    params.push(codigoClasse);
  }
  db.all(sql, params, (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Acionar download de itens por grupo e classe
app.post('/api/baixar-itens', (req, res) => {
  const { codigoGrupo, codigoClasse } = req.body;
  if (!codigoGrupo) {
    return res.status(400).json({ error: 'codigoGrupo é obrigatório' });
  }
  let cmd = `node scripts/downloadItens.js ${codigoGrupo}`;
  if (codigoClasse) cmd += ` ${codigoClasse}`;
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ message: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`API local rodando em http://localhost:${PORT}`);
}); 