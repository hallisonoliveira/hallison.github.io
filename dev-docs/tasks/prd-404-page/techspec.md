# Tech Spec — Página 404 Customizada

## Resumo Executivo

A solução cria um único template Hugo `layouts/404.html` que estende `baseof.html` via `{{ define "main" }}`. O Hugo renderiza este template para cada idioma configurado (PT e EN), passando o contexto de idioma correto, permitindo o uso direto de `{{ i18n "not_found_*" }}` para internacionalização sem duplicação de código. O layout é centralizado verticalmente, com ícone Material Symbols (`search_off`), `h1` semântico, mensagem breve e dois botões `<a>` com URLs geradas por `relLangURL`. Uma modificação cirúrgica em `baseof.html` adiciona suporte ao bloco `{{ block "title" }}` para que a tag `<title>` reflita o idioma ativo.

## Arquitetura do Sistema

### Visão Geral dos Componentes

```
Novos arquivos:
- layouts/404.html          — template principal da página de erro 404

Modificados:
- i18n/pt.yaml              — 4 novas chaves not_found_*
- i18n/en.yaml              — 4 novas chaves not_found_*
- layouts/_default/baseof.html — adicionar suporte a {{ block "title" }}
```

O template `layouts/404.html` não requer partials dedicados: o conteúdo cabe em menos de 30 linhas e não é reutilizado por outros layouts. A relação entre componentes é linear: `baseof.html` renderiza o bloco `main` definido em `404.html`, que consome chaves i18n e usa `relLangURL` para os hrefs dos botões.

## Design de Implementação

### Estrutura de Templates

**Modificação em `baseof.html` (linha 6 — substituir a tag `<title>` existente):**

```hugo
{{- /* Antes */ -}}
<title>{{ .Title }} | {{ .Site.Title }}</title>

{{- /* Depois */ -}}
<title>{{ block "title" . }}{{ .Title }}{{ end }} | {{ .Site.Title }}</title>
```

**Novo arquivo `layouts/404.html`:**

```hugo
{{- /* layouts/404.html */ -}}
{{ define "title" }}{{ i18n "not_found_title" }}{{ end }}

{{ define "main" }}

  <section class="flex flex-col items-center justify-center text-center min-h-[60vh] gap-8 py-16">

    <span class="material-symbols-outlined text-6xl text-outline">search_off</span>

    <div class="flex flex-col gap-3 max-w-md">
      <h1 class="font-headline text-4xl font-bold tracking-tight text-on-surface">
        {{ i18n "not_found_title" }}
      </h1>
      <p class="font-body text-lg text-on-surface-variant">
        {{ i18n "not_found_message" }}
      </p>
    </div>

    <div class="flex flex-wrap gap-4 justify-center">
      <a href="{{ "/" | relLangURL }}"
        class="font-label text-sm uppercase tracking-widest bg-primary text-on-primary px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
        {{ i18n "not_found_home" }}
      </a>
      <a href="{{ "posts/" | relLangURL }}"
        class="font-label text-sm uppercase tracking-widest border border-outline text-on-surface px-6 py-3 rounded-full hover:bg-surface-container transition-colors">
        {{ i18n "not_found_posts" }}
      </a>
    </div>

  </section>

{{ end }}
```

### Modelos de Dados (Frontmatter)

Não aplicável — `layouts/404.html` é um template puro do Hugo. O framework não requer um arquivo `content/404.md` para acionar o template; o posicionamento em `layouts/404.html` é suficiente por convenção nativa.

### Configuração de Dados (config.toml)

Nenhuma alteração necessária. O Hugo ativa `layouts/404.html` automaticamente para respostas 404. Com `defaultContentLanguageInSubdir = false`, o Hugo gera:

```
public/404.html          → renderizado com contexto PT (idioma default)
public/en/404.html       → renderizado com contexto EN
```

