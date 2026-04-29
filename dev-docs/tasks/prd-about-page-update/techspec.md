# Tech Spec — Atualização da Página "Sobre"

## Resumo Executivo

As mudanças são puramente de conteúdo e layout, sem nova lógica de negócio. Os cinco requisitos funcionais atingem quatro arquivos existentes (`config.toml`, `layouts/about/list.html`, `content/about/_index.pt.md`, `content/about/_index.en.md`) mais a adição de um asset estático (`static/images/profile-picture.jpg`). Nenhuma dependência nova é introduzida. A estratégia é editar cirurgicamente cada arquivo, respeitando o sistema i18n já em uso e o padrão de `socialLinks` existente no `config.toml`.

## Arquitetura do Sistema

### Visão Geral dos Componentes

```
Modificados:
- config.toml                          — parâmetros aboutHero, aboutLocation, socialLinks
- layouts/about/list.html              — col-span da imagem + seção de contatos inline
- content/about/_index.pt.md           — substituição do corpo do conteúdo (frontmatter preservado)
- content/about/_index.en.md           — substituição do corpo do conteúdo (frontmatter preservado)

Adicionado:
- static/images/profile-picture.jpg    — imagem de perfil local (movida de dev-docs/prompts/)
```

Não são criados novos layouts, partials ou shortcodes. A seção de contatos é adicionada inline em `list.html` por ser específica da página "Sobre" e o arquivo permanece abaixo de 100 linhas.

## Design de Implementação

### Estrutura de Templates

**RF-04 — Redução da imagem (`md:col-span-5` → `md:col-span-3`):**

```hugo
{{- /* layouts/about/list.html — Hero Section */ -}}
<div class="md:col-span-9">
  {{- /* ... título e localização inalterados ... */ -}}
</div>
<div class="md:col-span-3 relative">
  <div class="aspect-[4/5] bg-surface-variant overflow-hidden rounded-lg grayscale hover:grayscale-0 transition-all duration-700">
    {{ if .Params.image }}
      <img alt="{{ .Title }}" class="w-full h-full object-cover" src="{{ .Params.image }}">
    {{ else }}
      <div class="w-full h-full bg-gradient-to-br from-surface-variant to-surface-container"></div>
    {{ end }}
  </div>
</div>
```

O `md:col-span-7` do lado esquerdo sobe para `md:col-span-9` para manter a soma em 12.

---

**RF-05 — Seção de contatos inline (após `{{ .Content }}`):**

```hugo
{{- /* layouts/about/list.html — Philosophy Section, após .Content */ -}}
<div class="flex flex-wrap gap-6 mt-8">
  {{ range .Site.Params.socialLinks }}
    {{ if ne .name "Newsletter" }}
      <a class="flex items-center gap-2 font-label text-sm uppercase tracking-widest text-primary-container hover:opacity-80 transition-opacity"
         href="{{ .url }}"
         target="_blank"
         rel="noopener noreferrer">
        <span class="material-symbols-outlined text-base">{{ .icon }}</span>
        {{ .name }}
      </a>
    {{ end }}
  {{ end }}
</div>
```

O filtro `ne .name "Newsletter"` exclui o link de e-mail sem exigir mudança na estrutura de `socialLinks`.

---

### Modelos de Dados (Frontmatter)

Os arquivos `_index.pt.md` e `_index.en.md` terão o frontmatter preservado integralmente, com apenas `image` atualizado para o caminho local:

```yaml
---
language: "pt"        # ou "en" — inalterado
title: "Sobre"        # ou "About" — inalterado
draft: false
image: "/images/profile-picture.jpg"   # atualizado de URL externa para local
ctaImage: "..."       # inalterado
---
```

O corpo de cada arquivo é substituído pelo texto biográfico conforme especificado no PRD (RF-03).

---

### Configuração de Dados (config.toml)

```toml
# RF-01 — Títulos hero
[params.pt]
  aboutHero = 'Hallison Oliveira'

[params.en]
  aboutHero = 'Hallison Oliveira'

# RF-02 — Localização
[params.pt]
  aboutLocation = 'Est. 2022 — Curitiba, Brasil'

[params.en]
  aboutLocation = 'Est. 2022 — Curitiba, Brazil'

# RF-05 — URLs corretas dos social links
[[params.socialLinks]]
  name = "Github"
  url = "https://github.com/hallisonoliveira"
  icon = "terminal"

[[params.socialLinks]]
  name = "LinkedIn"
  url = "https://www.linkedin.com/in/hallisonoliveira/"
  icon = "share"

[[params.socialLinks]]
  name = "Newsletter"
  url = "mailto:hallisoncwb@gmail.com"
  icon = "mail"
```

## Pontos de Integração

Nenhuma integração externa nova. A imagem de perfil migra de URL externa (Google) para asset estático local em `static/images/profile-picture.jpg`, eliminando dependência de CDN externo para esse recurso. O arquivo de origem está em `dev-docs/prompts/profile-picture.jpg` e deve ser copiado para `static/images/`.

## Abordagem de Testes

### Validação de Conteúdo

```javascript
// Verificar que ambos os arquivos _index.md têm frontmatter válido
describe('About page frontmatter', () => {
  it('should have required fields in PT', () => {
    const fm = parseYAML('content/about/_index.pt.md');
    expect(fm.title).toBeDefined();
    expect(fm.image).toBe('/images/profile-picture.jpg');
  });

  it('should have required fields in EN', () => {
    const fm = parseYAML('content/about/_index.en.md');
    expect(fm.title).toBeDefined();
    expect(fm.image).toBe('/images/profile-picture.jpg');
  });
});
```

