import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000/api';

const ItensDownloader: React.FC = () => {
  const [grupos, setGrupos] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [itens, setItens] = useState<any[]>([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState<string>('');
  const [classeSelecionada, setClasseSelecionada] = useState<string>('');
  const [baixando, setBaixando] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/grupos`).then(res => res.json()).then(setGrupos);
  }, []);

  useEffect(() => {
    if (grupoSelecionado) {
      fetch(`${API_URL}/classes?codigoGrupo=${grupoSelecionado}`)
        .then(res => res.json())
        .then(setClasses);
    } else {
      setClasses([]);
    }
    setClasseSelecionada('');
    setItens([]);
  }, [grupoSelecionado]);

  const handleDownload = async () => {
    setBaixando(true);
    setStatus('Baixando itens...');
    await fetch(`${API_URL}/baixar-itens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigoGrupo: grupoSelecionado, codigoClasse: classeSelecionada || undefined })
    });
    setStatus('Itens baixados! Buscando no banco local...');
    fetchItens();
    setBaixando(false);
  };

  const fetchItens = () => {
    let url = `${API_URL}/itens?codigoGrupo=${grupoSelecionado}`;
    if (classeSelecionada) url += `&codigoClasse=${classeSelecionada}`;
    fetch(url)
      .then(res => res.json())
      .then(setItens);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '32px auto', padding: 16 }}>
      <h2>Baixar Itens por Grupo e Classe</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div>
          <label>Grupo:</label><br />
          <select value={grupoSelecionado} onChange={e => setGrupoSelecionado(e.target.value)}>
            <option value="">Selecione...</option>
            {grupos.map(g => (
              <option key={g.codigoGrupo} value={g.codigoGrupo}>
                {g.codigoGrupo} - {g.nomeGrupo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Classe (opcional):</label><br />
          <select value={classeSelecionada} onChange={e => setClasseSelecionada(e.target.value)} disabled={!classes.length}>
            <option value="">Todas</option>
            {classes.map(c => (
              <option key={c.codigoClasse} value={c.codigoClasse}>
                {c.codigoClasse} - {c.nomeClasse}
              </option>
            ))}
          </select>
        </div>
        <div style={{ alignSelf: 'end' }}>
          <button onClick={handleDownload} disabled={!grupoSelecionado || baixando}>
            {baixando ? 'Baixando...' : 'Baixar Itens'}
          </button>
        </div>
      </div>
      {status && <div style={{ marginBottom: 16 }}>{status}</div>}
      {itens.length > 0 && (
        <div>
          <h3>Itens Baixados ({itens.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th style={{ padding: 4, border: '1px solid #ccc' }}>Código</th>
                <th style={{ padding: 4, border: '1px solid #ccc' }}>Descrição</th>
                <th style={{ padding: 4, border: '1px solid #ccc' }}>Grupo</th>
                <th style={{ padding: 4, border: '1px solid #ccc' }}>Classe</th>
                <th style={{ padding: 4, border: '1px solid #ccc' }}>PDM</th>
                <th style={{ padding: 4, border: '1px solid #ccc' }}>Status</th>
                <th style={{ padding: 4, border: '1px solid #ccc' }}>Sustentável</th>
                <th style={{ padding: 4, border: '1px solid #ccc' }}>NCM</th>
                <th style={{ padding: 4, border: '1px solid #ccc' }}>Descrição NCM</th>
                <th style={{ padding: 4, border: '1px solid #ccc' }}>Margem Preferência</th>
                <th style={{ padding: 4, border: '1px solid #ccc' }}>Atualização</th>
              </tr>
            </thead>
            <tbody>
              {itens.map(item => (
                <tr key={item.codigoItem + '-' + item.codigoGrupo + '-' + item.codigoClasse}>
                  <td style={{ padding: 4, border: '1px solid #ccc' }}>{item.codigoItem}</td>
                  <td style={{ padding: 4, border: '1px solid #ccc' }}>{item.descricaoItem}</td>
                  <td style={{ padding: 4, border: '1px solid #ccc' }}>{item.nomeGrupo}</td>
                  <td style={{ padding: 4, border: '1px solid #ccc' }}>{item.nomeClasse}</td>
                  <td style={{ padding: 4, border: '1px solid #ccc' }}>{item.nomePdm}</td>
                  <td style={{ padding: 4, border: '1px solid #ccc' }}>{item.statusItem ? 'Ativo' : 'Inativo'}</td>
                  <td style={{ padding: 4, border: '1px solid #ccc' }}>{item.itemSustentavel ? 'Sim' : 'Não'}</td>
                  <td style={{ padding: 4, border: '1px solid #ccc' }}>{item.codigo_ncm}</td>
                  <td style={{ padding: 4, border: '1px solid #ccc' }}>{item.descricao_ncm}</td>
                  <td style={{ padding: 4, border: '1px solid #ccc' }}>{item.aplica_margem_preferencia}</td>
                  <td style={{ padding: 4, border: '1px solid #ccc' }}>{item.dataHoraAtualizacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ItensDownloader; 