import React from 'react';
import { Package, DollarSign, Calendar, Tag } from 'lucide-react';
import { Material } from '../types';

interface MaterialCardProps {
  material: Material;
  onViewDetails: (material: Material) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onViewDetails }) => {
  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => onViewDetails(material)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium text-secondary-600 bg-secondary-100 px-2 py-1 rounded">
            {material.codigo}
          </span>
        </div>
        {material.status && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            material.status === 'ATIVO' 
              ? 'bg-green-100 text-green-800' 
              : material.status === 'INATIVO'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {material.status}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-lg text-secondary-900 mb-3 line-clamp-2">
        {material.descricao}
      </h3>

      <div className="space-y-2 text-sm text-secondary-600">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          <span>Unidade: {material.unidadeFornecimento}</span>
        </div>

        {material.precoUnitario && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>Preço: {formatPrice(material.precoUnitario)}</span>
          </div>
        )}

        {material.precoMaximo && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>Preço Máximo: {formatPrice(material.precoMaximo)}</span>
          </div>
        )}

        {material.dataAtualizacao && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Atualizado em: {formatDate(material.dataAtualizacao)}</span>
          </div>
        )}

        {material.grupo && (
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>Grupo: {material.grupo}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-secondary-200">
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
          Ver detalhes →
        </button>
      </div>
    </div>
  );
};

export default MaterialCard; 