O template é renderizado duas vezes com contexto de idioma distinto, portanto `{{ i18n "not_found_title" }}` e `relLangURL` resolvem corretamente em cada output sem qualquer lógica condicional no template.

**Chaves i18n a adicionar em `i18n/pt.yaml`:**

```yaml
# 404
not_found_title:
  other: Página não encontrada

not_found_message:
  other: O endereço que você tentou acessar não existe ou foi movido.

not_found_home:
  other: Voltar à home

not_found_posts:
  other: Ver todos os posts
```

**Chaves i18n a adicionar em `i18n/en.yaml`:**

```yaml
# 404
not_found_title:
  other: Page not found

not_found_message:
  other: The address you tried to access doesn't exist or has been moved.

not_found_home:
  other: Back to home

not_found_posts:
  other: See all posts
```

## Pontos de Integração

Sem integrações externas. O template usa apenas:
- Sistema `i18n` nativo do Hugo — `{{ i18n "key" }}`
- Função `relLangURL` para URLs relativas ao idioma ativo (`/posts/` em PT, `/en/posts/` em EN)
- Material Symbols (`search_off`) já disponível via CDN carregado em `baseof.html`
- GA4 já integrado em `baseof.html` captura page views da 404 automaticamente

## Abordagem de Testes

### Validação de Conteúdo

Não aplicável — sem arquivo Markdown com frontmatter para este template.

### Testes de Build

```bash
# Verificar que o build gera 404 em ambos os idiomas
hugo
test -f public/404.html      && echo "✅ PT 404 gerado"   || echo "❌ PT 404 ausente"
test -f public/en/404.html   && echo "✅ EN 404 gerado"   || echo "❌ EN 404 ausente"

# Verificar ausência de placeholders i18n (enableMissingTranslationPlaceholders = true)
grep -r "\[not_found" public/404.html public/en/404.html \
  && echo "⚠️ Chave i18n ausente" || echo "✅ Traduções completas"

# Verificar que o código numérico não aparece no conteúdo visível
grep -E ">404<" public/404.html \
  && echo "⚠️ Código 404 exposto ao usuário" || echo "✅ Sem código numérico"
```

### Testes E2E com Playwright

```javascript
// tests/e2e/not-found.spec.js
test('should display PT 404 with translated content', async ({ page }) => {
  await page.goto('/url-inexistente/');

  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).not.toContainText('404');
  await expect(page.locator('span.material-symbols-outlined')).toBeVisible();
});

test('should render PT home button with correct href', async ({ page }) => {
  await page.goto('/url-inexistente/');
  await expect(page.locator('a[href="/"]')).toBeVisible();
});

test('should render PT posts button with correct href', async ({ page }) => {
  await page.goto('/url-inexistente/');
  await expect(page.locator('a[href="/posts/"]')).toBeVisible();
});

test('should display EN 404 with translated content', async ({ page }) => {
  await page.goto('/en/url-that-does-not-exist/');

  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).not.toContainText('404');
});

test('should render EN home button with correct href', async ({ page }) => {
  await page.goto('/en/url-that-does-not-exist/');
  await expect(page.locator('a[href="/en/"]')).toBeVisible();
});

test('should render EN posts button with correct href', async ({ page }) => {
  await page.goto('/en/url-that-does-not-exist/');
  await expect(page.locator('a[href="/en/posts/"]')).toBeVisible();
});
```

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. Adicionar as 4 chaves `not_found_*` em `i18n/pt.yaml`
2. Adicionar as 4 chaves `not_found_*` em `i18n/en.yaml`
3. Modificar linha 6 de `layouts/_default/baseof.html` para suportar `{{ block "title" }}`
4. Criar `layouts/404.html` com o template completo
5. Executar `hugo` e verificar geração de `public/404.html` e `public/en/404.html`
6. Testar em `hugo server` acessando URLs inexistentes em ambos os idiomas
7. Executar testes E2E com Playwright

