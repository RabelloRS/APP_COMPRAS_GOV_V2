# ANOTAÇÕES API COMPRAS.GOV

## Sumário dos Grupos de Endpoints

- Catálogo de Material
- Catálogo de Serviço
- Pesquisa de Preço (Materiais e Serviços)
- PGC (Planejamento de Compras)
- UASG e Órgãos
- Legado (Licitações, Pregões, Compras sem Licitação)
- Contratações (PNCP 14133)
- ARP (Atas de Registro de Preço)
- Contratos

---

## 1. Pesquisa de Preço - Preços Praticados

### Materiais
- `/modulo-pesquisa-preco/1_consultarMaterial`: Consulta preços praticados para um item do catálogo, com filtros por UASG, estado, município, data, classe, etc.
- `/modulo-pesquisa-preco/1.1_consultarMaterial_CSV`: Mesma consulta, mas retorna o resultado em CSV.
- `/modulo-pesquisa-preco/2_consultarMaterialDetalhe`: Detalha uma compra específica de material.
- `/modulo-pesquisa-preco/2.1_consultarMaterialDetalhe_CSV`: Detalhe em CSV.

### Serviços
- `/modulo-pesquisa-preco/3_consultarServico`: Consulta preços praticados para serviços.
- `/modulo-pesquisa-preco/3.1_consultarServico_CSV`: Consulta de serviços em CSV.
- `/modulo-pesquisa-preco/4_consultarServicoDetalhe`: Detalha uma compra específica de serviço.
- `/modulo-pesquisa-preco/4.1_consultarServicoDetalhe_CSV`: Detalhe em CSV.

**Parâmetros comuns:**
- pagina, tamanhoPagina, codigoItemCatalogo, codigoUasg, estado, codigoMunicipio, dataResultado, codigoClasse, idCompra, etc.

**Exemplo de uso:**
1. Buscar item no catálogo (ex: tijolo) → obter código.
2. Consultar preços praticados com filtros regionais, órgão, etc.
3. Detalhar compras específicas.
4. Exportar resultados em CSV.

---

## 2. PGC (Planejamento de Compras)
- `/modulo-pgc/1_consultarPgcDetalhe`, `/1.1_consultarPgcDetalhe_CSV`, `/2_consultarPgcDetalheCatalogo`, `/2.1_consultarPgcDetalheCatalogo_CSV`, `/3_consultarPgcAgregacao`
- Permite consultar detalhes e agregações de planejamento de compras por órgão, ano, tipo, código, etc.

---

## 3. UASG e Órgãos
- `/modulo-uasg/1_consultarUasg`, `/1.1_consultarUasg_CSV`, `/2_consultarOrgao`, `/2.1_consultarOrgao_CSV`
- Consulta de UASGs (unidades administrativas) e órgãos, com filtros por CNPJ, UF, status, etc.
- Útil para filtrar compras por unidade compradora.

---

## 4. Legado (Licitações, Pregões, Compras sem Licitação)
- `/modulo-legado/1_consultarLicitacao`, `/1.1_consultarLicitacao_Id`, `/2_consultarItemLicitacao`, `/2.1_consultarItemLicitacao_Id`, `/3_consultarPregoes`, `/3.1_consultarPregoes_ID`, `/4_consultarItensPregoes`, `/4.1_consultarItensPregoes_ID`, `/5_consultarComprasSemLicitacao`, `/5.1_consultarCompraSemLicitacao_Id`, `/6_consultarCompraItensSemLicitacao`, `/6.1_consultarItensComprasSemLicitacao_Id`, `/7_consultarRdc`
- Permite análise histórica, compliance, auditoria e cruzamento de dados.
- Parâmetros avançados: ano, aviso, modalidade, órgão, UASG, datas, fornecedor, etc.

---

## 5. Contratações (PNCP 14133)
- `/modulo-contratacoes/1_consultarContratacoes_PNCP_14133`, `/2_consultarItensContratacoes_PNCP_14133`, `/3_consultarResultadoItensContratacoes_PNCP_14133`, e variantes _Id e _CSV
- Consulta contratações, itens, resultados e detalhes, com filtros por órgão, unidade, CNPJ, datas, modalidade, fornecedor, valores, etc.
- Permite análise de contratações regidas pela nova lei (Lei 14.133/2021).

