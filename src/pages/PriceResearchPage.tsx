import React, { useState } from 'react';
import { DynamicSearch } from '../components/search/DynamicSearch';
import { ReportSummary } from '../components/report/ReportSummary';
import { ReportTable } from '../components/report/ReportTable';

// O tipo SearchResult precisa ser importado ou definido aqui também se for usado fora do DynamicSearch
interface SearchResult {
  id: number;
  descricao: string;
  tipo: 'material' | 'servico';
  extra: string;
}

// Tipo para os dados do relatório
interface ReportData {
  totalItens: number;
  precoMaximo: number;
  precoMinimo: number;
  precoMedio: number;
  dados: any[]; // Vamos manter como 'any' por enquanto para simplificar
}

const PriceResearchPage = () => {
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [period, setPeriod] = useState('6m');
  const [state, setState] = useState('');
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!selectedItem) {
      setError('Por favor, selecione um item primeiro.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
      const url = `http://localhost:4000/api/relatorio-precos?itemId=${selectedItem.id}&itemType=${selectedItem.tipo}&period=${period}&state=${state}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setReport(data);
      } else {
        throw new Error(data.error || 'Erro ao gerar o relatório.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (!report || !report.dados || !selectedItem) return;
    
    const endpoint = `http://localhost:4000/api/exportar-${format}`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dados: report.dados,
          summary: {
            totalItens: report.totalItens,
            precoMinimo: report.precoMinimo,
            precoMaximo: report.precoMaximo,
            precoMedio: report.precoMedio,
          },
          itemDescricao: selectedItem.descricao,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na exportação.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_precos.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      setError(err.message || 'Erro ao exportar dados.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Seção de Pesquisa e Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pesquisa de Preços de Itens</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Material ou Serviço
            </label>
            <DynamicSearch onItemSelected={setSelectedItem} />
          </div>
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-propor-gold"
            >
              <option value="6m">Últimos 6 meses</option>
              <option value="1m">Último mês</option>
              <option value="2m">Últimos 2 meses</option>
              <option value="3m">Últimos 3 meses</option>
              <option value="1y">Último ano</option>
              <option value="2y">Últimos 2 anos</option>
              <option value="all">Todo o período</option>
            </select>
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              Estado (UF)
            </label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
              placeholder="Ex: RS, SP, MG"
              maxLength={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-propor-gold"
            />
          </div>
          <div className="self-end">
            <button
              onClick={handleGenerateReport}
              disabled={!selectedItem || isLoading}
              className="w-full px-4 py-2 bg-propor-gold text-white font-semibold rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-propor-gold focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
          </div>
        </div>
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>

      {/* Seção de Relatório */}
      {isLoading && (
        <div className="flex justify-center items-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-600">Carregando relatório...</p>
        </div>
      )}

      {report && !isLoading && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Relatório de Preços</h2>
            <div className="flex space-x-2">
              <button onClick={() => handleExport('csv')} className="px-4 py-2 text-sm bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Exportar CSV</button>
              <button onClick={() => handleExport('pdf')} className="px-4 py-2 text-sm bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Exportar PDF</button>
            </div>
          </div>
          {report.totalItens > 0 ? (
            <>
              <ReportSummary 
                totalItens={report.totalItens}
                precoMaximo={report.precoMaximo}
                precoMinimo={report.precoMinimo}
                precoMedio={report.precoMedio}
              />
              <ReportTable data={report.dados} />
            </>
          ) : (
            <p className="text-gray-600">Nenhum resultado encontrado para os filtros selecionados.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceResearchPage; 