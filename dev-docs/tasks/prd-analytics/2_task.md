# Tarefa 2.0: Eventos Customizados (analytics.js)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar o arquivo `static/js/analytics.js` com os três eventos customizados de engajamento (`outbound_link`, `social_click`, `read_depth`) e incluí-lo no layout base com `defer`.

<requirements>
- O script só executa se `localStorage("cookie-consent") === "accepted"` E `typeof window.gtag === "function"`
- Evento `outbound_link`: disparado ao clicar em links externos (href começa com "http" e não contém `location.hostname`)
- Evento `social_click`: disparado ao clicar em links `footer a[target="_blank"]`; parâmetro `network` usa `link.dataset.network` ou `link.hostname`
- Evento `read_depth`: disparado nos milestones 25%, 50%, 75%, 100% de scroll; parâmetro `depth` e `page`
- Em `localhost`, deve exibir `console.log` com estado do analytics (consent, language, timestamp)
- Script incluído em `baseof.html` com `<script src="/js/analytics.js" defer></script>` APÓS o partial `ga4-script.html`
</requirements>

## Subtarefas

- [ ] 2.1 Criar `static/js/analytics.js` com os três eventos e log de desenvolvimento
- [ ] 2.2 Adicionar `<script src="/js/analytics.js" defer></script>` em `layouts/_default/baseof.html`
- [ ] 2.3 Executar `hugo` e validar build limpo
- [ ] 2.4 Verificar no DevTools (localhost) que o log de inicialização aparece ao aceitar consentimento

## Detalhes de Implementação

Consultar `techspec.md` — seções:
- **"`static/js/analytics.js` — eventos customizados"**: código completo do script
- **"Monitoramento e Observabilidade"**: bloco de log de desenvolvimento (`isDevelopment`)
- **"Riscos Conhecidos"**: verificação de `typeof window.gtag` antes de qualquer chamada
- **"Sequenciamento de Desenvolvimento"**: passo 8 (inclusão do script no baseof)

## Critérios de Sucesso

- `hugo` executa sem erros
- `public/js/analytics.js` existe no output gerado
- Ao aceitar consentimento em `localhost`, o console exibe o log de inicialização
- Nenhum erro de JavaScript no console em visitas com e sem consentimento
- Eventos não são disparados quando `cookie-consent` é `"declined"` ou ausente
- Eventos não são disparados quando `window.gtag` não está disponível (ex: ad-blocker)

## Testes da Tarefa

- [ ] **Build:** `hugo && test -f public/js/analytics.js`
- [ ] **Build — script referenciado no HTML:** `grep -q "analytics.js" public/index.html`
- [ ] **E2E — sem erros JS ao recusar**: navegar com consent `"declined"` → zero erros no console
- [ ] **E2E — sem erros JS sem consent**: navegar sem localStorage → zero erros no console
- [ ] **E2E — outbound_link disparado**: aceitar consent, clicar link externo → evento capturado (mock de `gtag`)
- [ ] **E2E — read_depth ao scroll 25%**: aceitar consent, scrollar 25% → evento `read_depth` com `depth: 25`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `static/js/analytics.js` ← novo
- `layouts/_default/baseof.html`
