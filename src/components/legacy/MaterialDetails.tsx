import React from 'react';
import { X, Package, DollarSign, Calendar, Tag, Building, Info } from 'lucide-react';
import { Material } from '../types';

interface MaterialDetailsProps {
  material: Material | null;
  isOpen: boolean;
  onClose: () => void;
}

const MaterialDetails: React.FC<MaterialDetailsProps> = ({ material, isOpen, onClose }) => {
  if (!isOpen || !material) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-secondary-900">
              Detalhes do Material
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-secondary-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Código e Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-secondary-600 bg-secondary-100 px-3 py-1 rounded">
                Código: {material.codigo}
              </span>
            </div>
            {material.status && (
              <span className={`text-sm px-3 py-1 rounded-full ${
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

          {/* Descrição */}
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Descrição
            </h3>
            <p className="text-secondary-700 leading-relaxed">
              {material.descricao}
            </p>
          </div>

          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-secondary-500" />
                <span className="text-sm text-secondary-600">Unidade de Fornecimento:</span>
                <span className="text-sm font-medium text-secondary-900">
                  {material.unidadeFornecimento}
                </span>
              </div>

              {material.grupo && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600">Grupo:</span>
                  <span className="text-sm font-medium text-secondary-900">
                    {material.grupo}
                  </span>
                </div>
              )}

              {material.subgrupo && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600">Subgrupo:</span>
                  <span className="text-sm font-medium text-secondary-900">
                    {material.subgrupo}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {material.classe && (
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600">Classe:</span>
                  <span className="text-sm font-medium text-secondary-900">
                    {material.classe}
                  </span>
                </div>
              )}

              {material.padrao && (
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600">Padrão:</span>
                  <span className="text-sm font-medium text-secondary-900">
                    {material.padrao}
                  </span>
                </div>
              )}

              {material.item && (
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-600">Item:</span>
                  <span className="text-sm font-medium text-secondary-900">
                    {material.item}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Preços */}
          {(material.precoUnitario || material.precoMaximo || material.precoMinimo) && (
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary-600" />
                Informações de Preço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {material.precoUnitario && (
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <div className="text-sm text-secondary-600 mb-1">Preço Unitário</div>
                    <div className="text-lg font-semibold text-primary-600">
                      {formatPrice(material.precoUnitario)}
                    </div>
                  </div>
                )}
                {material.precoMaximo && (
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <div className="text-sm text-secondary-600 mb-1">Preço Máximo</div>
                    <div className="text-lg font-semibold text-red-600">
                      {formatPrice(material.precoMaximo)}
                    </div>
                  </div>
                )}
                {material.precoMinimo && (
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <div className="text-sm text-secondary-600 mb-1">Preço Mínimo</div>
                    <div className="text-lg font-semibold text-green-600">
                      {formatPrice(material.precoMinimo)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Data de Atualização */}
          {material.dataAtualizacao && (
            <div className="flex items-center gap-2 text-sm text-secondary-600">
              <Calendar className="w-4 h-4" />
              <span>Última atualização: {formatDate(material.dataAtualizacao)}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-secondary-200">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetails; 