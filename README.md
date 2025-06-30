# APP Compras.gov - Propor Engenharia Ltda

![Logo Propor](static/logo/LOGO_PROPOR_PEQUENO.jpg)

## Informações Essenciais do Projeto
- **Empresa:** Propor Engenharia Ltda
- **CNPJ:** 41.556.670/0001-76
- **Marca:** Propor (registrada)
- **Responsável técnico:** Eng. Rodrigo Emanuel Rabello - CREA-RS 167.175-D

# Compras.gov - Consulta de Materiais

Aplicativo web para consulta de materiais e seus preços usando a API do Compras.gov (Sistema Integrado de Administração e Serviços Gerais - SIASG).

## 🎯 Objetivo

Este aplicativo permite consultar o Catálogo de Materiais (CATMAT) do governo federal, fornecendo informações detalhadas sobre materiais licitados e adquiridos pela Administração Pública Federal, incluindo preços, especificações e status.

## ✨ Funcionalidades

- 🔍 **Busca por descrição**: Pesquisa de materiais por descrição
- 🔢 **Busca por código**: Pesquisa direta por código do material
- 🏷️ **Filtros avançados**: Filtros por grupo, status e outros critérios
- 📊 **Paginação**: Navegação por páginas de resultados
- 💰 **Informações de preço**: Exibição de preços unitários, máximos e mínimos
- 📱 **Interface responsiva**: Design adaptável para diferentes dispositivos
- 🎨 **Interface moderna**: UI/UX moderna com Tailwind CSS
- ⚡ **Performance otimizada**: Carregamento rápido e eficiente

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP para requisições à API
- **Lucide React** - Ícones modernos
- **Vite** - Build tool e dev server

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn

## 🚀 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd app-compras-gov
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

4. **Acesse o aplicativo**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📖 Como Usar

### Busca Básica
1. Digite a descrição do material no campo de busca principal
2. Clique em "Buscar" ou pressione Enter
3. Visualize os resultados na lista

### Busca Avançada
1. Clique em "Filtros Avançados"
2. Preencha os campos desejados:
   - **Código do Material**: Busca por código específico
   - **Grupo**: Filtra por grupo de materiais
   - **Status**: Filtra por status (Ativo, Inativo, Suspenso)
3. Clique em "Buscar"

### Visualizar Detalhes
1. Clique em qualquer card de material
2. Um modal será aberto com informações detalhadas
3. Feche o modal clicando em "Fechar" ou fora da área

## 🔗 APIs Utilizadas

O aplicativo utiliza as seguintes APIs do Compras.gov:

- **Base URL**: `https://dadosabertos.compras.gov.br/api/v1`
- **Endpoint de Materiais**: `/catalogo/materiais`
- **Endpoint de Grupos**: `/catalogo/grupos-materiais`

### Endpoints Principais

```typescript
// Buscar materiais
GET /catalogo/materiais?descricao={termo}&page={pagina}&size={tamanho}

// Buscar material por código
GET /catalogo/materiais/{codigo}

// Buscar grupos de materiais
GET /catalogo/grupos-materiais
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── SearchForm.tsx   # Formulário de busca
│   ├── MaterialList.tsx # Lista de materiais
│   ├── MaterialCard.tsx # Card individual do material
│   └── MaterialDetails.tsx # Modal de detalhes
├── services/            # Serviços e APIs
│   └── api.ts          # Cliente da API do Compras.gov
├── types/              # Definições de tipos TypeScript
│   └── index.ts        # Interfaces e tipos
├── App.tsx             # Componente principal
├── index.tsx           # Ponto de entrada
└── index.css           # Estilos globais
```

## 🎨 Design System

O aplicativo utiliza um design system consistente com:

- **Cores Primárias**: Azul (#3B82F6) para ações principais
- **Cores Secundárias**: Tons de cinza para texto e elementos neutros
- **Tipografia**: Inter font family
- **Espaçamento**: Sistema de espaçamento consistente
- **Componentes**: Cards, botões e inputs padronizados

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start          # Inicia o servidor de desenvolvimento

# Build
npm run build      # Cria build de produção

# Testes
npm test           # Executa testes

# Eject (não recomendado)
npm run eject      # Ejecta do Create React App
```

## 🌐 Deploy

Para fazer deploy do aplicativo:

1. **Build de produção**
   ```bash
   npm run build
   ```

2. **Servir arquivos estáticos**
   Os arquivos gerados na pasta `build/` podem ser servidos por qualquer servidor web estático.

## 📚 Documentação da API

Para mais informações sobre a API do Compras.gov:
- [Documentação Swagger](https://dadosabertos.compras.gov.br/swagger-ui/index.html)
- [Catálogo Oficial](https://catalogo.compras.gov.br/cnbs-web/busca)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as dependências estão instaladas
2. Certifique-se de que está usando Node.js 16+
3. Verifique se a API do Compras.gov está acessível
4. Abra uma issue no repositório

## 🔄 Atualizações

Para manter o projeto atualizado:

```bash
# Atualizar dependências
npm update

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades automaticamente
npm audit fix
```

## Scripts de Download

### Materiais
- **Baixar grupos:**
  ```
  node scripts/downloadGrupos.js
  ```
- **Baixar classes:**
  ```
  node scripts/downloadClasses.js
  ```
- **Baixar itens de um grupo (e opcionalmente classe):**
  ```
  node scripts/downloadItens.js <codigoGrupo> [codigoClasse]
  ```
  Exemplo: `node scripts/downloadItens.js 41`

### Serviços
- **Baixar toda a hierarquia de serviços (seção, divisão, grupo, classe, subclasse, itens):**
  ```
  node scripts/downloadServicos.js
  ```

## Dependências
- Node.js
- npm install axios sqlite3 express cors

## Boas práticas
- Aguarde alguns minutos entre execuções para evitar bloqueio da API (erro 429).
- Em caso de bloqueio, aguarde o tempo indicado e rode novamente.
- Scripts futuros terão controle automático de pausa entre requisições.

## Progresso
- [x] Download e banco de grupos, classes e itens de materiais
- [x] Download e banco de toda a hierarquia de serviços
- [x] Página React para visualização dos itens
- [ ] Controle automático de pausa para evitar bloqueio
- [ ] Exportação e filtros avançados

---

**Desenvolvido com ❤️ para facilitar o acesso aos dados de compras governamentais** 