### Dependências Técnicas

```
i18n/pt.yaml e i18n/en.yaml com as chaves not_found_* devem existir
antes do build Hugo — enableMissingTranslationPlaceholders = true
exibiria [not_found_title] no HTML gerado caso as chaves estejam ausentes.

A modificação em baseof.html deve preceder a criação de layouts/404.html
para que o bloco {{ define "title" }} seja reconhecido corretamente.
```

## Monitoramento e Observabilidade

```bash
# Build-time: saída limpa sem avisos
hugo 2>&1 | grep -E "WARN|ERROR" || echo "✅ Build sem avisos"
```

Não há JavaScript client-side novo para esta feature. O rastreamento de page views em páginas 404 é coberto pelo GA4 já integrado em `baseof.html`, que captura automaticamente qualquer página renderizada — incluindo as 404s geradas por este template.

## Considerações Técnicas

### Decisões Principais

```
Decisão: Template puro sem content/404.md
Justificativa: layouts/404.html é o mecanismo nativo e suficiente do Hugo.
Um content file adicionaria complexidade sem benefício funcional.

Decisão: relLangURL para URLs dos botões
Justificativa: Gera /posts/ em PT e /en/posts/ em EN automaticamente.
Alternativa rejeitada: strings hardcoded com {{ if eq .Site.Language.Lang "en" }}
— frágil e duplica lógica que o Hugo já resolve nativamente.

Decisão: Sem partial dedicado para o conteúdo 404
Justificativa: Template com < 30 linhas, não reutilizado em outros layouts.
Code-standards.md recomenda extração apenas para templates complexos ou reutilizáveis.

Decisão: Modificação cirúrgica em baseof.html para suporte a {{ block "title" }}
Justificativa: Atende requisito do PRD de <title> refletir o idioma ativo.
A mudança é aditiva e não-quebra — todos os layouts existentes continuam
usando o fallback {{ .Title }} via {{ block "title" . }}{{ .Title }}{{ end }}.
```

### Riscos Conhecidos

```
Risco: Hugo server vs. produção em GitHub Pages
Contexto: hugo server serve 404 diretamente do template. Em produção,
GitHub Pages serve o /404.html raiz para qualquer URL não encontrada,
o que significa que /en/404.html pode não ser servido automaticamente
para rotas sob /en/.
Mitigação: Validar comportamento no ambiente de deploy — pode requerer
configuração de custom 404 no hosting provider. Fora do escopo desta
implementação, mas deve ser verificado antes do lançamento.

Risco: URL de posts difere do esperado
Contexto: relLangURL "posts/" assume que a seção de posts está em /posts/.
Se a configuração do Hugo usar contentDir ou permalinks customizados, a URL
pode diferir.
Mitigação: Verificar public/posts/index.html após o build para confirmar
o path correto antes de finalizar o template.
```

### Conformidade com Padrões

- [code-standards.md](../../.claude/rules/code-standards.md) — Template em inglês, classes CSS em kebab-case, variáveis camelCase, nomes de arquivo descritivos, template < 30 linhas
- [logging.md](../../.claude/rules/logging.md) — Sem JavaScript client-side novo; sem logs a configurar para esta feature
- [tests.md](../../.claude/rules/tests.md) — Testes E2E com Playwright cobrindo PT e EN; um comportamento por teste; nomes descritivos

### Arquivos Relevantes e Dependentes

**Novos:**
```
layouts/404.html
```

**Modificados:**
```
i18n/pt.yaml                    — 4 novas chaves not_found_*
i18n/en.yaml                    — 4 novas chaves not_found_*
layouts/_default/baseof.html    — 1 linha: adicionar bloco {{ block "title" }}
```

**Dependentes:**
```
Nenhum template existente depende de layouts/404.html.
A modificação em baseof.html é retrocompatível — todos os layouts
existentes continuam funcionando sem alteração.
```
