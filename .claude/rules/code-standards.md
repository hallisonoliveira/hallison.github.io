# Padrões de Codificação

## Idioma

Todo o código-fonte deve ser escrito em inglês, incluindo nomes de variáveis, comentários e documentação. Conteúdo (posts, páginas) deve ser em português ou inglês conforme apropriado para o idioma do site.

**Exemplo:**
```html
<!-- ❌ Evite -->
<div class="containerProduto">{{ $nomeDoProduto }}</div>

<!-- ✅ Prefira -->
<div class="product-container">{{ $productName }}</div>
```

## Convenções de Nomenclatura

### camelCase
Utilize para variáveis de template (Go Templates) e JavaScript.

**Exemplo:**
```hugo
{{ $userName := "John" }}
{{ $isActive := true }}
{{ range $userId, $user := .Users }}
  {{ $userName := $user.Name }}
{{ end }}
```

### kebab-case
Utilize para nomes de arquivos, diretórios, classes CSS e parâmetros TOML.

**Exemplo:**
```
layouts/partials/header-nav.html
layouts/partials/footer-social.html
content/articles/getting-started.md
static/css/main.css
```

**TOML Configuration:**
```toml
[params]
  site-name = "Hallison Oliveira"
  author-name = "Hallison"
```

**CSS Classes:**
```html
<div class="primary-container">
  <h1 class="text-primary">Título</h1>
</div>
```

## Nomenclatura Clara

Evite abreviações, mas também não escreva nomes muito longos (com mais de 40 caracteres para arquivos/variáveis).

**Exemplo:**
```
❌ Evite
layouts/p-header.html (muito abreviado)
layouts/partials/header-navigation-with-dynamic-language-support.html (muito longo)

✅ Prefira
layouts/partials/header-nav.html
layouts/partials/language-switcher.html
```

## Variáveis de Template

Declare variáveis Hugo com clareza e contexto relevante.

**Exemplo:**
```hugo
<!-- ❌ Evite -->
{{ $p := .Page }}
{{ $arr := .Params.tags }}

<!-- ✅ Prefira -->
{{ $currentPage := .Page }}
{{ $articleTags := .Params.tags }}
{{ $totalCount := len .Data.Pages }}
```

## Partials e Shortcodes

Partials e shortcodes devem ter nomes claros que descrevam sua função.

**Exemplo:**
```
✅ Prefira
layouts/partials/article-header.html
layouts/partials/language-selector.html
layouts/shortcodes/highlight-box.html
layouts/shortcodes/code-block.html

❌ Evite
layouts/partials/header.html (genérico demais)
layouts/partials/component.html (muito vago)
layouts/shortcodes/box.html (ambíguo)
```

**Hugo Template:**
```hugo
<!-- ✅ Prefira - nomes descritivos -->
{{ partial "article-header" . }}
{{ partial "social-links" .Site.Params.socialLinks }}

<!-- ❌ Evite - nomes genéricos -->
{{ partial "header" . }}
{{ partial "component" . }}
```

## Front Matter

Estruture o front matter de forma clara e consistente. Use apenas parâmetros necessários.

**Exemplo YAML:**
```yaml
---
title: Título do Artigo
description: Uma descrição breve do conteúdo
date: 2024-04-16T10:30:00Z
draft: false
tags: [tag1, tag2]
---
```

**Evite:**
```yaml
---
title: Artigo
t: Título
d: Descrição
e: Email do autor
a: Endereço do autor
---
```

## Parâmetros de Configuração

No `config.toml`, agrupe parâmetros relacionados e use nomenclatura clara.

**Exemplo:**
```toml
[params]
  site-name = "Hallison Oliveira"
  author-name = "Hallison"
  email = "hallisoncwb@gmail.com"

[params.pt]
  site-subtitle = "Tecnologia, Audio e afins"
  site-description = "Sobre ideias, código e arquitetura"
```

## Estruturas de Controle em Templates

Mantenha estruturas condicionais simples e legíveis. Evite aninhamento profundo.

**Exemplo:**
```hugo
<!-- ❌ Evite - aninhamento profundo -->
{{ if .Page }}
  {{ if .Page.IsPublished }}
    {{ if .Page.HasContent }}
      {{ if .Page.Date }}
        <article>{{ .Page.Content }}</article>
      {{ end }}
    {{ end }}
  {{ end }}
{{ end }}

<!-- ✅ Prefira - fluxo claro -->
{{ if not .Page }}
  {{ return }}
{{ end }}
{{ if not .Page.IsPublished }}
  {{ return }}
{{ end }}
{{ if not .Page.HasContent }}
  {{ return }}
{{ end }}

<article>{{ .Page.Content }}</article>
```

