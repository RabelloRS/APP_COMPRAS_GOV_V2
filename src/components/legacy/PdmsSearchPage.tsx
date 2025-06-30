import React, { useState } from 'react';
import comprasGovApi from '../services/api';
import { Pdm } from '../types';

const PdmsSearchPage: React.FC = () => {
  const [descricao, setDescricao] = useState('');
  const [codigoClasse, setCodigoClasse] = useState('');
  const [pdms, setPdms] = useState<Pdm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const pageSize = 50;

  const buscarPdms = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await comprasGovApi.searchPdms({
        descricao: descricao || undefined,
        codigo_classe: codigoClasse ? Number(codigoClasse) : undefined,
        offset,
      });
      setPdms(result.content || []);
      setTotal(result.totalElements || 0);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar PDMs.');
      setPdms([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
    setTimeout(() => buscarPdms(), 0);
  };

  return (
    <div style={{ maxWidth: 800, margin: '32px auto', padding: 16, background: '#fafafa', borderRadius: 8 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Pesquisa de Padrão Descritivo de Material (PDM)</h2>
      <form onSubmit={buscarPdms} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          placeholder="Descrição do PDM"
          style={{ padding: 8, flex: 1, minWidth: 180 }}
        />
        <input
          type="number"
          value={codigoClasse}
          onChange={e => setCodigoClasse(e.target.value)}
          placeholder="Código da Classe"
          style={{ padding: 8, width: 160 }}
        />
        <button type="submit" style={{ padding: 8, minWidth: 100 }}>Buscar</button>
      </form>
      {loading && <div>Carregando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && pdms.length === 0 && (
        <div style={{ color: '#666', margin: '16px 0' }}>Nenhum resultado encontrado.</div>
      )}
      {pdms.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Código</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Descrição</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Código Classe</th>
              </tr>
            </thead>
            <tbody>
              {pdms.map((pdm) => (
                <tr key={pdm.codigo}>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{pdm.codigo}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{pdm.descricao}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{pdm.codigo_classe}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <button
              onClick={() => handlePageChange(Math.max(0, offset - pageSize))}
              disabled={offset === 0 || loading}
              style={{ padding: 8 }}
            >
              Anterior
            </button>
            <span>Página {Math.floor(offset / pageSize) + 1} de {Math.ceil(total / pageSize) || 1}</span>
            <button
              onClick={() => handlePageChange(offset + pageSize)}
              disabled={offset + pageSize >= total || loading}
              style={{ padding: 8 }}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdmsSearchPage; 