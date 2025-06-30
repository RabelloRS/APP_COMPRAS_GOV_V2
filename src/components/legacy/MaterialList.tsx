import React from 'react';
import { ChevronLeft, ChevronRight, Package, AlertCircle } from 'lucide-react';
import { Material, MaterialSearchResponse } from '../types';
import MaterialCard from './MaterialCard';

interface MaterialListProps {
  searchResult: MaterialSearchResponse | null;
  loading: boolean;
  onViewDetails: (material: Material) => void;
  onPageChange: (page: number) => void;
}

const MaterialList: React.FC<MaterialListProps> = ({
  searchResult,
  loading,
  onViewDetails,
  onPageChange
}) => {
  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-secondary-600">Buscando materiais...</span>
        </div>
      </div>
    );
  }

  if (!searchResult) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12 text-center">
          <div className="flex flex-col items-center">
            <Package className="w-12 h-12 text-secondary-400 mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Nenhuma busca realizada
            </h3>
            <p className="text-secondary-600">
              Digite um termo de busca para encontrar materiais no catálogo do Compras.gov
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (searchResult.content.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12 text-center">
          <div className="flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-secondary-400 mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Nenhum material encontrado
            </h3>
            <p className="text-secondary-600">
              Tente ajustar os filtros de busca ou usar termos diferentes
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResult.content.map((material) => (
          <MaterialCard
            key={material.codigo}
            material={material}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Paginação */}
      {searchResult.totalPages > 1 && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary-600">
              Mostrando {searchResult.content.length} de {searchResult.totalElements} materiais
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(searchResult.number - 1)}
                disabled={searchResult.first}
                className="p-2 rounded-lg border border-secondary-300 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-sm text-secondary-600 px-3">
                Página {searchResult.number + 1} de {searchResult.totalPages}
              </span>
              
              <button
                onClick={() => onPageChange(searchResult.number + 1)}
                disabled={searchResult.last}
                className="p-2 rounded-lg border border-secondary-300 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialList; 