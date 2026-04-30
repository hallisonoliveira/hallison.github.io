# Tech Spec — Google Analytics 4 (GA4)

## Resumo Executivo

A integração do GA4 é implementada inteiramente client-side, sem backend. Três camadas compõem a solução: (1) um partial Hugo `cookie-consent.html` com JS inline responsável por exibir o banner LGPD e persistir a preferência em `localStorage`; (2) um partial `ga4-script.html` que carrega `gtag.js` condicionalmente, apenas após consentimento; (3) um script estático `static/js/analytics.js` que dispara os eventos customizados (`outbound_link`, `social_click`, `read_depth`). O Measurement ID é configurado exclusivamente via `config.toml`, nunca hardcoded em templates.

## Arquitetura do Sistema

### Visão Geral dos Componentes

```
Novos arquivos:
- layouts/partials/cookie-consent.html   — banner LGPD + JS inline de consentimento
- layouts/partials/ga4-script.html       — carregamento condicional do gtag.js
- static/js/analytics.js                — eventos customizados (outbound, social, scroll)

Modificados:
- config.toml                           — parâmetro params.ga4MeasurementId
- layouts/_default/baseof.html          — inclusão dos dois novos partials no <head>
- layouts/partials/footer.html          — link "Gerenciar cookies" i18n
- i18n/pt.yaml                          — chaves: cookie_message, cookie_accept, cookie_decline, cookie_manage
- i18n/en.yaml                          — mesmas chaves em inglês
```

Fluxo de dados:
```
Visita → cookie-consent.html verifica localStorage("cookie-consent")
  ├─ null       → exibe banner → usuário aceita/recusa → persiste valor
  ├─ "accepted" → ga4-script.html injeta gtag.js → analytics.js registra eventos
  └─ "declined" → nenhum script GA4 é carregado
```

## Design de Implementação

### Estrutura de Templates

**`layouts/partials/ga4-script.html`** — carrega gtag.js condicionalmente via JS:

```hugo
{{- /* layouts/partials/ga4-script.html */ -}}
{{ with .Site.Params.ga4MeasurementId }}
<script>
  (function() {
    if (localStorage.getItem('cookie-consent') !== 'accepted') return;
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id={{ . }}';
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '{{ . }}', {
      language: document.documentElement.lang
    });
  })();
</script>
{{ end }}
```

**`layouts/partials/cookie-consent.html`** — banner + lógica de consentimento:

```hugo
{{- /* layouts/partials/cookie-consent.html */ -}}
<div id="cookie-banner" class="fixed bottom-0 left-0 right-0 z-50 hidden bg-secondary-fixed border-t border-outline-variant px-6 py-4">
  <div class="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="font-body text-sm text-on-surface">{{ i18n "cookie_message" }}</p>
    <div class="flex gap-3 shrink-0">
      <button id="cookie-decline" class="font-label text-sm uppercase tracking-widest text-primary opacity-70 hover:opacity-100 transition-opacity">
        {{ i18n "cookie_decline" }}
      </button>
      <button id="cookie-accept" class="font-label text-sm uppercase tracking-widest bg-primary text-on-primary px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
        {{ i18n "cookie_accept" }}
      </button>
    </div>
  </div>
</div>
<script>
  (function() {
    var banner = document.getElementById('cookie-banner');
    var consent = localStorage.getItem('cookie-consent');
    if (!consent) banner.classList.remove('hidden');

    document.getElementById('cookie-accept').addEventListener('click', function() {
      localStorage.setItem('cookie-consent', 'accepted');
      banner.classList.add('hidden');
      location.reload();
    });

    document.getElementById('cookie-decline').addEventListener('click', function() {
      localStorage.setItem('cookie-consent', 'declined');
      banner.classList.add('hidden');
    });
  })();
</script>
```

**`layouts/_default/baseof.html`** — inclusão dos partials no `<head>` e antes de `</body>`:

```hugo
{{- /* No <head>, após os scripts existentes */ -}}
{{ partial "ga4-script.html" . }}

{{- /* Antes de </body> */ -}}
{{ partial "cookie-consent.html" . }}
```

**`layouts/partials/footer.html`** — link de gerenciamento de cookies:

```hugo
{{- /* Após o bloco de copyright existente */ -}}
<button id="cookie-manage" onclick="localStorage.removeItem('cookie-consent'); location.reload();"
  class="font-body text-sm italic text-primary dark:text-primary-fixed opacity-60 hover:opacity-100 transition-opacity">
  {{ i18n "cookie_manage" }}
</button>
```

