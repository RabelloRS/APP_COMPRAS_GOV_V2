# APP Compras.gov - Propor Engenharia Ltda

![Logo Propor](./public/static/logo/LOGO_PROPOR_PEQUENO.jpg)

## Informações Essenciais do Projeto
- **Empresa:** Propor Engenharia Ltda
- **CNPJ:** 41.556.670/0001-76
- **Marca:** Propor (registrada)
- **Responsável técnico:** Eng. Rodrigo Emanuel Rabello - CREA-RS 167.175-D

# Ferramenta de Análise de Preços do Compras.gov

Aplicativo web para pesquisa de preços, geração de relatórios e análise de itens (materiais e serviços) do Compras.gov (Sistema Integrado de Administração e Serviços Gerais - SIASG).

## 🎯 Objetivo

Oferecer uma ferramenta robusta e ágil para que a equipe da Propor Engenharia possa realizar pesquisas de preços detalhadas, baseadas em dados atualizados do governo federal. O sistema permite encontrar rapidamente itens, gerar relatórios de cotação com múltiplos fornecedores e exportar os dados para uso em planilhas e documentos.

## ✨ Funcionalidades

- ⚡ **Pesquisa Dinâmica e Unificada**: Busca instantânea em um banco de dados local com mais de 2 milhões de itens (materiais e serviços) enquanto o usuário digita.
- 📊 **Relatórios de Preços em Tempo Real**: Consulta direta à API do Compras.gov para obter os preços de compra mais recentes de um item específico, com filtros por período e estado.
- 📈 **Análise Estatística**: Cálculo automático de preço mínimo, médio, máximo e mediano para cada item pesquisado.
- 📄 **Exportação de Dados**: Geração de relatórios completos em formatos **CSV** (para planilhas) e **PDF** (para documentos formais) com um único clique.
- 🗃️ **Base de Dados Local**: Scripts para download e atualização de todo o catálogo de materiais e serviços do governo, garantindo performance e disponibilidade.
- 🎨 **Interface Moderna e Intuitiva**: UI/UX limpa, desenvolvida com Tailwind CSS e alinhada à identidade visual da Propor Engenharia.
- 📱 **Design Responsivo**: Experiência de uso consistente em desktops, tablets e smartphones.

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - **React 18** e **TypeScript**
  - **Tailwind CSS** para estilização
  - **React Router DOM** para navegação
  - **Axios** para requisições HTTP
  - **use-debounce** para otimização da busca
  - **Lucide React** para ícones

- **Backend (Servidor Local)**:
  - **Node.js** e **Express** para a API local
  - **SQLite3** como banco de dados
  - **json2csv** para exportação de relatórios em CSV
  - **jspdf** e **jspdf-autotable** para geração de PDFs

## 🚀 Como Executar o Projeto

1. **Instale as dependências** do frontend e do backend:
   ```bash
   npm install
   ```

2. **Inicie o servidor do backend** (API local e banco de dados):
   ```bash
   node server.js
   ```
   O servidor estará rodando em `http://localhost:3001`.

3. **Inicie o servidor de desenvolvimento do frontend** em outro terminal:
   ```bash
   npm start
   ```
   O aplicativo React estará acessível em `http://localhost:3000`.

## 📖 Como Usar a Ferramenta de Pesquisa

1. **Acesse a página "Pesquisa de Preços"** no menu principal.
2. **Digite o nome do item** (material ou serviço) no campo de busca. Os resultados aparecerão dinamicamente abaixo.
3. **Clique em um item** da lista para selecioná-lo.
4. **Defina os filtros** (opcional):
   - **Período**: Escolha uma data de início e fim para a consulta de preços.
   - **Estado (UF)**: Selecione um estado para filtrar as compras por localidade.
5. **Clique em "Gerar Relatório"**. O sistema buscará os dados em tempo real na API do Compras.gov.
6. **Analise os resultados** nos cartões de resumo e na tabela detalhada.
7. **Exporte o relatório** clicando em "Exportar para CSV" ou "Exportar para PDF".

## 🔗 APIs

### API Externa (Compras.gov)
- **Base URL**: `https://dadosabertos.compras.gov.br/api/v1`
- **Endpoints**: `/catalogo/*`, `/precos/*`

### API Local (Backend em `server.js`)
- **`GET /api/pesquisar-itens?q={termo}`**: Realiza a busca dinâmica no banco de dados local.
- **`GET /api/relatorio-precos?itemCode={codigo}&...filtros`**: Busca os preços na API externa e retorna o relatório.
- **`POST /api/exportar-csv`**: Gera e serve um arquivo CSV a partir dos dados do relatório.
- **`POST /api/exportar-pdf`**: Gera e serve um arquivo PDF a partir dos dados do relatório.

## 📁 Estrutura do Projeto

```
/
├── public/              # Arquivos estáticos (HTML, imagens)
├── scripts/             # Scripts Node.js para download de dados
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── legacy/      # Componentes antigos/de teste
│   │   ├── report/      # Componentes da página de relatório
│   │   └── search/      # Componentes da funcionalidade de busca
│   ├── layouts/         # Estrutura de layout (cabeçalho, rodapé)
│   ├── pages/           # Páginas da aplicação (Dashboard, Pesquisa)
│   ├── services/        # Configuração do Axios (api.ts)
│   ├── types/           # Definições de tipos TypeScript
│   ├── App.tsx          # Roteamento principal
│   └── index.tsx        # Ponto de entrada do React
├── server.js            # Servidor backend (API local)
└── comprasgov.db        # Banco de dados SQLite
```

## 🔧 Scripts de Download de Dados

Os scripts na pasta `scripts/` são usados para popular o banco de dados local.

- **Baixar todos os catálogos de materiais**:
  ```bash
  node scripts/downloadGrupos.js
  node scripts/downloadClasses.js
  node scripts/downloadItens.js
  ```

- **Baixar todo o catálogo de serviços**:
  ```bash
  node scripts/downloadServicos.js
  ```
**Atenção**: Os scripts de download fazem um grande número de requisições à API pública. Use-os com moderação para evitar bloqueios por excesso de requisições (erro 429). Eles já possuem uma lógica de retentativa com espera, mas o processo pode ser demorado.

## ✅ Progresso do Projeto

- [x] Estrutura inicial do projeto (React + TS + Vite)
- [x] Implementação do Tailwind CSS e identidade visual
- [x] Scripts de download e criação de banco de dados para Materiais
- [x] Scripts de download e criação de banco de dados para Serviços
- [x] Backend local (`server.js`) com API para busca e relatórios
- [x] Frontend com pesquisa dinâmica e unificada
- [x] Geração de relatório de preços com estatísticas
- [x] Exportação dos relatórios para CSV e PDF
- [ ] Implementar autenticação de usuários (próxima fase)
- [ ] Criar dashboard com visualização de dados (próxima fase)

---

**Desenvolvido com ❤️ para facilitar o acesso aos dados de compras governamentais** 