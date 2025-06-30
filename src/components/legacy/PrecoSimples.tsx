import React, { useEffect, useState } from 'react';
import comprasGovApi from '../services/api';

const PrecoSimples: React.FC = () => {
  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchPreco = async () => {
      setCarregando(true);
      setErro(null);
      try {
        const response = await fetch('/modulo-pesquisa-preco/1_consultarMaterial?pagina=1&tamanhoPagina=10&codigoItemCatalogo=206504', {
          headers: {
            'accept': 'application/json'
          }
        });
        const json = await response.json();
        setDados(json);
      } catch (e) {
        setErro('Erro ao buscar dados');
      } finally {
        setCarregando(false);
      }
    };
    fetchPreco();
  }, []);

  if (carregando) return <div>Carregando...</div>;
  if (erro) return <div style={{color: 'red'}}>{erro}</div>;

  return (
    <div style={{padding: 16}}>
      <h2>Teste de Preço Praticado (item 206504)</h2>
      <pre style={{background: '#eee', padding: 8, borderRadius: 4, overflowX: 'auto'}}>
        {JSON.stringify(dados, null, 2)}
      </pre>
    </div>
  );
};

export default PrecoSimples; 