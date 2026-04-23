# Tech Spec: Sistema de Internacionalização (i18n) Robusto

## Resumo Executivo

A solução refactora a implementação de i18n atual, consolidando a lógica fragmentada em componentes reutilizáveis e aproveitando os mecanismos nativos de Hugo para multilíngue. A arquitetura separa responsabilidades entre **build-time** (Hugo renderiza URLs e conteúdo correto), **server-side templates** (tradução de UI strings via i18n), e **client-side** (persistência de preferência de idioma com fallback para detecção de navegador). URL strategy mantém PT na raiz (/), EN prefixado (/en/); conteúdo não traduzido é automaticamente ocultado do idioma alvo; datas são localizadas via ficheiros i18n Hugo.

## Arquitetura do Sistema

### Visão Geral dos Componentes

**Configuração (config.toml):**
- Estrutura de linguagens já existe; será estendida com parâmetros de i18n (enableI18nWarn, defaultLanguage)
- Novos parâmetros de UI strings traduzidas para header, footer, mensagens de navegação

**Layouts & Partials:**
- `layouts/_default/baseof.html` – será refatorado: remover lógica JS inline, importar `language-service.js`
- `layouts/partials/header.html` – simplificar navegação: substituir ifs inline por template functions do i18n
- `layouts/partials/footer.html` – traduzir strings hardcoded via `i18n` template function
- `layouts/partials/language-selector.html` – novo partial: botão de seleção de idioma, acessível, com aria-labels
- `layouts/partials/translation-guard.html` – novo partial: verificar se página atual tem tradução; redirecionar se não houver

**JavaScript Client-side:**
- `static/js/language-service.js` – novo: gerenciar preferência de idioma (localStorage + detecção), atualizar URLs e links
- `static/js/navigation-mapper.js` – novo: mapear URLs entre idiomas (ex: /about/ ↔ /en/about/) para navegação preservada

**Ficheiros i18n:**
- `i18n/pt.yaml` – strings de UI em português (header, footer, labels, mensagens de erro)
- `i18n/en.yaml` – strings de UI em inglês
- Meses e formatos de data localizados

**Conteúdo:**
- Estrutura existente mantida: `content/posts/article.pt.md` e `content/posts/article.en.md`
- Validação de frontmatter adicionada (script Node.js)

### Fluxo de Dados

```
1. User visits site (PT default or detected language)
   ↓
2. Hugo renders page in appropriate language
   - baseURL + language prefix (/en/ if EN)
   - content fetched from .lang.md files
   - i18n strings injected into templates
   ↓
3. language-service.js initializes
   - reads localStorage (preferredLanguage)
   - if not set, detects navigator.language
   - updates html[lang], button UI
   ↓
4. User clicks language selector
   - calls navigation-mapper.mapUrl(current, newLang)
   - redirects to /en/... or removes /en/ prefix
   - localStorage updated
   ↓
5. Post list renders
   - `where .Site.RegularPages "Type" "posts"` filters by current language
   - non-existent translations excluded via Go template logic
```

### Relacionamentos Principais

- **baseof.html** → imports `language-service.js`, calls `language-selector` partial
- **header.html** → references language-dependent links (relLangURL)
- **footer.html** → uses i18n template function for strings
- **posts/list.html** → filters content by current language via Hugo
- **language-service.js** → updates document state (html[lang], localStorage)
- **navigation-mapper.js** → provides URL transformation utilities

## Design de Implementação

### Estrutura de Templates

**layouts/_default/baseof.html** (refatorado):
```hugo
<!DOCTYPE html>
<html class="light" lang="{{ .Site.Language }}">
<head>
  {{- /* Mantém existente */ -}}
  <meta charset="utf-8"/>
  <meta name="description" content="{{ .Site.Params.siteDescription }}">
</head>
<body>
  {{ partial "header.html" . }}
  <main class="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16">
    {{ block "main" . }}{{ end }}
  </main>
  {{ partial "footer.html" . }}
  
  {{- /* Script única vez, não inline */ -}}
  <script src="/js/language-service.js" defer></script>
</body>
</html>
```

**layouts/partials/language-selector.html** (novo):
```hugo
{{- /* Seletor de idioma acessível */ -}}
<button 
  id="language-toggle"
  class="material-symbols-outlined text-on-surface dark:text-on-surface-variant cursor-pointer hover:opacity-70"
  title="{{ if eq .Site.Language "en" }}Português{{ else }}English{{ end }}"
  aria-label="{{ if eq .Site.Language "en" }}Mudar para português{{ else }}Switch to English{{ end }}"
  aria-pressed="false"
  data-current-lang="{{ .Site.Language }}"
>
  language
</button>
```