## Tamanho de Templates

- Evite layouts e partials muito longos (com mais de 100 linhas)
- Divida templates complexos em partials menores

**Exemplo:**
```
❌ Evite
layouts/_default/single.html (500 linhas com tudo junto)

✅ Prefira
layouts/_default/single.html
├── layouts/partials/article-header.html
├── layouts/partials/article-content.html
├── layouts/partials/article-footer.html
└── layouts/partials/article-navigation.html
```

## Formatação em Templates

Utilize linhas em branco para separar blocos lógicos e melhorar legibilidade.

**Exemplo:**
```hugo
<!-- ❌ Evite -->
{{ range .Pages }}
<article>
<h2>{{ .Title }}</h2>
<p>{{ .Summary }}</p>
<time>{{ .Date }}</time>
</article>
{{ end }}

<!-- ✅ Prefira -->
{{ range .Pages }}

  <article>
    <h2>{{ .Title }}</h2>

    <p>{{ .Summary }}</p>

    <time>{{ .Date.Format "2006-01-02" }}</time>
  </article>

{{ end }}
```

## Comentários em Templates

Utilize comentários Hugo quando a lógica não é óbvia. Use comentários em HTML para indicar seções principais.

**Exemplo:**
```hugo
<!-- ✅ Prefira -->
<!-- Article listing section -->
{{ if .Pages }}
  {{- /* Only show articles if there are any */ -}}
  {{ range .Pages }}
    <article>{{ .Title }}</article>
  {{ end }}
{{ else }}
  <p>No articles found.</p>
{{ end }}
```

## Variáveis Hugo

Declare variáveis do lado esquerdo (left-hand side). Reutilize escopos quando apropriado.

**Exemplo:**
```hugo
<!-- ✅ Prefira -->
{{ $pages := where .Site.RegularPages "Type" "articles" }}
{{ $sorted := (sort $pages "Date" "desc") }}

{{ range $sorted }}
  {{ $wordCount := .WordCount }}
  <article>
    <h2>{{ .Title }}</h2>
    <span class="word-count">{{ $wordCount }} words</span>
  </article>
{{ end }}

<!-- ❌ Evite -->
{{ range .Site.RegularPages }}
  {{ if eq .Type "articles" }}
    <article>{{ .Title }}</article>
  {{ end }}
{{ end }}
```

## Conteúdo em Markdown

Estruture posts com front matter claro e conteúdo bem organizado.

**Exemplo:**
```markdown
---
title: Como Estruturar seu Projeto Hugo
date: 2024-04-16T10:30:00Z
description: Uma guia completa sobre como organizar seu site Hugo
tags: [hugo, web-development]
draft: false
---

# Introdução

Seu conteúdo aqui...

## Seção 1

Mais conteúdo...
```

## CSS

Utilize seletores semânticos e classes bem nomeadas. Prefira utility-first quando apropriado.

**Exemplo:**
```css
/* ✅ Prefira - Específico e reutilizável */
.article-card {
  border-radius: 0.5rem;
  background: var(--color-surface);
  padding: 1.5rem;
}

.article-card__title {
  font-size: 1.25rem;
  font-weight: 600;
}

.article-card__meta {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

/* ❌ Evite - Nomes genéricos */
.container {
  /* muitos estilos desconexos */
}

.card {
  /* ambíguo - qual tipo de card? */
}
```

## JavaScript em Hugo

Mantenha scripts simples. Use vanilla JavaScript quando possível.

**Exemplo:**
```javascript
// ✅ Prefira - Simples e direto
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  
  themeToggle?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });
});

// ❌ Evite - Frameworks pesados para operações simples
import $ from 'jquery';
$('#theme-toggle').click(function() {
  $(document.documentElement).toggleClass('dark');
});
```

## Estrutura de Diretórios

Organize arquivos logicamente e mantenha a estrutura consistente.

**Exemplo:**
```
content/
├── articles/
│   └── my-article.md
├── pages/
│   └── about.md
└── blog/
    └── post-name.md

layouts/
├── _default/
│   ├── single.html
│   └── list.html
├── partials/
│   ├── header-nav.html
│   ├── footer-social.html
│   └── article-meta.html
└── shortcodes/
    └── highlight-box.html

static/
└── css/
    └── main.css
```

