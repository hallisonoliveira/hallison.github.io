# Tarefa 3.0: Documentação de Onboarding

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar o guia `onboarding-ga4.md` para que o autor do blog consiga criar a propriedade GA4, obter o Measurement ID, configurar no projeto e verificar se os dados estão chegando corretamente.

<requirements>
- Cobrir passo a passo de criação da propriedade GA4 no Google Analytics
- Explicar onde e como substituir o placeholder `G-XXXXXXXXXX` em `config.toml`
- Descrever como usar o GA4 DebugView para verificar pageviews em tempo real
- Descrever como verificar os eventos customizados (`outbound_link`, `social_click`, `read_depth`) no painel GA4
- Mencionar a dimensão de idioma e como filtrá-la nos relatórios
- Linguagem acessível para o autor (não necessariamente desenvolvedor experiente)
</requirements>

## Subtarefas

- [ ] 3.1 Criar `dev-docs/tasks/prd-analytics/onboarding-ga4.md` com as seções abaixo:
  - Pré-requisitos (conta Google, acesso ao repositório)
  - Passo a passo: criar propriedade GA4 e obter o Measurement ID
  - Passo a passo: configurar o Measurement ID no projeto (`config.toml`)
  - Como verificar se o rastreamento está funcionando (DebugView + Relatório de Eventos)
  - Como filtrar dados por idioma (PT vs EN)
  - Troubleshooting comum (ad-blocker, consentimento não dado, ID errado)

## Detalhes de Implementação

Consultar `techspec.md` — seções:
- **"Monitoramento e Observabilidade"**: instruções de verificação pós-deploy no GA4
- **"Configuração de Dados (config.toml)"**: onde e como configurar o ID
- **"Pontos de Integração"**: comportamento esperado do idioma e do `localStorage`

Consultar `prd.md` — seções:
- **RF-16, RF-17, RF-18**: requisitos funcionais da documentação

## Critérios de Sucesso

- Arquivo `onboarding-ga4.md` criado com todas as seções listadas nas subtarefas
- Um desenvolvedor júnior consegue seguir o guia e configurar o GA4 sem precisar consultar outros documentos
- O guia referencia corretamente os arquivos do projeto (`config.toml`, `ga4-script.html`, etc.)
- Nenhuma informação sensível (IDs reais, tokens) presente no documento

## Testes da Tarefa

- [ ] **Revisão manual**: todas as 6 seções presentes no arquivo
- [ ] **Revisão manual**: o caminho `config.toml` → `ga4MeasurementId` está descrito corretamente
- [ ] **Revisão manual**: instruções de DebugView e Relatório de Eventos estão presentes
- [ ] **Revisão manual**: seção de troubleshooting cobre ad-blocker e consentimento não dado

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `dev-docs/tasks/prd-analytics/onboarding-ga4.md` ← novo
- `dev-docs/tasks/prd-analytics/prd.md` (referência)
- `dev-docs/tasks/prd-analytics/techspec.md` (referência)
- `config.toml` (referência)
