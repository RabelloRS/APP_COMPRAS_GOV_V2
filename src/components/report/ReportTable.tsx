import React from 'react';

// Simplificando o tipo do item por enquanto
type ReportItem = any;

interface ReportTableProps {
  data: ReportItem[];
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const formatCurrency = (value: number) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const ReportTable = ({ data }: ReportTableProps) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">Nenhum dado detalhado para exibir.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Órgão</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Município</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor (CNPJ)</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd.</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Unit.</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={item.idCompra || index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.nomeOrgao}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.municipio} ({item.estado})</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.dataResultado)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nomeFornecedor} ({item.cnpjFornecedor})</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{item.quantidade}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-800">{formatCurrency(item.valorUnitario)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 