---

## 6. ARP (Atas de Registro de Preço)
- `/modulo-arp/1_consultarARP`, `/1.1_consultarARP_Id`, `/2_consultarARPItem`, `/2.1_consultarARPItem_Id`
- Consulta atas, itens de atas, detalhes por ID, com filtros por unidade, modalidade, datas, fornecedor, etc.
- Fundamental para entender compras recorrentes e contratos de fornecimento continuado.

---

## 7. Contratos
- `/modulo-contratos/1_consultarContratos`, `/2_consultarContratosItem`
- Consulta contratos, itens de contratos, com filtros por órgão, unidade, fornecedor, datas, CNPJ, CNAE, etc.
- Permite análise de contratos vigentes, históricos e fornecedores.

---

## 8. Catálogo de Material
- `/modulo-material/1_consultarGrupoMaterial`, `/2_consultarClasseMaterial`, `/3_consultarPdmMaterial`, `/4_consultarItemMaterial`, `/5_consultarMaterialNaturezaDespesa`, `/6_consultarMaterialUnidadeFornecimento`, `/7_consultarMaterialCaracteristicas`
- Permite navegação hierárquica e busca detalhada de materiais.
- Parâmetros: pagina, tamanhoPagina, codigoGrupo, codigoClasse, codigoPdm, descricaoItem, status, bps, codigo_ncm, etc.

---

## 9. Catálogo de Serviço
- `/modulo-servico/1_consultarSecaoServico`, `/2_consultarDivisaoServico`, `/3_consultarGrupoServico`, `/4_consultarClasseServico`, `/5_consultarSubClasseServico`, `/6_consultarItemServico`, `/7_consultarUndMedidaServico`, `/8_consultarNaturezaDespesaServico`
- Permite navegação hierárquica e busca detalhada de serviços.
- Parâmetros: pagina, codigoSecao, codigoDivisao, codigoGrupo, codigoClasse, codigoSubclasse, codigoCpc, codigoServico, status, etc.

---

## Estratégia de Consulta Avançada

1. **Navegue ou busque no catálogo até encontrar o item/material/serviço desejado.**
2. **Pegue o código do item/material/serviço.**
3. **Use esse código para consultar preços praticados, licitações, contratos, atas, etc.**
4. **Aplique filtros regionais, por órgão, fornecedor, datas, modalidade, etc.**
5. **Exporte resultados em CSV para análise externa.**
6. **Detalhe compras específicas, contratos, licitações, etc.**
7. **Cruze dados entre módulos para análises avançadas (compliance, benchmarking, planejamento, etc).**

---

## Observações Técnicas
- Todos os endpoints usam paginação (`pagina`, `tamanhoPagina`).
- Filtros avançados permitem buscas extremamente refinadas.
- Respostas seguem o padrão `{ resultado: [...], totalRegistros, totalPaginas, paginasRestantes }`.
- Endpoints CSV facilitam integração com BI e planilhas.
- O fluxo pode ser adaptado para materiais, serviços, licitações, contratos, atas, etc.

---

## Exemplo de Fluxo Completo (Material)

1. Usuário busca "tijolo"
   → `/modulo-material/4_consultarItemMaterial?descricaoItem=tijolo`
2. Seleciona o item desejado (ex: código 206504)
3. Consulta preços praticados
   → `/modulo-pesquisa-preco/1_consultarMaterial?codigoItemCatalogo=206504&tamanhoPagina=10`
4. Filtra por estado, município, UASG, etc.
   → `/modulo-pesquisa-preco/1_consultarMaterial?codigoItemCatalogo=206504&estado=SP`
5. Exporta resultados em CSV
   → `/modulo-pesquisa-preco/1.1_consultarMaterial_CSV?...`
6. Detalha uma compra específica
   → `/modulo-pesquisa-preco/2_consultarMaterialDetalhe?idCompra=XYZ&codigoItemCatalogo=206504`

---

