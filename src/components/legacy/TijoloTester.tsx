import React, { useState, useEffect } from 'react';
import comprasGovApi from '../services/api';
import { Material } from '../types';

const TijoloTester: React.FC = () => {
  const [tijolos, setTijolos] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTijolos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await comprasGovApi.searchMaterials({ descricao: 'tijolo', pagina: 1 });
        console.log('Resposta da API:', response);
        // @ts-ignore
        setTijolos(response.content || response.resultado || response);
      } catch (err) {
        setError('Falha ao buscar dados sobre tijolos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTijolos();
  }, []);

  if (loading) {
    return <div className="p-4">Carregando dados de tijolos...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teste de API: Tijolos</h1>
      {tijolos.length > 0 ? (
        <ul className="list-disc list-inside">
          {tijolos.map((tijolo) => (
            <li key={tijolo.codigoItem}>
              {tijolo.codigoItem} - {tijolo.descricao} ({tijolo.status ? 'Ativo' : 'Inativo'})
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum tijolo encontrado.</p>
      )}
    </div>
  );
};

export default TijoloTester; 