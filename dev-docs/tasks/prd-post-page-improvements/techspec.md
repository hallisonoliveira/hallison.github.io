# Tech Spec — Melhorias na Página de Post

## Resumo Executivo

A implementação consiste em uma revisão completa do layout de post (`single.html`), extraindo-o em partials modulares conforme os padrões do projeto, e garantindo conformidade visual com o mockup em `mockup/post/code.html`. O único bug funcional identificado (RF08 — post atual aparece nos relacionados) será corrigido via filtro Hugo. O template atual já implementa grande parte dos requisitos visuais; a revisão servirá para auditar, consolidar e refatorar a estrutura sem alterar header e footer. RF06 (figcaption) está fora do escopo desta entrega.

A estratégia central é: decompor `single.html` em quatro partials responsáveis por seções distintas da página, corrigir o filtro de posts relacionados e verificar conformidade de cada RF contra o mockup de referência.

---

## Arquitetura do Sistema

### Visão Geral dos Componentes

```
Modificados:
- layouts/_default/single.html        → orquestrador, delega para partials

Novos:
- layouts/partials/post-header.html   → metadados + título + imagem de destaque
- layouts/partials/post-content.html  → sidebar sticky + corpo do artigo (prose)
- layouts/partials/post-related.html  → seção "Leitura Relacionada" (bug RF08 corrigido)
- layouts/partials/post-navigation.html → prev/next section navigation
```

Fluxo de contexto: `single.html` passa o contexto de página (`.`) para cada partial. Nenhum dado adicional é necessário além do contexto padrão Hugo.

---

## Design de Implementação

### Estrutura de Templates

**`layouts/_default/single.html`** (orquestrador — ≤15 linhas)
```hugo
{{ define "main" }}

  {{ partial "post-header" . }}

  {{ partial "post-content" . }}

  {{ partial "post-related" . }}

  {{ partial "post-navigation" . }}

{{ end }}
```

---

**`layouts/partials/post-header.html`**

Responsável por: chip de categoria, data, tempo de leitura, título (com subtitle opcional), imagem de destaque com overlay.

Referência de classes para título (RF01):
```html
<h1 class="font-headline text-5xl md:text-7xl font-extrabold
           tracking-tighter text-on-surface leading-none mb-8">
```

Referência para imagem de destaque (RF02):
```html
<div class="relative w-full aspect-[21/9] mb-24 overflow-hidden rounded-xl">
  <img class="w-full h-full object-cover grayscale brightness-90
              hover:grayscale-0 transition-all duration-700" ...>
  <div class="absolute inset-0 bg-surface-tint opacity-5 pointer-events-none"></div>
</div>
```

---

**`layouts/partials/post-content.html`**

Responsável por: grid 12 colunas, sidebar sticky (autor + topics), corpo do artigo com prose.

Referência de classes prose (RF03, RF05, RF09):
```html
<div class="lg:col-span-8 lg:col-start-5 space-y-12">
  <div class="prose prose-lg max-w-none
    prose-p:font-body prose-p:text-xl prose-p:leading-relaxed prose-p:mb-6
    prose-img:rounded-xl prose-img:my-8
    prose-a:text-primary-container prose-a:underline hover:prose-a:opacity-80
    ...
  ">
    {{ .Content }}
  </div>
</div>
```

Drop cap (RF04) — mantido via CSS global em `baseof.html`:
```css
.prose p:first-of-type::first-letter { /* já existente */ }
```

Sem `text-indent` nos parágrafos — garantido pela ausência de `prose-p:indent-*`.

---

**`layouts/partials/post-related.html`** — **correção RF08**

Lógica atual (bugada):
```hugo
{{ $related := where (where .Site.RegularPages "Type" "posts") "Params.category" .Params.category }}
{{ $related := first 3 (shuffle $related) }}
```

Lógica corrigida — excluir o post atual pelo `.Permalink`:
```hugo
{{ $currentPermalink := .Permalink }}
{{ $allInCategory := where (where .Site.RegularPages "Type" "posts") "Params.category" .Params.category }}
{{ $filtered := where $allInCategory "Permalink" "ne" $currentPermalink }}
{{ $related := first 3 (shuffle $filtered) }}
```

---

**`layouts/partials/post-navigation.html`**

Responsável por: navegação prev/next dentro da seção `posts`, sem alterações de lógica.

---

### Modelos de Dados (Frontmatter)

Nenhuma alteração no frontmatter dos posts. Campos utilizados pelos partials:

```yaml
---
title: "Título do Post"
date: 2026-04-29
image: cover.png          # opcional — ativa imagem de destaque
category: Livros          # usado para filtro de relacionados
tags: [tag1, tag2]        # exibidos na sidebar como topics
subtitle: "..."           # opcional — texto em itálico após título
author: "Nome"            # opcional — exibido na sidebar
author_image: "foto.jpg"  # opcional
author_role: "Cargo"      # opcional
topics: [tópico1]         # opcional — chips na sidebar
draft: false
---
```

---

### Configuração de Dados (config.toml)

Nenhuma alteração necessária no `config.toml`. As chaves i18n já existentes são suficientes:
- `related_reading`, `previous_article`, `next_article`
- `author_label`, `topics_label`, `reading_time`, `date_format`

---

## Pontos de Integração

