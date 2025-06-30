const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { exec } = require('child_process');
const axios = require('axios');
const { Parser } = require('json2csv');
const { jsPDF } = require("jspdf");
require('jspdf-autotable');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Helpers para chamadas de API resilientes
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAndRetry(url) {
  let success = false;
  let data = null;
  while (!success) {
    try {
      console.log(`Buscando dados externos: ${url}`);
      const response = await axios.get(url, { timeout: 30000 }); // Timeout de 30s
      data = response.data;
      success = true;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        const message = (error.response.data || {}).message || 'Rate limit atingido.';
        console.warn(`${message} Tentando novamente em 60 segundos...`);
        await sleep(60000);
      } else {
        console.error(`Erro ao buscar dados externos (${url}):`, error.message);
        // Lança o erro para ser tratado pelo chamador
        throw new Error(`Falha ao buscar dados da API externa: ${error.message}`);
      }
    }
  }
  return data;
}

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

// Endpoint de busca dinâmica para materiais e serviços
app.get('/api/pesquisar-itens', (req, res) => {
  const { termo } = req.query;

  if (!termo || termo.length < 3) {
    return res.json([]); // Retorna vazio se o termo for muito curto
  }

  const db = new sqlite3.Database('comprasgov.db', sqlite3.OPEN_READONLY);
  
  const sql = `
    SELECT 
      codigoItem as id,
      descricaoItem as descricao,
      'material' as tipo,
      nomeGrupo as extra
    FROM itens
    WHERE descricaoItem LIKE ?
    
    UNION ALL
    
    SELECT 
      codigoServico as id,
      nomeServico as descricao,
      'servico' as tipo,
      '' as extra
    FROM itens_servico
    WHERE nomeServico LIKE ?
    
    LIMIT 50;
  `;
  
  const params = [`%${termo}%`, `%${termo}%`];

  db.all(sql, params, (err, rows) => {
    db.close();
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Erro ao consultar o banco de dados.' });
    }
    res.json(rows);
  });
});