## Possibilidades de Análise
- Visão 360º: cruzamento de dados de catálogo, preços, licitações, contratos, atas, órgãos, fornecedores e regiões.
- Auditoria e Compliance: identificar irregularidades, sobrepreço, concentração de fornecedores, etc.
- Planejamento e Benchmarking: comparar preços, fornecedores e práticas entre órgãos e regiões.
- Exportação e BI: endpoints CSV para integração com BI e planilhas.
- Detalhamento completo de cada compra, fornecedor, valor, quantidade, etc.

---

*Documentação gerada e organizada automaticamente a partir das informações fornecidas pelo usuário e análise técnica do assistente.*

## 01 - CATÁLOGO - MATERIAL

**Endpoints disponíveis:**

- `GET /modulo-material/1_consultarGrupoMaterial`
- `GET /modulo-material/2_consultarClasseMaterial`
- `GET /modulo-material/3_consultarPdmMaterial`
- `GET /modulo-material/4_consultarItemMaterial`
- `GET /modulo-material/5_consultarMaterialNaturezaDespesa`
- `GET /modulo-material/6_consultarMaterialUnidadeFornecimento`
- `GET /modulo-material/7_consultarMaterialCaracteristicas`

---

**Observações técnicas:**

- Estes endpoints fazem parte do módulo de catálogo de materiais, permitindo consultar diferentes aspectos dos materiais cadastrados no sistema de compras públicas.
- **1_consultarGrupoMaterial**: Retorna os grupos de materiais (categorias principais).
- **2_consultarClasseMaterial**: Retorna as classes de materiais (subcategorias dentro dos grupos).
- **3_consultarPdmMaterial**: Consulta o PDM (Provavelmente "Padrão Descritivo de Material"), que pode ser um detalhamento ou padronização de materiais.
- **4_consultarItemMaterial**: Consulta itens de material específicos, geralmente por código ou outros filtros.
- **5_consultarMaterialNaturezaDespesa**: Relaciona materiais com a natureza da despesa orçamentária.
- **6_consultarMaterialUnidadeFornecimento**: Consulta as unidades de fornecimento dos materiais (ex: unidade, caixa, litro, etc).
- **7_consultarMaterialCaracteristicas**: Consulta características detalhadas dos materiais.

Esses endpoints são fundamentais para montar buscas, filtros e detalhamentos de produtos no contexto de compras públicas.

### Detalhe do endpoint: 1_consultarGrupoMaterial

**Endpoint:**
```
GET /modulo-material/1_consultarGrupoMaterial
```

**Parâmetros de consulta (query):**
- `pagina` (integer, obrigatório): Número da página de resultados. Exemplo: `1`
- `codigoGrupo` (integer, opcional): Código específico do grupo de material para filtrar a busca.
- `statusGrupo` (boolean, opcional): Filtra por status do grupo (ativo/inativo).

**Exemplo de requisição cURL:**
```
curl -X 'GET' \
  'https://dadosabertos.compras.gov.br/modulo-material/1_consultarGrupoMaterial?pagina=1' \
  -H 'accept: */*'
```

**Request URL:**
```
https://dadosabertos.compras.gov.br/modulo-material/1_consultarGrupoMaterial?pagina=1
```

#### Exemplo de resposta do endpoint 1_consultarGrupoMaterial

**Response body:**
```json
{
  "resultado": [
    {
      "codigoGrupo": 10,
      "nomeGrupo": "ARMAMENTO",
      "statusGrupo": true,
      "dataHoraAtualizacao": "2021-10-16T09:16:33.723625"
    },
    {
      "codigoGrupo": 11,
      "nomeGrupo": "MATERIAIS BÉLICOS NUCLEARES",
      "statusGrupo": true,
      "dataHoraAtualizacao": "2021-10-16T09:16:33.723625"
    },
    {
      "codigoGrupo": 12,
      "nomeGrupo": "EQUIPAMENTOS DE TIRO",
      "statusGrupo": true,
      "dataHoraAtualizacao": "2021-10-16T09:16:33.723625"
    },
    {
      "codigoGrupo": 13,
      "nomeGrupo": "MUNIÇÕES E EXPLOSIVOS",
      "statusGrupo": true,
      "dataHoraAtualizacao": "2021-10-16T09:16:33.723625"
    },
    {
      "codigoGrupo": 14,
      ...
    }
  ],
  "totalRegistros": 0,
  "totalPaginas": 0,
  "paginasRestantes": 0
}
```

