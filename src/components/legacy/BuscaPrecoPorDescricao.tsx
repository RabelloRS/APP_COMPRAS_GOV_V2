import React, { useState } from 'react';

const BuscaPrecoPorDescricao: React.FC = () => {
  const [descricao, setDescricao] = useState('');
  const [itens, setItens] = useState<any[]>([]);
  const [carregandoItens, setCarregandoItens] = useState(false);
  const [erroItens, setErroItens] = useState<string | null>(null);

  const [precos, setPrecos] = useState<any | null>(null);
  const [carregandoPrecos, setCarregandoPrecos] = useState(false);
  const [erroPrecos, setErroPrecos] = useState<string | null>(null);
  const [itemSelecionado, setItemSelecionado] = useState<any | null>(null);

  const buscarItens = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregandoItens(true);
    setErroItens(null);
    setItens([]);
    setPrecos(null);
    setItemSelecionado(null);
    try {
      const resp = await fetch(`/modulo-material/4_consultarItemMaterial?pagina=1&tamanhoPagina=10&descricaoItem=${encodeURIComponent(descricao)}`);
      const json = await resp.json();
      setItens(json.resultado || []);
      if ((json.resultado || []).length === 0) setErroItens('Nenhum item encontrado.');
    } catch {
      setErroItens('Erro ao buscar itens.');
    } finally {
      setCarregandoItens(false);
    }
  };

  const buscarPrecos = async (codigoItem: number) => {
    setCarregandoPrecos(true);
    setErroPrecos(null);
    setPrecos(null);
    setItemSelecionado(itens.find(i => i.codigoItem === codigoItem));
    try {
      const resp = await fetch(`/modulo-pesquisa-preco/1_consultarMaterial?pagina=1&tamanhoPagina=10&codigoItemCatalogo=${codigoItem}`);
      const json = await resp.json();
      setPrecos(json);
      if ((json.resultado || []).length === 0) setErroPrecos('Nenhum preço encontrado para este item.');
    } catch {
      setErroPrecos('Erro ao buscar preços.');
    } finally {
      setCarregandoPrecos(false);
    }
  };

  return (
    <div style={{maxWidth: 600, margin: '32px auto', padding: 16, background: '#fafafa', borderRadius: 8}}>
      <h2>Consulta de Preço por Descrição</h2>
      <form onSubmit={buscarItens} style={{marginBottom: 16}}>
        <input
          type="text"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          placeholder="Digite a descrição do item (ex: tijolo)"
          style={{padding: 8, width: '70%', marginRight: 8}}
        />
        <button type="submit" style={{padding: 8}}>Buscar</button>
      </form>
      {carregandoItens && <div>Buscando itens...</div>}
      {erroItens && <div style={{color: 'red'}}>{erroItens}</div>}
      {itens.length > 0 && (
        <div style={{marginBottom: 16}}>
          <strong>Itens encontrados:</strong>
          <ul style={{listStyle: 'none', padding: 0}}>
            {itens.map(item => (
              <li key={item.codigoItem} style={{margin: '8px 0'}}>
                <button onClick={() => buscarPrecos(item.codigoItem)} style={{cursor: 'pointer', background: '#eee', border: '1px solid #ccc', borderRadius: 4, padding: 6}}>
                  {item.codigoItem} - {item.descricaoItem || item.descricao}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {carregandoPrecos && <div>Buscando preços...</div>}
      {erroPrecos && <div style={{color: 'red'}}>{erroPrecos}</div>}
      {precos && (
        <div>
          <h3>Preços praticados para: {itemSelecionado?.descricaoItem || itemSelecionado?.descricao}</h3>
          <pre style={{background: '#eee', padding: 8, borderRadius: 4, overflowX: 'auto'}}>
            {JSON.stringify(precos, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default BuscaPrecoPorDescricao; 