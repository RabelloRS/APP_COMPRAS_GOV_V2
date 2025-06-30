import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

// Definindo os tipos para os resultados e props
interface SearchResult {
  id: number;
  descricao: string;
  tipo: 'material' | 'servico';
  extra: string;
}

interface DynamicSearchProps {
  onItemSelected: (item: SearchResult) => void;
}

export const DynamicSearch = ({ onItemSelected }: DynamicSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  useEffect(() => {
    const searchItems = async () => {
      if (debouncedSearchTerm.length < 3) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/api/pesquisar-itens?termo=${debouncedSearchTerm}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
        setResults([]); // Limpa os resultados em caso de erro
      } finally {
        setIsLoading(false);
      }
    };

    searchItems();
  }, [debouncedSearchTerm]);

  const handleSelect = (item: SearchResult) => {
    setSearchTerm(item.descricao);
    setResults([]);
    onItemSelected(item);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Digite o nome do material ou serviço..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-propor-gold"
      />
      {isLoading && <div className="absolute top-full left-0 w-full p-2 bg-white border border-gray-300 rounded-b-lg">Buscando...</div>}
      
      {!isLoading && results.length > 0 && (
        <ul className="absolute z-10 top-full left-0 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-b-lg shadow-lg">
          {results.map((item) => (
            <li
              key={`${item.tipo}-${item.id}`}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 cursor-pointer hover:bg-yellow-50"
            >
              <div className="font-semibold">{item.descricao}</div>
              <div className="text-sm text-gray-500">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.tipo === 'material' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                  {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                </span>
                {item.extra && <span className="ml-2">{item.extra}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}; 