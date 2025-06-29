import React, { useState, useEffect } from 'react';
import { Building2, Database, ExternalLink, Package, AlertCircle, TestTube } from 'lucide-react';
import { Material, MaterialSearchResponse, SearchFilters } from './types';
import { comprasGovApi } from './services/api';
import SearchForm from './components/SearchForm';
import MaterialList from './components/MaterialList';
import MaterialDetails from './components/MaterialDetails';
import ApiTester from './components/ApiTester';

const App: React.FC = () => {
  const [searchResult, setSearchResult] = useState<MaterialSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [gruposMateriais, setGruposMateriais] = useState<any[]>([]);
  const [showApiTester, setShowApiTester] = useState(false);

  // Testar conexão com a API ao carregar
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const connected = await comprasGovApi.testConnection();
        setApiConnected(connected);
        
        if (connected) {
          // Carregar alguns grupos de materiais como exemplo
          const grupos = await comprasGovApi.getGruposMateriais({ pagina: 1, statusGrupo: true });
          setGruposMateriais(grupos.resultado || []);
        }
      } catch (error) {
        setApiConnected(false);
        console.error('Erro ao testar conexão:', error);
      }
    };

    testApiConnection();
  }, []);

  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await comprasGovApi.searchMaterials(filters);
      setSearchResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (!searchResult) return;
    
    const currentFilters: SearchFilters = {
      descricao: searchResult.content[0]?.descricao || '',
      page,
      size: searchResult.size
    };
    
    await handleSearch(currentFilters);
  };

  const handleViewDetails = (material: Material) => {
    setSelectedMaterial(material);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMaterial(null);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-8 h-8 text-primary-600" />
                <h1 className="text-xl font-bold text-secondary-900">
                  Compras.gov
                </h1>
              </div>
              <span className="text-secondary-500">|</span>
              <span className="text-secondary-600 font-medium">
                Consulta de Materiais
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowApiTester(!showApiTester)}
                className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors text-sm"
              >
                <TestTube className="w-4 h-4" />
                {showApiTester ? 'Ocultar' : 'Testar'} API
              </button>
              <a
                href="https://catalogo.compras.gov.br/cnbs-web/busca"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors text-sm"
              >
                <Database className="w-4 h-4" />
                Catálogo Oficial
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Catálogo de Materiais do Governo Federal
          </h2>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Consulte o Catálogo de Materiais (CATMAT) do Sistema Integrado de Administração e Serviços Gerais (SIASG). 
            Encontre materiais licitados e adquiridos pela Administração Pública Federal com informações detalhadas sobre preços e especificações.
          </p>
        </div>

        {/* Status da API */}
        {apiConnected !== null && (
          <div className={`card mb-6 ${apiConnected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${apiConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${apiConnected ? 'text-green-800' : 'text-red-800'}`}>
                {apiConnected ? 'Conectado à API do Compras.gov' : 'Erro de conexão com a API'}
              </span>
            </div>
            {!apiConnected && (
              <p className="text-red-700 text-sm mt-2">
                Não foi possível conectar à API. Verifique sua conexão com a internet.
              </p>
            )}
          </div>
        )}

        {/* API Tester */}
        {showApiTester && (
          <div className="mb-8">
            <ApiTester />
          </div>
        )}

        {/* Grupos de Materiais (Exemplo) */}
        {apiConnected && gruposMateriais.length > 0 && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              Grupos de Materiais Disponíveis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gruposMateriais.slice(0, 6).map((grupo) => (
                <div key={grupo.codigoGrupo} className="p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-secondary-600">
                      Código: {grupo.codigoGrupo}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      grupo.statusGrupo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {grupo.statusGrupo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <h4 className="font-medium text-secondary-900 text-sm">
                    {grupo.nomeGrupo}
                  </h4>
                  <p className="text-xs text-secondary-600 mt-1">
                    Atualizado: {new Date(grupo.dataHoraAtualizacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Form */}
        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* Error Message */}
        {error && (
          <div className="card mb-6 bg-red-50 border-red-200">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Material List */}
        <MaterialList
          searchResult={searchResult}
          loading={loading}
          onViewDetails={handleViewDetails}
          onPageChange={handlePageChange}
        />

        {/* Material Details Modal */}
        <MaterialDetails
          material={selectedMaterial}
          isOpen={showDetails}
          onClose={handleCloseDetails}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-secondary-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-secondary-600">
            <p className="mb-2">
              Dados fornecidos pela API de Dados Abertos do Compras.gov v1.3.0
            </p>
            <p className="text-sm">
              Sistema Integrado de Administração e Serviços Gerais (SIASG) - Ministério da Economia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App; 