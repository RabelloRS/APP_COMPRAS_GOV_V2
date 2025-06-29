import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  loading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    descricao: '',
    codigo: '',
    grupo: '',
    status: '',
    page: 0,
    size: 20
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      descricao: '',
      codigo: '',
      grupo: '',
      status: '',
      page: 0,
      size: 20
    });
  };

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 0 // Reset page when filters change
    }));
  };

  return (
    <div className="card mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Busca principal */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Digite a descrição do material..."
              value={filters.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 min-w-[120px] justify-center"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Buscar
          </button>
        </div>

        {/* Filtros avançados */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-secondary-600 hover:text-secondary-800 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtros Avançados
            {showAdvanced && <X className="w-4 h-4" />}
          </button>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-secondary-200">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Código do Material
              </label>
              <input
                type="text"
                placeholder="Ex: 123456"
                value={filters.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Grupo
              </label>
              <input
                type="text"
                placeholder="Código do grupo"
                value={filters.grupo}
                onChange={(e) => handleInputChange('grupo', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="input-field"
              >
                <option value="">Todos</option>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="SUSPENSO">Suspenso</option>
              </select>
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-3 pt-4 border-t border-secondary-200">
          <button
            type="button"
            onClick={handleClear}
            className="btn-secondary flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm; 