**layouts/partials/header.html** (refatorado):
```hugo
<nav class="fixed top-0 w-full z-50">
  <div class="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
    <a href="{{ relLangURL "/" }}" class="text-2xl font-black">
      {{ .Site.Params.siteName }}
    </a>

    <div class="hidden md:flex flex-1 justify-center items-center gap-8">
      {{- $current := .RelPermalink -}}
      <a href="{{ relLangURL "/" }}" 
         class="font-bold {{ if eq $current (relLangURL "/") }}text-primary-container{{ end }}">
        {{ i18n "nav_home" }}
      </a>
      <a href="{{ relLangURL "/posts/" }}" class="font-bold">
        {{ i18n "nav_posts" }}
      </a>
      <a href="{{ relLangURL "/about/" }}" class="font-bold">
        {{ i18n "nav_about" }}
      </a>
    </div>

    <div class="flex items-center gap-4">
      {{ partial "language-selector.html" . }}
    </div>
  </div>
</nav>
```

**layouts/partials/footer.html** (refatorado):
```hugo
<footer class="w-full mt-24 bg-secondary-fixed">
  <div class="flex flex-col md:flex-row justify-between items-center px-12 py-16 max-w-screen-2xl mx-auto">
    <div class="flex flex-col items-center md:items-start gap-4">
      <div class="font-bold text-primary-container text-xl">
        {{ .Site.Params.siteName }}
      </div>
      <p class="font-body text-lg italic text-primary text-center md:text-left">
        © {{ now.Year }} {{ .Site.Params.siteName }}. {{ i18n "footer_tagline" }}
      </p>
    </div>
    <div class="flex flex-wrap justify-center gap-8 mt-8 md:mt-0">
      <a href="{{ relLangURL "/privacy/" }}" class="font-body text-lg">
        {{ i18n "footer_privacy" }}
      </a>
      <a href="{{ relLangURL "/terms/" }}" class="font-body text-lg">
        {{ i18n "footer_terms" }}
      </a>
    </div>
  </div>
</footer>
```

**layouts/posts/list.html** (refatorado para filtrar por idioma):
```hugo
{{ define "main" }}
  <section class="mb-24">
    <h1 class="font-headline text-6xl md:text-7xl font-extrabold">
      {{ i18n "posts_title" }}
    </h1>
    <p class="font-body text-xl text-on-surface-variant max-w-2xl">
      {{ i18n "posts_description" }}
    </p>
  </section>

  <div class="space-y-12">
    {{- range where .Site.RegularPages "Type" "posts" -}}
      {{- /* Filtro automático por idioma via Hugo */ -}}
      <article class="group flex gap-8">
        {{- /* Conteúdo do artigo */ -}}
        <h2 class="font-headline text-2xl font-bold">
          <a href="{{ .RelPermalink }}" class="hover:underline">{{ .Title }}</a>
        </h2>
        <time datetime="{{ .Date.Format "2006-01-02" }}">
          {{ i18n "date_format" (dict "day" .Date.Day "month" (i18n (printf "month_%d" .Date.Month)) "year" .Date.Year) }}
        </time>
      </article>
    {{- end -}}
  </div>

  {{- if eq (len (where .Site.RegularPages "Type" "posts")) 0 -}}
    <div class="text-center py-32">
      <p class="font-body text-xl">{{ i18n "posts_empty" }}</p>
    </div>
  {{- end -}}
{{ end }}
```

### Modelos de Dados (Frontmatter)

Estrutura existente mantida; validação adicionada:

```yaml
---
title: Como Estruturar seu Projeto Hugo
date: 2024-04-16T10:30:00Z
description: Uma guia completa sobre como organizar seu site Hugo
tags: [hugo, web-development]
category: tutorial
draft: false
image: /images/article-header.jpg
---
```

**Campos obrigatórios:** title, date, description
**Campos opcionais:** tags, category, draft, image

### Configuração de Dados (config.toml)

```toml
baseURL = 'https://hallison.dev/'
languageCode = 'pt-br'
defaultContentLanguage = 'pt'
defaultContentLanguageInSubdir = false  # PT na raiz, EN prefixado

[languages]
  [languages.pt]
    languageCode = 'pt-br'
    languageName = 'Português'
    weight = 1
    title = 'Hallison Oliveira'
    params = {}

  [languages.en]
    languageCode = 'en-us'
    languageName = 'English'
    weight = 2
    title = 'Hallison Oliveira'
    params = {}

[params]
  siteName = 'Hallison Oliveira'
  author = 'Hallison'
  email = 'hallisoncwb@gmail.com'

[params.pt]
  siteSubtitle = 'Tecnologia, Audio e afins'
  siteDescription = 'Sobre ideias, código, arquitetura e boas práticas em desenvolvimento.'

[params.en]
  siteSubtitle = 'Technology, Audio and related'
  siteDescription = 'About ideas, code, architecture and best practices in software development.'

# Build flags para i18n
enableMissingTranslationPlaceholders = true
```

