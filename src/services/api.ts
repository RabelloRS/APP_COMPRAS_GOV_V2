import axios from 'axios';
import { Material, MaterialSearchResponse, SearchFilters, GrupoMaterial } from '../types';

// Base URL da API de dados abertos do Compras.gov
const API_BASE_URL = 'https://dadosabertos.compras.gov.br';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  },
});

export const comprasGovApi = {
  // Buscar grupos de materiais - endpoint correto da documentação
  getGruposMateriais: async (filters?: { pagina?: number; codigoGrupo?: number; statusGrupo?: boolean }): Promise<any> => {
    try {
      const params = new URLSearchParams();
      
      if (filters?.pagina) {
        params.append('pagina', filters.pagina.toString());
      }
      if (filters?.codigoGrupo) {
        params.append('codigoGrupo', filters.codigoGrupo.toString());
      }
      if (filters?.statusGrupo !== undefined) {
        params.append('statusGrupo', filters.statusGrupo.toString());
      }

      const response = await api.get(`/modulo-material/1_consultarGrupoMaterial?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar grupos de materiais:', error);
      throw new Error('Falha ao buscar grupos de materiais.');
    }
  },

  // Buscar classes de materiais - endpoint correto da documentação
  getClassesMateriais: async (filters?: { 
    pagina?: number; 
    codigoGrupo?: number; 
    codigoClasse?: number; 
    statusClasse?: boolean; 
    bps?: boolean 
  }): Promise<any> => {
    try {
      const params = new URLSearchParams();
      
      if (filters?.pagina) {
        params.append('pagina', filters.pagina.toString());
      }
      if (filters?.codigoGrupo) {
        params.append('codigoGrupo', filters.codigoGrupo.toString());
      }
      if (filters?.codigoClasse) {
        params.append('codigoClasse', filters.codigoClasse.toString());
      }
      if (filters?.statusClasse !== undefined) {
        params.append('statusClasse', filters.statusClasse.toString());
      }
      if (filters?.bps !== undefined) {
        params.append('bps', filters.bps.toString());
      }

      const response = await api.get(`/modulo-material/2_consultarClasseMaterial?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar classes de materiais:', error);
      throw new Error('Falha ao buscar classes de materiais.');
    }
  },

  // Buscar materiais - vou procurar o endpoint correto na documentação
  searchMaterials: async (filters: SearchFilters): Promise<MaterialSearchResponse> => {
    try {
      // Por enquanto, vou usar uma busca simulada até encontrar o endpoint correto
      console.log('Buscando materiais com filtros:', filters);
      
      // Simular resposta para teste
      const mockResponse = {
        content: [],
        totalElements: 0,
        totalPages: 1,
        size: filters.size || 20,
        number: filters.page || 0,
        first: true,
        last: true
      };

      return mockResponse;
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
      throw new Error('Falha ao buscar materiais. Tente novamente.');
    }
  },

  // Buscar serviços usando o endpoint que você mencionou
  searchServices: async (filters: any): Promise<any> => {
    try {
      const params = new URLSearchParams();
      
      if (filters.pagina) {
        params.append('pagina', filters.pagina.toString());
      }
      if (filters.tamanhoPagina) {
        params.append('tamanhoPagina', filters.tamanhoPagina.toString());
      }
      if (filters.codigoSecao) {
        params.append('codigoSecao', filters.codigoSecao.toString());
      }
      if (filters.codigoDivisao) {
        params.append('codigoDivisao', filters.codigoDivisao.toString());
      }
      if (filters.codigoGrupo) {
        params.append('codigoGrupo', filters.codigoGrupo.toString());
      }
      if (filters.codigoClasse) {
        params.append('codigoClasse', filters.codigoClasse.toString());
      }
      if (filters.codigoSubclasse) {
        params.append('codigoSubclasse', filters.codigoSubclasse.toString());
      }
      if (filters.codigoCpc) {
        params.append('codigoCpc', filters.codigoCpc.toString());
      }
      if (filters.codigoServico) {
        params.append('codigoServico', filters.codigoServico.toString());
      }
      if (filters.exclusivoCentralCompras !== undefined) {
        params.append('exclusivoCentralCompras', filters.exclusivoCentralCompras.toString());
      }
      if (filters.statusServico !== undefined) {
        params.append('statusServico', filters.statusServico.toString());
      }

      const response = await api.get(`/modulo-servico/6_consultarItemServico?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      throw new Error('Falha ao buscar serviços.');
    }
  },

  // Testar conexão com a API
  testConnection: async (): Promise<boolean> => {
    try {
      const response = await api.get('/modulo-material/1_consultarGrupoMaterial?pagina=1');
      console.log('Conexão com API estabelecida:', response.data);
      return true;
    } catch (error) {
      console.error('Erro ao conectar com API:', error);
      return false;
    }
  },

  // Buscar material por código específico
  getMaterialByCode: async (codigo: string): Promise<Material> => {
    try {
      const response = await api.get(`/modulo-material/consultarItemMaterial?codigoMaterial=${codigo}`);
      const data = response.data;
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      console.error('Erro ao buscar material:', error);
      throw new Error('Falha ao buscar material.');
    }
  },

  // Buscar preços de materiais
  getMaterialPrices: async (codigo: string): Promise<any> => {
    try {
      const response = await api.get(`/modulo-material/consultarPrecoMaterial?codigoMaterial=${codigo}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar preços:', error);
      throw new Error('Falha ao buscar preços do material.');
    }
  }
};

export default comprasGovApi; 