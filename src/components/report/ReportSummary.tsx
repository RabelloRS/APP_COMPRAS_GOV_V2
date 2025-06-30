import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

const SummaryCard = ({ title, value, icon }: SummaryCardProps) => (
  <div className="bg-gray-50 p-4 rounded-lg border flex items-center">
    {icon && <div className="mr-4 text-blue-500">{icon}</div>}
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

interface ReportSummaryProps {
  totalItens: number;
  precoMaximo: number;
  precoMinimo: number;
  precoMedio: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const ReportSummary = ({ totalItens, precoMaximo, precoMinimo, precoMedio }: ReportSummaryProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <SummaryCard title="Contratações Encontradas" value={totalItens} />
    <SummaryCard title="Preço Máximo" value={formatCurrency(precoMaximo)} />
    <SummaryCard title="Preço Mínimo" value={formatCurrency(precoMinimo)} />
    <SummaryCard title="Preço Médio" value={formatCurrency(precoMedio)} />
  </div>
); 