## Pontos de Integração

**Build-time (Hugo):**
- Hugo processa `.pt.md` e `.en.md` separadamente
- Gera URLs com `/en/` prefix para inglês, sem prefix para português
- Templates injetam i18n strings via `{{ i18n "key" }}`
- Ficheiros em `i18n/` fornecem traduções

**Client-side (JavaScript):**
- `language-service.js` lê localStorage e localStorage persistência
- Detecta `navigator.language` para primeiro acesso
- Atualiza `html[lang]` para acessibilidade
- Redireciona via `navigation-mapper.mapUrl()` ao trocar idioma

**Assets estáticos:**
- Nenhuma integração com APIs externas
- Site estático, hospedado na Vercel
- Sem backend necessário

## Abordagem de Testes

### Validação de Conteúdo

```javascript
// scripts/validate-i18n.js
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const postsDir = './content/posts';
const requiredFields = ['title', 'date', 'description'];

function validateFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (!match) throw new Error(`No frontmatter in ${filePath}`);
  
  const fm = yaml.load(match[1]);
  requiredFields.forEach(field => {
    if (!fm[field]) throw new Error(`Missing "${field}" in ${filePath}`);
  });
  
  return true;
}

// Validar todos os posts
fs.readdirSync(postsDir, { recursive: true })
  .filter(f => f.endsWith('.md'))
  .forEach(file => {
    try {
      validateFrontmatter(path.join(postsDir, file));
      console.log(`✅ ${file}`);
    } catch (err) {
      console.error(`❌ ${file}: ${err.message}`);
      process.exit(1);
    }
  });
```

### Testes de Build

```bash
#!/bin/bash
# scripts/validate-build.sh

# Validar build sem warnings
hugo --printI18nWarnings 2>&1 | tee build.log

if grep -i "missing" build.log; then
  echo "❌ Missing translations detected"
  exit 1
fi

# Verificar ficheiros críticos gerados
test -f public/index.html || exit 1
test -f public/en/index.html || exit 1
test -f public/sitemap.xml || exit 1

echo "✅ Build validation passed"
```

### Testes E2E com Playwright

```javascript
// tests/e2e/i18n.spec.js
import { test, expect } from '@playwright/test';

test('should display site in Portuguese by default', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
  await expect(page.locator('nav')).toContainText('Início');
  await expect(page.locator('footer')).toContainText('2025');
});

test('should switch to English and preserve navigation', async ({ page }) => {
  await page.goto('/posts/');
  const langButton = page.locator('#language-toggle');
  
  await langButton.click();
  
  await expect(page).toHaveURL('/en/posts/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('nav')).toContainText('Home');
});

test('should persist language preference', async ({ page, context }) => {
  // Carregar storage do primeiro contexto
  await page.goto('/');
  await page.locator('#language-toggle').click();
  
  // Nova página em novo contexto deve manter preferência
  const newPage = await context.newPage();
  await newPage.goto('/');
  
  // Aguardar JS executar
  await newPage.waitForTimeout(100);
  
  // Verificar que preferência foi mantida
  const localStorage = await newPage.evaluate(() => 
    window.localStorage.getItem('preferredLanguage')
  );
  expect(localStorage).toBe('en');
});

test('should detect browser language on first visit', async ({ browser }) => {
  const context = await browser.newContext({
    locale: 'en-US'
  });
  const page = await context.newPage();
  
  await page.goto('/');
  const localStorage = await page.evaluate(() => 
    window.localStorage.getItem('preferredLanguage')
  );
  
  expect(localStorage).toBe('en');
});

test('should hide non-translated posts from EN list', async ({ page }) => {
  await page.goto('/en/posts/');
  
  const postTitles = await page.locator('article h2 a').allTextContents();
  
  // Verificar que PT-only posts não aparecem
  // (Assumindo que há posts que só existem em PT)
  expect(postTitles.length).toBeLessThan(13); // Se houver PT-only posts
});

test('should navigate from home to about while preserving language', async ({ page }) => {
  await page.goto('/en/');
  
  await page.locator('nav a:has-text("About")').click();
  
  await expect(page).toHaveURL('/en/about/');
  await expect(page.locator('h1')).toContainText('Architect');
});
```

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Configuração i18n Hugo**
   - Estender `config.toml` com parâmetros i18n
   - Criar `i18n/pt.yaml` e `i18n/en.yaml` com strings de UI

2. **Refatorar templates**
   - Remover lógica JS inline de `baseof.html`
   - Criar `language-selector.html` partial
   - Refatorar `header.html` e `footer.html` com `relLangURL` e `i18n` functions
   - Atualizar `posts/list.html` para filtrar por idioma