Não há integrações externas nesta funcionalidade. O CSS (Tailwind via CDN) e fontes (Google Fonts) já estão carregados em `baseof.html` e não requerem modificações.

---

## Abordagem de Testes

### Validação de Conteúdo

Verificar que posts com `category` definida não exibem o post atual na seção relacionada:

```bash
# Build sem erros
hugo
```

Inspecionar manualmente o HTML gerado para o post de exemplo:
```bash
grep -A5 "related" public/posts/empatia-assertiva/index.html
```

### Testes de Build

```bash
hugo
# Verificar saída sem erros ou warnings críticos
# Verificar que partial files existem
test -f layouts/partials/post-header.html
test -f layouts/partials/post-content.html
test -f layouts/partials/post-related.html
test -f layouts/partials/post-navigation.html
```

### Testes E2E com Playwright

```javascript
describe('Post Page', () => {
  it('should not show current post in related reading', async ({ page }) => {
    await page.goto('/pt/posts/empatia-assertiva/');
    const relatedLinks = await page.locator('section a[href]').all();
    for (const link of relatedLinks) {
      const href = await link.getAttribute('href');
      expect(href).not.toContain('empatia-assertiva');
    }
  });

  it('should display feature image with correct aspect ratio', async ({ page }) => {
    await page.goto('/pt/posts/empatia-assertiva/');
    const img = page.locator('div.aspect-\\[21\\/9\\]');
    await expect(img).toBeVisible();
  });

  it('should render title with correct font classes', async ({ page }) => {
    await page.goto('/pt/posts/empatia-assertiva/');
    await expect(page.locator('h1.font-headline')).toBeVisible();
  });
});
```

---

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. Criar `layouts/partials/post-header.html` — extraído do bloco hero/header do `single.html` atual
2. Criar `layouts/partials/post-content.html` — extraído do bloco grid/sidebar/prose
3. Criar `layouts/partials/post-related.html` — com a correção RF08 aplicada
4. Criar `layouts/partials/post-navigation.html` — extraído do bloco nav prev/next
5. Reescrever `layouts/_default/single.html` como orquestrador limpo
6. Auditar cada RF do PRD contra o HTML renderizado em `hugo server`
7. Executar build e testes

### Dependências Técnicas

```
- Conteúdo de exemplo (content/posts/empatia-assertiva/) já disponível para testes
- Tailwind CDN e fontes já configurados em baseof.html — sem alterações necessárias
- i18n keys já existem — sem adições ao pt.yaml / en.yaml
```

---

## Monitoramento e Observabilidade

```bash
# Build-time: verificar ausência de erros
hugo -v 2>&1 | grep -i "error\|warn"

# Validar que posts relacionados não incluem o post atual
hugo && grep -r "empatia-assertiva" public/posts/empatia-assertiva/index.html | grep "related" || echo "✅ RF08 OK"
```

Não há JavaScript novo nesta entrega — nenhum monitoramento client-side adicional necessário.

---

## Considerações Técnicas

### Decisões Principais

```
Decisão: Extrair 4 partials a partir do single.html
Justificativa: Template atual tem 180 linhas, acima do limite de 100 do padrão do projeto.
Cada partial tem responsabilidade única e pode ser mantido independentemente.
Trade-off: Aumenta número de arquivos, mas reduz complexidade por arquivo.

Decisão: Usar .Permalink (não .RelPermalink) para o filtro RF08
Justificativa: .Permalink é absoluto e único por post, garantindo exclusão correta
em ambos os idiomas (PT e EN).
Alternativa rejeitada: Comparar por .File.Path — frágil se o arquivo for renomeado.

Decisão: RF06 (figcaption) fora do escopo
Justificativa: Hugo não gera <figcaption> a partir de Markdown padrão sem shortcode.
Resolver adequadamente requer decisão de UX sobre convenção de uso pelo editor.
```

### Riscos Conhecidos

```
Risco: Tailwind via CDN pode não gerar classes de partials novos em produção
Mitigação: CDN mode do Tailwind escaneia o DOM em runtime — sem risco de purge.
Produção usa CDN, então todas as classes serão disponíveis.

Risco: Shuffle de posts relacionados pode variar entre builds (não determinístico)
Mitigação: Comportamento existente e aceitável. Sem alteração neste ponto.
```

### Conformidade com Padrões

- [code-standards.md](../../.claude/rules/code-standards.md) — naming kebab-case para partials (`post-header.html`), variáveis camelCase (`$currentPermalink`, `$allInCategory`), templates ≤100 linhas por arquivo, comentários apenas onde lógica não é óbvia
- [logging.md](../../.claude/rules/logging.md) — sem JavaScript novo nesta entrega; não aplicável
- [tests.md](../../.claude/rules/tests.md) — testes E2E com Playwright para validar RF08 e estrutura visual principal

### Arquivos Relevantes e Dependentes

**Novos arquivos:**
```
layouts/partials/post-header.html
layouts/partials/post-content.html
layouts/partials/post-related.html
layouts/partials/post-navigation.html
```

**Modificados:**
```
layouts/_default/single.html (reescrito como orquestrador)
```

**Dependentes (sem alteração necessária):**
```
layouts/_default/baseof.html (CSS global, drop cap, fontes)
i18n/pt.yaml, i18n/en.yaml (chaves já existentes)
content/posts/**/ (todos os posts usam este layout)
```
