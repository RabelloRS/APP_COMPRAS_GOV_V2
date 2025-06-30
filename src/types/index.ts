export interface Material {
  codigoMaterial?: string;
  codigo?: string;
  descricao?: string;
  unidadeFornecimento?: string;
  precoUnitario?: number;
  precoMaximo?: number;
  precoMinimo?: number;
  dataAtualizacao?: string;
  statusMaterial?: boolean;
  status?: string;
  codigoGrupo?: string;
  grupo?: string;
  codigoSubgrupo?: string;
  subgrupo?: string;
  codigoClasse?: string;
  classe?: string;
  codigoPadrao?: string;
  padrao?: string;
  codigoItem?: string;
  item?: string;
  exclusivoCentralCompras?: boolean;
}

export interface Servico {
  codigoServico?: string;
  descricao?: string;
  codigoSecao?: number;
  codigoDivisao?: number;
  codigoGrupo?: number;
  codigoClasse?: number;
  codigoSubclasse?: number;
  codigoCpc?: number;
  exclusivoCentralCompras?: boolean;
  statusServico?: boolean;
}

export interface MaterialSearchResponse {
  content: Material[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ServicoSearchResponse {
  content: Servico[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface SearchFilters {
  descricao?: string;
  codigo?: string;
  codigoMaterial?: string;
  grupo?: string;
  codigoGrupo?: string;
  status?: string;
  statusMaterial?: boolean;
  page?: number;
  pagina?: number;
  size?: number;
  tamanhoPagina?: number;
}

export interface ServicoSearchFilters {
  pagina?: number;
  tamanhoPagina?: number;
  codigoSecao?: number;
  codigoDivisao?: number;
  codigoGrupo?: number;
  codigoClasse?: number;
  codigoSubclasse?: number;
  codigoCpc?: number;
  codigoServico?: number;
  exclusivoCentralCompras?: boolean;
  statusServico?: boolean;
}

export interface GrupoMaterial {
  codigo: string;
  descricao: string;
  status: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface Pdm {
  codigo: string;
  descricao: string;
  codigo_classe: number;
}

export interface PdmsSearchResponse {
  content: Pdm[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
} 