### Modelos de Dados (Frontmatter)

Nenhum frontmatter novo. O rastreamento de idioma é derivado de `document.documentElement.lang` (já definido em `baseof.html` via `{{ .Site.Language.Lang }}`).

### Configuração de Dados (config.toml)

```toml
[params]
  ga4MeasurementId = "G-XXXXXXXXXX"   # substituir pelo ID real após criação da propriedade
```

### `static/js/analytics.js` — eventos customizados

```javascript
document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('cookie-consent') !== 'accepted') return;
  if (typeof window.gtag !== 'function') return;

  // outbound_link
  document.querySelectorAll('a[href^="http"]').forEach(function(link) {
    if (!link.href.includes(location.hostname)) {
      link.addEventListener('click', function() {
        gtag('event', 'outbound_link', { url: link.href });
      });
    }
  });

  // social_click — links do rodapé com rel="noopener"
  document.querySelectorAll('footer a[target="_blank"]').forEach(function(link) {
    link.addEventListener('click', function() {
      gtag('event', 'social_click', { network: link.dataset.network || link.hostname });
    });
  });

  // read_depth — scroll milestones em páginas de artigo
  var milestones = [25, 50, 75, 100];
  var reached = {};
  window.addEventListener('scroll', function() {
    var scrolled = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
    milestones.forEach(function(m) {
      if (!reached[m] && scrolled >= m) {
        reached[m] = true;
        gtag('event', 'read_depth', { depth: m, page: location.pathname });
      }
    });
  });
});
```

## Pontos de Integração

- **Google Analytics 4**: `gtag.js` carregado de `googletagmanager.com` apenas após consentimento. Modo de falha: se o script falhar ao carregar (rede bloqueada, ad-blocker), `window.gtag` não existe — `analytics.js` verifica `typeof window.gtag !== 'function'` antes de registrar eventos.
- **`localStorage`**: chave `cookie-consent` com valores `"accepted"` | `"declined"`. Ausência da chave = primeira visita.
- **Idioma**: `document.documentElement.lang` (já presente no HTML gerado pelo Hugo) é passado no `gtag('config')` para segmentação por idioma no painel GA4.

## Abordagem de Testes

### Validação de Conteúdo

```javascript
describe('i18n keys for analytics', () => {
  it('should have cookie consent keys in PT and EN', () => {
    const ptKeys = parseYAML('i18n/pt.yaml');
    const enKeys = parseYAML('i18n/en.yaml');
    ['cookie_message', 'cookie_accept', 'cookie_decline', 'cookie_manage'].forEach(key => {
      expect(ptKeys[key]).toBeDefined();
      expect(enKeys[key]).toBeDefined();
    });
  });
});
```

### Testes de Build

```bash
hugo && echo "Build OK" || exit 1
test -f public/index.html
grep -r "cookie-banner" public/index.html > /dev/null && echo "Banner present" || exit 1
grep -r "gtag" public/index.html > /dev/null && echo "GA4 script present" || exit 1
```

### Testes E2E com Playwright

```javascript
describe('Cookie consent banner', () => {
  it('should display banner on first visit', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#cookie-banner')).toBeVisible();
  });

  it('should hide banner after accepting', async ({ page }) => {
    await page.goto('/');
    await page.locator('#cookie-accept').click();
    await expect(page.locator('#cookie-banner')).toBeHidden();
  });

  it('should not reload banner after consent is set', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('cookie-consent', 'accepted'));
    await page.goto('/');
    await expect(page.locator('#cookie-banner')).toBeHidden();
  });

  it('should not load gtag script when declined', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('cookie-consent', 'declined'));
    await page.goto('/');
    const gaScript = page.locator('script[src*="googletagmanager.com"]');
    await expect(gaScript).toHaveCount(0);
  });
});

describe('Cookie consent — EN', () => {
  it('should display banner in English', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#cookie-banner p')).not.toBeEmpty();
  });
});

describe('Manage cookies link', () => {
  it('should appear in footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#cookie-manage')).toBeVisible();
  });
});
```

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. Adicionar chaves i18n em `i18n/pt.yaml` e `i18n/en.yaml`
2. Adicionar `ga4MeasurementId` placeholder no `config.toml`
3. Criar `layouts/partials/ga4-script.html`
4. Criar `layouts/partials/cookie-consent.html`
5. Atualizar `layouts/_default/baseof.html` (incluir os dois partials)
6. Adicionar link "Gerenciar cookies" em `layouts/partials/footer.html`
7. Criar `static/js/analytics.js`
8. Adicionar `<script src="/js/analytics.js" defer></script>` no `baseof.html`
9. Executar `hugo` — validar build limpo
10. Executar testes E2E com Playwright
11. Criar guia de onboarding `dev-docs/tasks/prd-analytics/onboarding-ga4.md`

