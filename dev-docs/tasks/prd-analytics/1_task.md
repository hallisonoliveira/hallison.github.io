# Tarefa 1.0: Configuração Base (i18n, config, partials, baseof, footer)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar toda a infraestrutura base para o GA4: chaves de tradução, parâmetro de configuração, os dois partials principais (`ga4-script.html` e `cookie-consent.html`), link de gerenciamento de cookies no rodapé e inclusão de tudo no layout base.

<requirements>
- Chaves i18n `cookie_message`, `cookie_accept`, `cookie_decline`, `cookie_manage` adicionadas em `i18n/pt.yaml` e `i18n/en.yaml`
- Parâmetro `ga4MeasurementId` adicionado em `config.toml` com valor placeholder `"G-XXXXXXXXXX"`
- Partial `layouts/partials/ga4-script.html` criado conforme techspec
- Partial `layouts/partials/cookie-consent.html` criado conforme techspec
- Ambos os partials incluídos em `layouts/_default/baseof.html`
- Botão "Gerenciar cookies" adicionado em `layouts/partials/footer.html`
- O script GA4 NÃO deve ser carregado antes do consentimento (`localStorage` key `cookie-consent` = `"accepted"`)
- O banner deve ficar oculto após o usuário aceitar ou recusar
- Após aceitar, a página faz reload para inicializar o gtag na sessão atual
</requirements>

## Subtarefas

- [ ] 1.1 Adicionar chaves i18n em `i18n/pt.yaml` e `i18n/en.yaml`
- [ ] 1.2 Adicionar `ga4MeasurementId = "G-XXXXXXXXXX"` em `config.toml`
- [ ] 1.3 Criar `layouts/partials/ga4-script.html`
- [ ] 1.4 Criar `layouts/partials/cookie-consent.html`
- [ ] 1.5 Atualizar `layouts/_default/baseof.html` para incluir os dois partials
- [ ] 1.6 Adicionar botão "Gerenciar cookies" em `layouts/partials/footer.html`
- [ ] 1.7 Executar `hugo` e validar build limpo

## Detalhes de Implementação

Consultar `techspec.md` — seções:
- **"Estrutura de Templates"**: código completo de `ga4-script.html` e `cookie-consent.html`
- **"Configuração de Dados (config.toml)"**: parâmetro `ga4MeasurementId`
- **"Design de Implementação"**: como incluir os partials no `baseof.html` e o botão no `footer.html`
- **"Decisões Principais"**: justificativas para `createElement` e `location.reload()`

## Critérios de Sucesso

- `hugo` executa sem erros ou warnings
- `public/index.html` contém o elemento `#cookie-banner`
- `public/index.html` contém referência ao script gtag (dentro do partial `ga4-script.html`)
- Banner visível na primeira visita (sem `localStorage` definido)
- Banner não aparece quando `localStorage("cookie-consent")` é `"accepted"` ou `"declined"`
- Clicar em "Aceitar" persiste `"accepted"` e faz reload
- Clicar em "Recusar" persiste `"declined"` e esconde o banner sem reload
- Botão "Gerenciar cookies" visível no rodapé e ao clicar limpa o `localStorage` e faz reload
- Banner renderiza texto correto em `/` (PT) e em `/en/` (EN)

## Testes da Tarefa

- [ ] **Build:** `hugo && test -f public/index.html`
- [ ] **Build — banner presente:** `grep -q "cookie-banner" public/index.html`
- [ ] **Build — gtag presente:** `grep -q "gtag" public/index.html`
- [ ] **E2E — banner na primeira visita** (sem localStorage): `#cookie-banner` visível
- [ ] **E2E — banner oculto após aceitar**: clicar `#cookie-accept` → banner hidden
- [ ] **E2E — banner oculto com consent já definido**: setar `localStorage` antes de navegar → banner hidden
- [ ] **E2E — gtag NÃO carregado ao recusar**: `script[src*="googletagmanager.com"]` count = 0
- [ ] **E2E — banner em EN**: navegar `/en/` → `#cookie-banner p` não vazio
- [ ] **E2E — gerenciar cookies no rodapé**: `#cookie-manage` visível

Ver exemplos completos dos testes E2E em `techspec.md` → seção "Testes E2E com Playwright".

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `i18n/pt.yaml`
- `i18n/en.yaml`
- `config.toml`
- `layouts/partials/ga4-script.html` ← novo
- `layouts/partials/cookie-consent.html` ← novo
- `layouts/_default/baseof.html`
- `layouts/partials/footer.html`