**Response headers:**
```
cache-control: no-store,no-cache
content-type: application/json
date: Sun, 29 Jun 2025 20:44:58 GMT
expires: Sun, 29 Jun 2025 20:44:58 GMT
pragma: no-cache
request-context: ...
strict-transport-security: max-age=31536000 ; includeSubDomains
x-azure-ref: ...
x-cache: CONFIG_NOCACHE
x-content-type-options: nosniff
x-frame-options: DENY
x-xss-protection: 0
```

#### Exemplo de schema de resposta (estrutura esperada)

```json
{
  "resultado": [
    {
      "codigoGrupo": 0,
      "nomeGrupo": "string",
      "statusGrupo": true,
      "dataHoraAtualizacao": "2025-06-29T20:44:59.384Z"
    }
  ],
  "totalRegistros": 0,
  "totalPaginas": 0,
  "paginasRestantes": 0
}
```

---

**Observações técnicas:**
- O corpo da resposta traz um objeto com a propriedade `resultado`, que é um array de grupos de materiais.
- Cada grupo possui:
  - `codigoGrupo`: identificador numérico único do grupo.
  - `nomeGrupo`: nome descritivo do grupo.
  - `statusGrupo`: booleano indicando se o grupo está ativo.
  - `dataHoraAtualizacao`: data/hora da última atualização do grupo.
- Os headers indicam que a resposta é JSON, não é armazenada em cache e possui várias proteções de segurança padrão para APIs públicas.
- O formato é ideal para ser consumido diretamente por aplicações web, facilitando a exibição e filtragem dos dados.
- Além do array `resultado`, a resposta pode trazer:
  - `totalRegistros`: número total de registros encontrados para a consulta.
  - `totalPaginas`: número total de páginas disponíveis para a consulta.
  - `paginasRestantes`: páginas ainda não navegadas.
- Esses campos são essenciais para implementar paginação eficiente na interface do usuário.
- O campo `nomeGrupo` é do tipo string, e `dataHoraAtualizacao` segue o padrão ISO 8601 para datas.

---

## 02 - CATÁLOGO - CLASSE DE MATERIAL

### Endpoint: /modulo-material/2_consultarClasseMaterial

**Parâmetros:**
- pagina (integer, obrigatório)
- codigoGrupo (integer, opcional)
- codigoClasse (integer, opcional)
- statusClasse (boolean, opcional)
- bps (boolean, opcional)

**Exemplo de requisição:**
```
curl -X 'GET' \
  'https://dadosabertos.compras.gov.br/modulo-material/2_consultarClasseMaterial?pagina=1&bps=false' \
  -H 'accept: */*'
```

**Exemplo de resposta:**
```json
{
  "resultado": [
    {
      "codigoGrupo": 10,
      "nomeGrupo": "ARMAMENTO",
      "codigoClasse": 1005,
      "nomeClasse": "ARMAS DE FOGO DE CALIBRE ATÉ 120MM",
      "statusClasse": true,
      "dataHoraAtualizacao": "2021-10-16T09:17:13.045775"
    }
  ],
  "totalRegistros": 0,
  "totalPaginas": 0,
  "paginasRestantes": 0
}
```

**Observações:**
- Permite consultar classes de materiais, que são subcategorias dentro dos grupos.
- O parâmetro `bps` pode ser usado para filtrar por itens do Banco de Preços em Saúde.
- A resposta segue o mesmo padrão de paginação dos outros endpoints.

---

## 03 - CATÁLOGO - PDM DE MATERIAL

### Endpoint: /modulo-material/3_consultarPdmMaterial

**Parâmetros:**
- pagina (integer, obrigatório)
- statusPdm (boolean, opcional)
- codigoPdm (integer, opcional)
- codigoGrupo (integer, opcional)
- codigoClasse (integer, opcional)
- bps (boolean, opcional)