// Endpoint de geração de relatório de preços
app.get('/api/relatorio-precos', async (req, res) => {
  const { itemId, itemType, period = '6m', state = '' } = req.query;

  if (!itemId || !itemType) {
    return res.status(400).json({ error: 'itemId e itemType são obrigatórios.' });
  }

  const hoje = new Date();
  let dataInicio;

  switch (period) {
    case '1m': dataInicio = new Date(hoje.setMonth(hoje.getMonth() - 1)); break;
    case '2m': dataInicio = new Date(hoje.setMonth(hoje.getMonth() - 2)); break;
    case '3m': dataInicio = new Date(hoje.setMonth(hoje.getMonth() - 3)); break;
    case '1y': dataInicio = new Date(hoje.setFullYear(hoje.getFullYear() - 1)); break;
    case '2y': dataInicio = new Date(hoje.setFullYear(hoje.getFullYear() - 2)); break;
    case 'all': dataInicio = null; break;
    default: dataInicio = new Date(hoje.setMonth(hoje.getMonth() - 6)); // Padrão 6m
  }

  const dataFormatada = dataInicio ? dataInicio.toISOString().split('T')[0] : null;

  const endpointBase = itemType === 'material' 
    ? 'https://dadosabertos.compras.gov.br/modulo-pesquisa-preco/1_consultarMaterial'
    : 'https://dadosabertos.compras.gov.br/modulo-pesquisa-preco/3_consultarServico';

  let todosResultados = [];
  let pagina = 1;
  const tamanhoPagina = 500;
  let continuar = true;

  try {
    while (continuar) {
      let url = `${endpointBase}?codigoItemCatalogo=${itemId}&tamanhoPagina=${tamanhoPagina}&pagina=${pagina}`;
      if (dataFormatada) url += `&dataResultado=${dataFormatada}`;
      if (state) url += `&estado=${state}`;

      const data = await fetchAndRetry(url);
      
      if (data && data.resultado && data.resultado.length > 0) {
        todosResultados = todosResultados.concat(data.resultado);
        pagina++;
        if (data.paginasRestantes === 0) {
          continuar = false;
        }
      } else {
        continuar = false;
      }
      await sleep(200); // Pausa entre as páginas para ser cortês com a API
    }

    if (todosResultados.length === 0) {
      return res.json({ message: 'Nenhum resultado encontrado para os filtros selecionados.', data: [] });
    }

    // Processamento dos dados
    const precos = todosResultados.map(r => r.valorUnitario);
    const precoMaximo = Math.max(...precos);
    const precoMinimo = Math.min(...precos);
    const precoMedio = precos.reduce((a, b) => a + b, 0) / precos.length;

    const relatorio = {
      totalItens: todosResultados.length,
      precoMaximo,
      precoMinimo,
      precoMedio,
      dados: todosResultados,
    };

    res.json(relatorio);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para exportar para CSV
app.post('/api/exportar-csv', (req, res) => {
  const { dados } = req.body;
  if (!dados || dados.length === 0) {
    return res.status(400).json({ error: 'Nenhum dado fornecido para exportação.' });
  }

  const fields = [
    { label: 'Órgão', value: 'nomeOrgao' },
    { label: 'Município', value: 'municipio' },
    { label: 'UF', value: 'estado' },
    { label: 'Data', value: 'dataResultado' },
    { label: 'Fornecedor', value: 'nomeFornecedor' },
    { label: 'CNPJ Fornecedor', value: 'cnpjFornecedor' },
    { label: 'Quantidade', value: 'quantidade' },
    { label: 'Valor Unitário', value: 'valorUnitario' },
  ];

  const json2csvParser = new Parser({ fields, delimiter: ';' });
  const csv = json2csvParser.parse(dados);

  res.header('Content-Type', 'text/csv; charset=utf-8');
  res.attachment('relatorio_precos.csv');
  res.send(csv);
});

// Endpoint para exportar para PDF
app.post('/api/exportar-pdf', (req, res) => {
  const { dados, summary, itemDescricao } = req.body;
  if (!dados || dados.length === 0) {
    return res.status(400).json({ error: 'Nenhum dado fornecido para exportação.' });
  }

  const doc = new jsPDF();

  // Cabeçalho
  doc.setFontSize(18);
  doc.text('Relatório de Pesquisa de Preços', 14, 22);
  doc.setFontSize(11);
  doc.text(`Item: ${itemDescricao}`, 14, 30);

  // Resumo
  doc.autoTable({
    startY: 35,
    body: [
      ['Contratações Encontradas', summary.totalItens],
      ['Preço Mínimo', `R$ ${summary.precoMinimo.toFixed(2)}`],
      ['Preço Máximo', `R$ ${summary.precoMaximo.toFixed(2)}`],
      ['Preço Médio', `R$ ${summary.precoMedio.toFixed(2)}`],
    ],
    theme: 'grid',
  });

  // Tabela de Dados
  const tableColumn = ["Órgão", "Município", "Data", "Fornecedor (CNPJ)", "Qtd.", "Valor Unit."];
  const tableRows = dados.map(item => [
    item.nomeOrgao,
    `${item.municipio} (${item.estado})`,
    new Date(item.dataResultado).toLocaleDateString('pt-BR'),
    `${item.nomeFornecedor} (${item.cnpjFornecedor})`,
    item.quantidade,
    `R$ ${item.valorUnitario.toFixed(2)}`
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: doc.lastAutoTable.finalY + 10,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [10, 44, 82] } // Azul Propor
  });

  // Gera o PDF como um Buffer
  const pdfBuffer = doc.output('arraybuffer');
  
  res.header('Content-Type', 'application/pdf');
  res.header('Content-Disposition', 'attachment; filename=relatorio_precos.pdf');
  res.attachment('relatorio_precos.pdf');
  res.send(Buffer.from(pdfBuffer));
});

// --- NOVOS ENDPOINTS PARA ANÁLISE DE MATERIAIS ---

// 1. Endpoint para Estatísticas Gerais de Materiais
app.get('/api/materiais/stats', (req, res) => {
  const db = new sqlite3.Database('comprasgov.db', sqlite3.OPEN_READONLY);
  
  const queries = {
    totalMateriais: `SELECT COUNT(*) as count FROM materiais`,
    totalGrupos: `SELECT COUNT(DISTINCT "Código do Grupo") as count FROM materiais`,
    totalClasses: `SELECT COUNT(DISTINCT "Código da Classe") as count FROM materiais`,
    totalPDMs: `SELECT COUNT(DISTINCT "Código PDM") as count FROM materiais`,
  };

  const promises = Object.entries(queries).map(([key, sql]) => {
    return new Promise((resolve, reject) => {
      db.get(sql, [], (err, row) => {
        if (err) reject(err);
        else resolve({ [key]: row.count });
      });
    });
  });

  Promise.all(promises)
    .then(results => {
      const stats = results.reduce((acc, current) => ({ ...acc, ...current }), {});
      res.json(stats);
    })
    .catch(err => {
      console.error("Erro ao buscar estatísticas de materiais:", err.message);
      res.status(500).json({ error: 'Erro ao consultar o banco de dados.' });
    })
    .finally(() => {
      db.close();
    });
});

// 2. Endpoint para Listagem Paginada e Filtrada de Materiais
app.get('/api/materiais', (req, res) => {
    const { page = 1, limit = 20, grupo, classe, pdm } = req.query;
    const offset = (page - 1) * limit;

    const db = new sqlite3.Database('comprasgov.db', sqlite3.OPEN_READONLY);

    let whereClauses = [];
    let params = [];

    if (grupo) {
        whereClauses.push(`"Código do Grupo" = ?`);
        params.push(grupo);
    }
    if (classe) {
        whereClauses.push(`"Código da Classe" = ?`);
        params.push(classe);
    }
    if (pdm) {
        whereClauses.push(`"Código PDM" = ?`);
        params.push(pdm);
    }

    const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const dataSql = `SELECT * FROM materiais ${where} LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) as count FROM materiais ${where}`;

    const dataParams = [...params, limit, offset];
    const countParams = [...params];

    const dataPromise = new Promise((resolve, reject) => {
        db.all(dataSql, dataParams, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });

    const countPromise = new Promise((resolve, reject) => {
        db.get(countSql, countParams, (err, row) => {
            if (err) reject(err);
            else resolve(row.count);
        });
    });

    Promise.all([dataPromise, countPromise])
        .then(([data, total]) => {
            res.json({
                total,
                pages: Math.ceil(total / limit),
                currentPage: parseInt(page, 10),
                data,
            });
        })
        .catch(err => {
            console.error("Erro ao buscar materiais:", err.message);
            res.status(500).json({ error: 'Erro ao consultar o banco de dados.' });
        })
        .finally(() => {
            db.close();
        });
});

// 3. Endpoints para popular os filtros

app.get('/api/filtros/grupos', (req, res) => {
    const db = new sqlite3.Database('comprasgov.db', sqlite3.OPEN_READONLY);
    const sql = `SELECT DISTINCT "Código do Grupo" as value, "Nome do Grupo" as label FROM materiais ORDER BY "Nome do Grupo"`;
    db.all(sql, [], (err, rows) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/filtros/classes', (req, res) => {
    const { grupo } = req.query;
    if (!grupo) return res.json([]);
    const db = new sqlite3.Database('comprasgov.db', sqlite3.OPEN_READONLY);
    const sql = `SELECT DISTINCT "Código da Classe" as value, "Nome da Classe" as label FROM materiais WHERE "Código do Grupo" = ? ORDER BY "Nome da Classe"`;
    db.all(sql, [grupo], (err, rows) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/filtros/pdms', (req, res) => {
    const { classe } = req.query;
    if (!classe) return res.json([]);
    const db = new sqlite3.Database('comprasgov.db', sqlite3.OPEN_READONLY);
    const sql = `SELECT DISTINCT "Código PDM" as value, "Nome PDM" as label FROM materiais WHERE "Código da Classe" = ? ORDER BY "Nome PDM"`;
    db.all(sql, [classe], (err, rows) => {
        db.close();
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
  console.log(`API local rodando em http://localhost:${PORT}`);
}); 