### Dependências Técnicas

```
- i18n keys devem existir antes de criar os partials (templates as referenciam)
- config.toml com ga4MeasurementId antes de testar ga4-script.html
- baseof.html atualizado antes dos testes E2E (partials precisam estar incluídos)
- analytics.js depende de window.gtag (definido por ga4-script.html)
```

## Monitoramento e Observabilidade

```bash
# Build-time: confirmar ausência de erros
hugo 2>&1 | grep -E "ERROR|WARN" || echo "Build clean"
```

```javascript
// analytics.js — log de inicialização (apenas em dev)
const isDevelopment = location.hostname === 'localhost';
if (isDevelopment) {
  console.log('Analytics initialized', {
    consent: localStorage.getItem('cookie-consent'),
    language: document.documentElement.lang,
    timestamp: new Date().toISOString()
  });
}
```

Após deploy, verificar no painel GA4:
- `DebugView` em tempo real para confirmar pageviews chegando
- Relatório de eventos para `outbound_link`, `social_click`, `read_depth`
- Dimensão `language` nos relatórios (derivada de `document.documentElement.lang`)

## Considerações Técnicas

### Decisões Principais

```
Decisão: gtag.js carregado via createElement (não <script> estático no <head>)
Justificativa: Garante zero carregamento antes do consentimento. <script> estático
sempre é carregado pelo browser independente de lógica JS posterior.

Decisão: location.reload() ao aceitar consentimento
Justificativa: Inicializa gtag.js para a sessão atual sem exigir lógica de
re-injeção complexa. Trade-off: reload visível; aceitável dado que ocorre
somente na primeira visita.

Decisão: JS inline no cookie-consent.html (não arquivo separado)
Justificativa: O partial é autocontido — evita dependência de carregamento
de arquivo externo para exibir o banner. O banner deve funcionar mesmo se
analytics.js falhar.

Decisão: Sem GTM
Justificativa: Explicitamente fora de escopo no PRD. Integração direta é
mais simples para um site estático sem necessidade de gestão de tags.

Decisão: Segmentação por idioma via document.documentElement.lang (não parâmetro GA4 customizado)
Justificativa: Hugo já define lang no <html>; reutilizar evita nova dimensão
customizada no GA4. Visível em "User language" nos relatórios padrão.
```

### Riscos Conhecidos

```
Risco: analytics.js executa antes de window.gtag estar disponível
Mitigação: verificação `typeof window.gtag !== 'function'` no início do script.
O script ga4-script.html é incluído antes de analytics.js no baseof.html.

Risco: location.reload() após aceitar pode impactar o LCP percebido
Mitigação: reload ocorre apenas uma vez (primeira aceitação); não afeta
visitas subsequentes onde gtag.js é carregado diretamente no <head>.

Risco: Ad-blockers podem bloquear googletagmanager.com
Mitigação: falha silenciosa — analytics.js verifica window.gtag antes
de qualquer chamada. Nenhum erro exposto ao usuário.
```

### Conformidade com Padrões

**Rules Aplicáveis:**
- [code-standards.md](../../.claude/rules/code-standards.md) — vanilla JS; camelCase para variáveis JS; kebab-case para parâmetros TOML (`ga4MeasurementId` como camelCase segue convenção existente do config.toml); templates com linhas em branco entre blocos lógicos
- [logging.md](../../.claude/rules/logging.md) — logs client-side apenas em `localhost`; objetos estruturados; sem dados sensíveis no console
- [tests.md](../../.claude/rules/tests.md) — testes E2E Playwright; um comportamento por teste; validação de chaves i18n

### Arquivos Relevantes e Dependentes

**Novos:**
```
layouts/partials/cookie-consent.html
layouts/partials/ga4-script.html
static/js/analytics.js
dev-docs/tasks/prd-analytics/onboarding-ga4.md
```

**Modificados:**
```
config.toml                        — ga4MeasurementId
layouts/_default/baseof.html       — inclusão dos dois partials + analytics.js
layouts/partials/footer.html       — botão "Gerenciar cookies"
i18n/pt.yaml                       — 4 chaves de consentimento
i18n/en.yaml                       — 4 chaves de consentimento
```

**Dependentes (sem modificação):**
```
Todos os layouts que estendem baseof.html herdam automaticamente o banner e o GA4
```