**Exemplo de requisição:**
```
curl -X 'GET' \
  'https://dadosabertos.compras.gov.br/modulo-material/3_consultarPdmMaterial?pagina=1&bps=false' \
  -H 'accept: */*'
```

**Exemplo de resposta:**
```json
{
  "resultado": [
    {
      "codigoGrupo": 75,
      "nomeGrupo": "UTENSÍLIOS DE ESCRITÓRIO E MATERIAL DE EXPEDIENTE",
      "codigoClasse": 7520,
      "nomeClasse": "ACESSÓRIOS E DISPOSITIVOS PARA ESCRITÓRIO",
      "codigoPdm": 281,
      "nomePdm": "CARTUCHO CANETA TINTEIRO",
      "statusPdm": true,
      "dataHoraAtualizacao": "2021-10-16T09:21:41.961529"
    }
  ],
  "totalRegistros": 0,
  "totalPaginas": 0,
  "paginasRestantes": 0
}
```

**Observações:**
- Permite consultar o PDM (Padrão Descritivo de Material), detalhando ainda mais os materiais.
- Útil para encontrar descrições padronizadas e detalhadas de itens.

---

## 04 - CATÁLOGO - ITEM DE MATERIAL

### Endpoint: /modulo-material/4_consultarItemMaterial

**Parâmetros:**
- pagina (integer, obrigatório)
- tamanhoPagina (integer, opcional)
- codigoItem (integer, opcional)
- codigoGrupo (integer, opcional)
- codigoClasse (integer, opcional)
- codigoPdm (integer, opcional)
- descricaoItem (string, opcional)
- statusItem (boolean, opcional)
- bps (boolean, opcional)
- codigo_ncm (string, opcional)

**Exemplo de requisição:**
```
curl -X 'GET' \
  'https://dadosabertos.compras.gov.br/modulo-material/4_consultarItemMaterial?pagina=1&tamanhoPagina=10&bps=false' \
  -H 'accept: */*'
```

**Exemplo de resposta:**
```json
{
  "resultado": [
    {
      "codigoGrupo": 71,
      "nomeGrupo": "MOBILIÁRIOS",
      "codigoClasse": 7110,
      "nomeClasse": "MOBILIÁRIO PARA ESCRITÓRIO",
      "codigoPdm": 308,
      "nomePdm": "CADEIRA ESCRITÓRIO",
      "statusPdm": false,
      "descricaoItem": "CADEIRA ESCRITÓRIO, MATERIAL REVESTIMENTO ASSENTO E ENCOSTO: COURO ...",
      "codigoItem": 243756,
      "statusItem": true,
      "codigo_ncm": null,
      "siglaMarcaPreferencial": null,
      "dataHoraAtualizacao": "2021-10-16T09:43:08.093211"
    }
  ],
  "totalRegistros": 0,
  "totalPaginas": 0,
  "paginasRestantes": 0
}
```

**Observações:**
- Endpoint mais detalhado para consulta de itens específicos do catálogo.
- Permite busca por descrição, código, grupo, classe, PDM, NCM, status, etc.
- Ideal para buscas avançadas e detalhamento de produtos.

---

## 05 - CATÁLOGO - MATERIAL NATUREZA DESPESA

### Endpoint: /modulo-material/5_consultarMaterialNaturezaDespesa

**Parâmetros:**
- pagina (integer, obrigatório)
- codigoPdm (integer, opcional)
- codigoNaturezaDespesa (string, opcional)
- statusNaturezaDespesa (boolean, opcional)

**Exemplo de requisição:**
```
curl -X 'GET' \
  'https://dadosabertos.compras.gov.br/modulo-material/5_consultarMaterialNaturezaDespesa?pagina=1' \
  -H 'accept: */*'
```

**Exemplo de resposta:**
```json
{
  "resultado": [
    {
      "codigoPdm": 6,
      "codigoNaturezaDespesa": "33903016",
      "nomeNaturezaDespesa": "MATERIAL DE CONSUMO - MATERIAL DE EXPEDIENTE",
      "statusNaturezaDespesa": true
    }
  ],
  "totalRegistros": 0,
  "totalPaginas": 0,
  "paginasRestantes": 0
}
```