### Testes de Build

```bash
# Validar build sem erros após todas as alterações
hugo && echo "Build OK" || exit 1

# Confirmar que a imagem de perfil está presente no output
test -f public/images/profile-picture.jpg
```

### Testes E2E com Playwright

```javascript
describe('About page — PT', () => {
  it('should display correct hero name', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('h1')).toContainText('Hallison Oliveira');
  });

  it('should display correct location', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('p.font-label')).toContainText('Est. 2022 — Curitiba');
  });

  it('should display LinkedIn and GitHub links', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('a[href*="linkedin.com"]')).toBeVisible();
    await expect(page.locator('a[href*="github.com"]')).toBeVisible();
  });

  it('should open contact links in new tab', async ({ page }) => {
    await page.goto('/about/');
    const linkedIn = page.locator('a[href*="linkedin.com"]');
    await expect(linkedIn).toHaveAttribute('target', '_blank');
  });
});

describe('About page — EN', () => {
  it('should display hero and location in English', async ({ page }) => {
    await page.goto('/en/about/');
    await expect(page.locator('h1')).toContainText('Hallison Oliveira');
    await expect(page.locator('p.font-label')).toContainText('Est. 2022 — Curitiba, Brazil');
  });
});
```

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. Copiar `dev-docs/prompts/profile-picture.jpg` → `static/images/profile-picture.jpg`
2. Atualizar `config.toml` — `aboutHero`, `aboutLocation` (PT + EN) e URLs de `socialLinks`
3. Atualizar frontmatter de `_index.pt.md` e `_index.en.md` (campo `image`)
4. Substituir corpo de `_index.pt.md` pelo texto biográfico PT
5. Substituir corpo de `_index.en.md` pelo texto biográfico EN
6. Ajustar `layouts/about/list.html` — `md:col-span-5` → `md:col-span-3` (e col-span do lado esquerdo de 7 → 9)
7. Adicionar seção de contatos inline em `layouts/about/list.html`
8. Executar `hugo` — validar build sem erros
9. Executar testes E2E com Playwright

### Dependências Técnicas

```
- config.toml deve ser atualizado antes de testar list.html (template lê .Site.Params)
- static/images/profile-picture.jpg deve existir antes do build para não gerar 404
- Alterações em list.html dependem de socialLinks com URLs corretas no config.toml
```

## Monitoramento e Observabilidade

```bash
# Build-time: confirmar saída limpa
hugo 2>&1 | grep -E "ERROR|WARN" && echo "Warnings found" || echo "Build clean"
```

Não há JavaScript novo introduzido por esta feature. Nenhum rastreamento client-side adicional é necessário.

## Considerações Técnicas

### Decisões Principais

```
Decisão: col-span-3 para a imagem (e col-span-9 para o texto)
Justificativa: Reduz visualmente a imagem ao redor de metade da ocupação atual,
mantendo o grid de 12 colunas íntegro. Alternativa max-w-[50%] geraria espaço
vazio na coluna e quebraria o elemento decorativo posicionado absolutamente.

Decisão: Filtro inline `ne .name "Newsletter"` em vez de novo parâmetro
Justificativa: Evita adicionar campo extra ao config.toml; a exclusão é
determinística pelo nome, que não deve mudar.

Decisão: Conteúdo de contatos inline em list.html (não partial)
Justificativa: list.html permanece abaixo de 80 linhas; o bloco de contatos
é específico desta página e sem reutilização prevista.

Decisão: Imagem migrada para static/images/ (local)
Justificativa: Elimina dependência de CDN externo e evita eventual expiração
da URL do Google. Alinhado com a escolha do usuário.
```

### Riscos Conhecidos

```
- O elemento decorativo ".absolute -bottom-6 -left-6" em list.html usa
  "hidden md:flex" e está aninhado dentro do col-span da imagem. Com col-span-3,
  o elemento decorativo pode ficar visualmente desbalanceado — validar no browser.

- O campo `aboutHero` PT atual usa safeHTML com tags <span>. O novo valor
  "Hallison Oliveira" é texto plano; remover a chamada safeHTML não é necessário,
  mas não quebra nada se mantida.
```

### Conformidade com Padrões

**Rules Aplicáveis:**
- [code-standards.md](../../.claude/rules/code-standards.md) — kebab-case para classes CSS e parâmetros TOML; camelCase para variáveis de template Hugo; templates formatados com linhas em branco entre blocos lógicos
- [tests.md](../../.claude/rules/tests.md) — testes E2E com Playwright para páginas principais; um comportamento por teste; validação de frontmatter

### Arquivos Relevantes e Dependentes

**Adicionados:**
```
static/images/profile-picture.jpg
```

**Modificados:**
```
config.toml                          — aboutHero, aboutLocation (PT+EN), socialLinks URLs
layouts/about/list.html              — col-span da imagem + seção de contatos
content/about/_index.pt.md           — frontmatter.image + corpo completo
content/about/_index.en.md           — frontmatter.image + corpo completo
```

**Dependentes (leitura, sem modificação):**
```
layouts/_default/baseof.html         — carrega Material Symbols Outlined (ícones já disponíveis)
```
