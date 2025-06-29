import React, { useState } from 'react';
import { TestTube, Package, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { comprasGovApi } from '../services/api';

const ApiTester: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('grupos');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testEndpoint = async (endpoint: string, params?: any) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let result;
      switch (endpoint) {
        case 'grupos':
          result = await comprasGovApi.getGruposMateriais(params);
          break;
        case 'classes':
          result = await comprasGovApi.getClassesMateriais(params);
          break;
        case 'servicos':
          result = await comprasGovApi.searchServices(params);
          break;
        default:
          throw new Error('Endpoint não implementado');
      }
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'grupos', name: 'Grupos de Materiais', icon: Package },
    { id: 'classes', name: 'Classes de Materiais', icon: Settings },
    { id: 'servicos', name: 'Serviços', icon: TestTube },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
        <TestTube className="w-5 h-5 text-primary-600" />
        Testador de API
      </h3>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Test Controls */}
      <div className="mb-6">
        {activeTab === 'grupos' && (
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900">Testar Grupos de Materiais</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => testEndpoint('grupos', { pagina: 1 })}
                disabled={loading}
                className="btn-secondary text-sm"
              >
                Buscar Primeira Página
              </button>
              <button
                onClick={() => testEndpoint('grupos', { statusGrupo: true })}
                disabled={loading}
                className="btn-secondary text-sm"
              >
                Grupos Ativos
              </button>
              <button
                onClick={() => testEndpoint('grupos', { codigoGrupo: 16 })}
                disabled={loading}
                className="btn-secondary text-sm"
              >
                Grupo Código 16
              </button>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900">Testar Classes de Materiais</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => testEndpoint('classes', { pagina: 1 })}
                disabled={loading}
                className="btn-secondary text-sm"
              >
                Buscar Primeira Página
              </button>
              <button
                onClick={() => testEndpoint('classes', { codigoClasse: 1615 })}
                disabled={loading}
                className="btn-secondary text-sm"
              >
                Classe Código 1615
              </button>
              <button
                onClick={() => testEndpoint('classes', { codigoGrupo: 16, statusClasse: true })}
                disabled={loading}
                className="btn-secondary text-sm"
              >
                Classes do Grupo 16 (Ativas)
              </button>
            </div>
          </div>
        )}

        {activeTab === 'servicos' && (
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900">Testar Serviços</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => testEndpoint('servicos', { pagina: 1, tamanhoPagina: 10 })}
                disabled={loading}
                className="btn-secondary text-sm"
              >
                Primeiros 10 Serviços
              </button>
              <button
                onClick={() => testEndpoint('servicos', { statusServico: true })}
                disabled={loading}
                className="btn-secondary text-sm"
              >
                Serviços Ativos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-secondary-600">Testando API...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-red-800">
            <span className="text-sm font-medium">Erro:</span>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="space-y-4">
          <h4 className="font-medium text-secondary-900">Resultados:</h4>
          <div className="bg-secondary-50 rounded-lg p-4">
            <pre className="text-xs text-secondary-700 overflow-auto max-h-96">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
          
          {/* Summary */}
          {results.resultado && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-medium text-secondary-900">Total de Registros</div>
                <div className="text-2xl font-bold text-primary-600">{results.totalRegistros || 0}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-medium text-secondary-900">Total de Páginas</div>
                <div className="text-2xl font-bold text-primary-600">{results.totalPaginas || 0}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-medium text-secondary-900">Páginas Restantes</div>
                <div className="text-2xl font-bold text-primary-600">{results.paginasRestantes || 0}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTester; 