**Observações:**
- Relaciona materiais (PDM) com a natureza da despesa orçamentária.
- Útil para análises financeiras e orçamentárias.

---

## 06 - CATÁLOGO - MATERIAL UNIDADE DE FORNECIMENTO

### Endpoint: /modulo-material/6_consultarMaterialUnidadeFornecimento

**Parâmetros:**
- pagina (integer, obrigatório)
- codigoPdm (integer, opcional)
- statusUnidadeFornecimentoPdm (boolean, opcional)

**Exemplo de requisição:**
```
curl -X 'GET' \
  'https://dadosabertos.compras.gov.br/modulo-material/6_consultarMaterialUnidadeFornecimento?pagina=1' \
  -H 'accept: */*'
```

**Exemplo de resposta:**
```json
{
  "resultado": [
    {
      "codigoPdm": 1,
      "siglaUnidadeFornecimento": "UN",
      "nomeUnidadeFornecimento": "UNIDADE",
      "descricaoUnidadeFornecimento": "UMA QUANTIDADE NORMALIZADA ...",
      "siglaUnidadeMedida": null,
      "capacidadeUnidadeFornecimento": 0,
      "numeroSequencialUnidadeFornecimento": 1,
      "statusUnidadeFornecimentoPdm": true,
      "dataHoraAtualizacao": "2021-10-16T09:30:54.651407"
    }
  ],
  "totalRegistros": 0,
  "totalPaginas": 0,
  "paginasRestantes": 0
}
```

**Observações:**
- Consulta as unidades de fornecimento dos materiais (ex: unidade, caixa, litro, etc).
- Importante para padronização de pedidos e compras.

---

## 07 - CATÁLOGO - MATERIAL CARACTERÍSTICAS

### Endpoint: /modulo-material/7_consultarMaterialCaracteristicas

**Parâmetros:**
- pagina (integer, obrigatório)
- codigoItem (integer, opcional)

**Exemplo de requisição:**
```
curl -X 'GET' \
  'https://dadosabertos.compras.gov.br/modulo-material/7_consultarMaterialCaracteristicas?pagina=1' \
  -H 'accept: */*'
```

**Exemplo de resposta:**
```json
{
  "resultado": [
    {
      "codigoItem": 19,
      "itemSustentavel": false,
      "statusItem": true,
      "codigoCaracteristica": "AAYZ",
      "nomeCaracteristica": "NONE",
      "statusCaracteristica": true,
      "codigoValorCaracteristica": null,
      "nomeValorCaracteristica": "JAPONA MASCULINA",
      "statusValorCaracteristica": null,
      "numeroCaracteristica": 1,
      "siglaUnidadeMedida": null,
      "dataHoraAtualizacao": "2024-05-14T03:00:00.143484"
    }
  ],
  "totalRegistros": 0,
  "totalPaginas": 0,
  "paginasRestantes": 0
}
```

**Observações:**
- Consulta características detalhadas dos materiais, como atributos técnicos, sustentabilidade, etc.
- Útil para detalhamento técnico e comparações entre itens.

---

# Progresso e Planejamento - APP Compras.gov

## Etapas concluídas
- Download e armazenamento de grupos, classes e itens de materiais no banco SQLite
- Download e armazenamento de toda a hierarquia de serviços (seção, divisão, grupo, classe, subclasse, itens)
- Scripts automatizados para baixar e atualizar dados de materiais e serviços
- Página React para visualização dos itens baixados
- Integração com API local para consulta dos dados
- Banco de dados agora armazena todos os campos relevantes dos itens
- Documentação atualizada no README.md

## Em desenvolvimento
- Implementação de controle automático de pausa entre requisições para evitar bloqueio (rate limit/erro 429)
- Melhorias no feedback de progresso e logs dos scripts

## Próximos passos
- Exportação dos dados para CSV/Excel
- Filtros avançados e busca por descrição parcial no frontend
- Documentação detalhada de endpoints e exemplos de uso

--- 