3. **Implementar JavaScript**
   - `static/js/language-service.js` – persistência + detecção
   - `static/js/navigation-mapper.js` – mapeamento de URLs

4. **Validação de conteúdo**
   - Criar script `scripts/validate-i18n.js`
   - Rodar contra `content/posts/`

5. **Testes build & E2E**
   - Executar `scripts/validate-build.sh`
   - Configurar Playwright
   - Correr testes E2E

### Dependências Técnicas

- `config.toml` deve estar correto antes de refatorar templates
- Conteúdo `.pt.md` e `.en.md` deve estar pronto para testes
- Hugo v0.100+ (para `relLangURL`)
- Node.js v18+ (para validação e Playwright)

## Monitoramento e Observabilidade

**Build-time:**
```bash
hugo --printI18nWarnings --logFile=build.log
```
Log exibe warnings para strings i18n não traduzidas.

**Client-side:**
```javascript
// language-service.js
console.log('Language initialized', {
  detected: navigator.language,
  stored: localStorage.getItem('preferredLanguage'),
  current: document.documentElement.lang,
  timestamp: new Date().toISOString()
});

// Track language switch
document.getElementById('language-toggle')?.addEventListener('click', () => {
  console.log('Language switched', {
    from: document.documentElement.lang,
    to: nextLang,
    timestamp: new Date().toISOString()
  });
});
```

**Performance:**
```javascript
// Medir tempo de redirecionamento
const start = performance.now();
window.location.href = newUrl;
console.log('Navigation time', { duration: `${performance.now() - start}ms` });
```

## Considerações Técnicas

### Decisões Principais

| Decisão | Justificativa | Trade-off |
|---------|---------------|-----------|
| **URL: PT raiz, EN prefixado** | Preserva URLs existentes em PT; SEO favorável | EN URLs menos intuitivas |
| **i18n Hugo nativo** | Build-time, sem JS overhead, seguro | Menos flexível que runtime |
| **localStorage + browser detect** | Balanceia persistência com first-time UX | Requer JS; localStorage pode ser limpo |
| **Filtro automático de posts** | Hugo renderiza apenas posts do idioma atual | Sem fallback visual se tradução missing |
| **Partial language-selector** | Componentizável, reutilizável | Extra HTTP request (minor) |

### Riscos Conhecidos

| Risco | Mitigação |
|-------|-----------|
| **Posts não traduzidos quebram links** | Usar script `navigation-mapper.mapUrl()` com fallback para home do idioma |
| **localStorage vazio em incógnito** | Detectar `navigator.language` como fallback |
| **Inconsistência de idioma entre URL e localStorage** | Sempre usar URL como fonte de verdade; localStorage apenas para default inicial |
| **Tradução missing quebra site** | `enableMissingTranslationPlaceholders = true` exibe `[i18n] key` visualmente |
| **Navegação profunda com redirecionamento** | `navigation-mapper.mapUrl()` mapeia posts pelo slug; se não existir EN, redireciona para `/en/posts/` |

### Conformidade com Padrões

**Aplicáveis:**
- [code-standards.md](../../.claude/rules/code-standards.md)
  - Nomenclatura: partials em kebab-case (`language-selector.html`)
  - JavaScript: vanilla sem frameworks pesados
  - Templates: variáveis camelCase (`preferredLanguage`)

- [logging.md](../../.claude/rules/logging.md)
  - Build logs via `hugo --printI18nWarnings`
  - Client-side logs estruturados em `language-service.js`
  - Sem dados sensíveis nos logs

- [tests.md](../../.claude/rules/tests.md)
  - Validação de frontmatter via script Node.js
  - Testes de build com validação HTML
  - E2E com Playwright para navegação de idioma

### Arquivos Relevantes e Dependentes

**Novos:**
```
layouts/partials/language-selector.html
static/js/language-service.js
static/js/navigation-mapper.js
i18n/pt.yaml
i18n/en.yaml
scripts/validate-i18n.js
scripts/validate-build.sh
tests/e2e/i18n.spec.js
```

**Modificados:**
```
config.toml (parâmetros i18n)
layouts/_default/baseof.html (remover JS inline)
layouts/partials/header.html (usar i18n + relLangURL)
layouts/partials/footer.html (usar i18n)
layouts/posts/list.html (filtro automático)
layouts/about/list.html (usar i18n)
layouts/index.html (data formatting)
```

**Dependentes:**
```
content/posts/*.md (frontmatter validation)
Qualquer CSS que estilize strings i18n
Vercel deployment (sem build script changes)
```

---

**Sources:**
- [Hugo Multilingual Mode](https://gohugo.io/content-management/multilingual/)
- [Hugo URL Management](https://gohugo.io/content-management/urls/)
- [i18n Tutorial: Hugo](https://phrase.com/blog/posts/i18n-tutorial-how-to-go-multilingual-with-hugo/)
