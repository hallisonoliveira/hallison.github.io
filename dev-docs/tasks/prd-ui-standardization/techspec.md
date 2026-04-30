# Tech Spec — Padronização Visual do Blog

## Resumo Executivo

As mudanças são exclusivamente de layout e classes CSS Tailwind, sem lógica nova. Quatro arquivos de layout são editados cirurgicamente para eliminar padding duplicado em `single.html`, uniformizar `max-w-screen-xl` em todas as páginas, padronizar espaçamento vertical primário em `mb-24` e fixar `duration-300` como valor único para transições de cor/opacidade. Nenhum novo arquivo, partial ou dependência é introduzido.

## Arquitetura do Sistema

### Visão Geral dos Componentes

```
Modificados:
- layouts/_default/single.html     — remove px duplicado; corrige mt-32 → mt-24; adiciona duration-300
- layouts/index.html               — adiciona wrapper max-w-screen-xl mx-auto
- layouts/posts/list.html          — adiciona wrapper max-w-screen-xl mx-auto
- layouts/about/list.html          — max-w-7xl → max-w-screen-xl; mb-32 → mb-24; duration-300 em links

Inalterados:
- layouts/_default/baseof.html     — fonte de verdade do padding horizontal (px-6 md:px-12 lg:px-16)
- layouts/partials/*               — sem alterações
```

## Design de Implementação

### Estrutura de Templates

**RF-01 — Remover padding duplicado em `single.html`:**

O `<article>`, a `<section>` de leituras relacionadas e a `<nav>` de navegação entre posts redefinem `px-6 md:px-12`, somando ao padding já presente em `<main>` no `baseof.html`. A correção é remover `px-6 md:px-12` desses três elementos, mantendo apenas `max-w-screen-xl mx-auto`.

```hugo
{{- /* layouts/_default/single.html — antes */ -}}
<article class="max-w-screen-xl mx-auto px-6 md:px-12">
<section class="max-w-screen-xl mx-auto px-6 md:px-12 mt-32 mb-24">
<nav class="max-w-screen-xl mx-auto px-6 md:px-12 grid ...">

{{- /* layouts/_default/single.html — depois */ -}}
<article class="max-w-screen-xl mx-auto">
<section class="max-w-screen-xl mx-auto mt-24 mb-24">
<nav class="max-w-screen-xl mx-auto grid ...">
```

---

**RF-02 — Adicionar `max-w-screen-xl` em `index.html` e `posts/list.html`:**

Envolver o conteúdo principal de cada página em um `<div>` container único. A abordagem de wrapper é preferível a adicionar a classe em cada seção individualmente porque preserva a estrutura atual e é menos invasiva.

```hugo
{{- /* layouts/index.html */ -}}
{{ define "main" }}
  <div class="max-w-screen-xl mx-auto">
    <!-- Editorial Header Section -->
    <section class="mb-24 flex flex-col md:flex-row items-baseline gap-8">
      ...
    </section>

    <!-- Post List -->
    <div class="space-y-32">
      ...
    </div>

    <!-- Pagination -->
    ...
  </div>
{{ end }}
```

```hugo
{{- /* layouts/posts/list.html */ -}}
{{ define "main" }}
  <div class="max-w-screen-xl mx-auto">
    <!-- Page Header -->
    <section class="mb-24">
      ...
    </section>

    <!-- Posts List -->
    <div class="space-y-12">
      ...
    </div>
  </div>
{{ end }}
```

Para `about/list.html`, substituir `max-w-7xl` por `max-w-screen-xl` nas duas seções onde aparece (Hero e Philosophy). As margens negativas compensatórias da seção Philosophy (`-mx-6 md:-mx-12 lg:-mx-16`) permanecem intactas — elas dependem do padding do `baseof.html`, não de `max-w`.

---

**RF-03 — Espaçamento vertical: `mb-32` → `mb-24` em `about/list.html`:**

```hugo
{{- /* layouts/about/list.html — Hero Section */ -}}
<section class="max-w-screen-xl mx-auto mb-24">  {{- /* era mb-32 */ -}}

{{- /* layouts/about/list.html — Philosophy Section */ -}}
<section class="bg-secondary-fixed py-32 mb-24 -mx-6 md:-mx-12 lg:-mx-16 ...">  {{- /* era mb-32 */ -}}
```

Em `single.html`, o `mt-32` da seção de leituras relacionadas passa para `mt-24`, alinhando com o padrão de seções primárias:

```hugo
<section class="max-w-screen-xl mx-auto mt-24 mb-24">  {{- /* era mt-32 mb-24 */ -}}
```

---

**RF-04 — Adicionar `duration-300` em transições sem duração:**

Elementos que declaram `transition-opacity` ou `transition-colors` sem `duration-*` recebem `duration-300`:

```hugo
{{- /* about/list.html — social links */ -}}
<a class="... hover:opacity-80 transition-opacity duration-300" ...>

{{- /* single.html — share buttons */ -}}
<button class="... hover:bg-primary-fixed transition-colors duration-300">

{{- /* single.html — nav anterior/próximo */ -}}
<a class="... hover:opacity-70 transition-opacity duration-300" ...>
```

Imagens com `duration-700` (grayscale/scale) permanecem inalteradas em todos os layouts.

### Modelos de Dados (Frontmatter)

Nenhuma alteração. Esta feature toca apenas arquivos em `layouts/`.

### Configuração de Dados (config.toml)

Nenhuma alteração. Nenhum parâmetro novo é necessário.

## Pontos de Integração

Nenhuma integração externa. As alterações são autocontidas nos arquivos de layout do Hugo.

## Abordagem de Testes

### Validação de Conteúdo

Não aplicável — nenhum arquivo de conteúdo é modificado.

### Testes de Build

```bash
# Validar build sem erros após todas as alterações
hugo && echo "Build OK" || exit 1
```

### Testes E2E com Playwright

```javascript
// Verificar ausência de padding duplo na página de post
describe('Single post layout', () => {
  it('should have consistent left margin with other pages', async ({ page }) => {
    await page.goto('/posts/');
    const postLink = page.locator('article a').first();
    await postLink.click();

    const articleLeft = await page.locator('article').boundingBox();
    await page.goto('/');
    const sectionLeft = await page.locator('section').first().boundingBox();

    expect(Math.abs(articleLeft.x - sectionLeft.x)).toBeLessThan(4);
  });
});

// Verificar max-width consistente entre páginas
describe('Max-width consistency', () => {
  const pages = ['/', '/posts/', '/about/'];

  for (const path of pages) {
    it(`should have max-width container on ${path}`, async ({ page }) => {
      await page.goto(path);
      const container = page.locator('.max-w-screen-xl').first();
      await expect(container).toBeVisible();
    });
  }
});

// Verificar espaçamentos na página Sobre
describe('About page spacing', () => {
  it('should use mb-24 on hero section', async ({ page }) => {
    await page.goto('/about/');
    const hero = page.locator('section').first();
    await expect(hero).toHaveClass(/mb-24/);
  });
});
```

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. Editar `single.html` — remover `px-6 md:px-12` duplicado (RF-01) e `mt-32` → `mt-24` (RF-03); adicionar `duration-300` em share buttons e nav links (RF-04)
2. Editar `index.html` — envolver conteúdo em `<div class="max-w-screen-xl mx-auto">` (RF-02)
3. Editar `posts/list.html` — envolver conteúdo em `<div class="max-w-screen-xl mx-auto">` (RF-02)
4. Editar `about/list.html` — `max-w-7xl` → `max-w-screen-xl` (RF-02); `mb-32` → `mb-24` (RF-03); `duration-300` em social links (RF-04)
5. Executar `hugo` e validar build sem erros
6. Validar visualmente no browser: mobile e desktop, navegação entre todas as páginas
7. Executar testes E2E com Playwright

### Dependências Técnicas

```
- Nenhuma dependência bloqueante entre os arquivos modificados
- single.html pode ser editado independentemente dos demais
- Os wrappers em index.html e posts/list.html são independentes entre si
- about/list.html é independente dos demais
```

## Monitoramento e Observabilidade

```bash
# Build-time: confirmar saída limpa
hugo 2>&1 | grep -E "ERROR|WARN" && echo "Warnings found" || echo "Build clean"
```

Nenhum JavaScript novo introduzido. Nenhum rastreamento client-side adicional necessário.

## Considerações Técnicas

### Decisões Principais

```
Decisão: Wrapper div em index.html e posts/list.html (RF-02)
Justificativa: Adicionar max-w-screen-xl em cada seção individualmente exigiria
tocar mais linhas e criaria risco de esquecer seções futuras. Um wrapper único
garante que todo novo conteúdo adicionado ao define "main" herde a restrição.
Alternativa rejeitada: aplicar max-w em cada seção — mais linhas modificadas,
mais propício a inconsistências futuras.

Decisão: max-w-screen-xl (em vez de max-w-7xl) como classe padrão (RF-02)
Justificativa: Os dois valores são equivalentes em px (1280px), mas max-w-screen-xl
é semânticamente mais claro para largura de tela e já estava em uso em single.html.
Uniformiza a nomenclatura sem alterar o layout visível.

Decisão: mb-24 como padrão de espaçamento primário (RF-03)
Justificativa: Já adotado em index.html e posts/list.html. Reduzir about/list.html
de mb-32 para mb-24 é o menor delta para convergência. A diferença visual (32px)
é pequena o suficiente para não causar regressão perceptível.

Decisão: Não alterar o "Thought piece" card (-mx-12) em index.html (RF-01)
Justificativa: O -mx-12 desse card é intencional — cria o efeito de fundo
full-bleed dentro do post list. Não é padding duplicado, é decoração de seção.
```

### Riscos Conhecidos

```
- O wrapper div em index.html envolve a paginação. Se a paginação tiver
  algum elemento que precise de largura total (ex: border full-width), o
  max-w pode cortá-lo. Validar visualmente após a mudança.

- single.html: remover px-6 md:px-12 da section de "Related Reading" pode
  expor diferença visual se o baseof.html for alterado no futuro. O padding
  base em baseof.html passa a ser o único ponto de controle — manter isso
  documentado no PR.
```

### Conformidade com Padrões

**Rules Aplicáveis:**
- [code-standards.md](../../.claude/rules/code-standards.md) — kebab-case para classes CSS; templates formatados com linhas em branco entre blocos lógicos; sem comentários desnecessários
- [tests.md](../../.claude/rules/tests.md) — testes E2E com Playwright; um comportamento por teste; validação de build Hugo

### Arquivos Relevantes e Dependentes

**Modificados:**
```
layouts/_default/single.html   — remove px duplicado; mt-32 → mt-24; duration-300
layouts/index.html             — wrapper max-w-screen-xl mx-auto
layouts/posts/list.html        — wrapper max-w-screen-xl mx-auto
layouts/about/list.html        — max-w-7xl → max-w-screen-xl; mb-32 → mb-24; duration-300
```

**Dependentes (leitura, sem modificação):**
```
layouts/_default/baseof.html   — fonte de verdade do padding horizontal base
```

**Não modificados (confirmado):**
```
config.toml
content/
static/
i18n/
layouts/partials/
```
