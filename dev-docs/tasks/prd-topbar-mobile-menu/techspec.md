# Tech Spec — Menu Hambúrguer Mobile na Topbar

## Resumo Executivo

A implementação adiciona um botão hambúrguer (visível apenas em viewports < 768px) e um painel dropdown de navegação mobile ao partial `layouts/partials/header.html` existente. O estado do menu é gerenciado por vanilla JS em um novo arquivo `static/js/mobile-menu.js`, seguindo o padrão dos demais scripts do projeto. Nenhuma rota, conteúdo, configuração de idioma ou comportamento desktop é alterado.

## Arquitetura do Sistema

### Visão Geral dos Componentes

```
Modificados:
- layouts/partials/header.html       — adiciona botão hambúrguer e painel dropdown mobile

Novos:
- static/js/mobile-menu.js           — lógica de toggle, fechar ao clicar fora e tecla Esc

Sem alteração:
- layouts/partials/language-selector.html
- static/js/language-service.js
- static/js/analytics.js
- i18n/en.yaml / i18n/pt.yaml        — chaves nav_home, nav_posts, nav_about já existem
```

## Design de Implementação

### Estrutura de Templates

**Botão hambúrguer** — inserido dentro do `<div class="flex items-center gap-4">` ao lado do `language-selector`, visível apenas em mobile:

```hugo
{{- /* layouts/partials/header.html — mobile hamburger button */ -}}
<button
  id="mobile-menu-toggle"
  type="button"
  class="material-symbols-outlined md:hidden text-on-surface dark:text-on-surface-variant
         cursor-pointer hover:opacity-70 transition-opacity"
  aria-label="{{ i18n "mobile_menu_open" }}"
  aria-expanded="false"
  aria-controls="mobile-nav-panel"
>
  menu
</button>
```

**Painel dropdown mobile** — inserido imediatamente após o `</div>` do `flex justify-between`, dentro do `<nav>`, visível apenas quando aberto:

```hugo
{{- /* layouts/partials/header.html — mobile nav panel */ -}}
<div
  id="mobile-nav-panel"
  class="hidden md:hidden w-full border-t border-outline-variant/20 bg-surface dark:bg-surface"
  role="navigation"
  aria-label="{{ i18n "mobile_menu_label" }}"
>
  {{- $current := .RelPermalink -}}
  {{- $baseClass := "block px-8 py-3 font-headline font-bold tracking-tight
                      text-on-surface dark:text-on-surface-variant
                      hover:opacity-100 transition-opacity duration-200" -}}
  {{- $activeClass := " text-primary-container dark:text-primary-fixed
                        border-l-2 border-primary-container pl-7" -}}
  {{- $inactiveClass := " opacity-70" -}}

  <a href="{{ relLangURL "/" }}"
     class="{{ $baseClass }}{{ if eq $current (relLangURL "/") }}{{ $activeClass }}{{ else }}{{ $inactiveClass }}{{ end }}"
     {{ if eq $current (relLangURL "/") }}aria-current="page"{{ end }}>
    {{ i18n "nav_home" }}
  </a>
  <a href="{{ relLangURL "/posts/" }}"
     class="{{ $baseClass }}{{ if strings.HasPrefix $current (relLangURL "/posts/") }}{{ $activeClass }}{{ else }}{{ $inactiveClass }}{{ end }}"
     {{ if strings.HasPrefix $current (relLangURL "/posts/") }}aria-current="page"{{ end }}>
    {{ i18n "nav_posts" }}
  </a>
  <a href="{{ relLangURL "/about/" }}"
     class="{{ $baseClass }}{{ if strings.HasPrefix $current (relLangURL "/about/") }}{{ $activeClass }}{{ else }}{{ $inactiveClass }}{{ end }}"
     {{ if strings.HasPrefix $current (relLangURL "/about/") }}aria-current="page"{{ end }}>
    {{ i18n "nav_about" }}
  </a>
</div>
```

### Modelos de Dados (Frontmatter)

Sem alterações de frontmatter — a funcionalidade é puramente de navegação.

### Configuração de Dados (config.toml)

Sem novos parâmetros em `config.toml`. As chaves i18n `mobile_menu_open`, `mobile_menu_close` e `mobile_menu_label` são adicionadas em `i18n/en.yaml` e `i18n/pt.yaml`:

```yaml
# i18n/pt.yaml (adições)
mobile_menu_open: "Abrir menu de navegação"
mobile_menu_close: "Fechar menu de navegação"
mobile_menu_label: "Navegação mobile"

# i18n/en.yaml (adições)
mobile_menu_open: "Open navigation menu"
mobile_menu_close: "Close navigation menu"
mobile_menu_label: "Mobile navigation"
```

## Pontos de Integração

Sem integrações externas. O script `mobile-menu.js` deve ser incluído no layout base (provavelmente `layouts/_default/baseof.html`) com tag `<script src="{{ "js/mobile-menu.js" | relURL }}" defer></script>`, consistente com como os demais scripts são carregados.

```javascript
// static/js/mobile-menu.js — estrutura principal
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobile-menu-toggle');
  const panel  = document.getElementById('mobile-nav-panel');

  if (!toggle || !panel) return;

  function openMenu() { /* ... */ }
  function closeMenu() { /* ... */ }

  toggle.addEventListener('click', () => {
    panel.classList.contains('hidden') ? openMenu() : closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !panel.contains(e.target)) closeMenu();
  });

  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
});
```

## Abordagem de Testes

### Validação de Conteúdo

Não aplicável — sem alteração de frontmatter ou conteúdo Markdown.

### Testes de Build

```bash
# Validar que build completa sem erros após mudanças
hugo
if [ $? -ne 0 ]; then echo "Hugo build failed"; exit 1; fi

# Verificar que mobile-menu.js está presente no output
test -f public/js/mobile-menu.js
```

### Testes E2E com Playwright

```javascript
describe('Mobile Navigation Menu', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  it('should show hamburger button on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#mobile-menu-toggle')).toBeVisible();
  });

  it('should open panel on hamburger click', async ({ page }) => {
    await page.goto('/');
    await page.locator('#mobile-menu-toggle').click();
    await expect(page.locator('#mobile-nav-panel')).toBeVisible();
  });

  it('should close panel on link click', async ({ page }) => {
    await page.goto('/');
    await page.locator('#mobile-menu-toggle').click();
    await page.locator('#mobile-nav-panel a').first().click();
    await expect(page.locator('#mobile-nav-panel')).toBeHidden();
  });

  it('should close panel on Esc key', async ({ page }) => {
    await page.goto('/');
    await page.locator('#mobile-menu-toggle').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-nav-panel')).toBeHidden();
  });

  it('should not show hamburger on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await expect(page.locator('#mobile-menu-toggle')).toBeHidden();
  });
});
```

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. Adicionar chaves i18n em `i18n/pt.yaml` e `i18n/en.yaml`
2. Modificar `layouts/partials/header.html` — botão hambúrguer + painel dropdown
3. Criar `static/js/mobile-menu.js` com lógica de toggle/fechar
4. Incluir `mobile-menu.js` no layout base (`layouts/_default/baseof.html`)
5. Validar build com `hugo`
6. Testar manualmente no browser em viewport mobile
7. Executar testes E2E com Playwright

### Dependências Técnicas

```
- Material Symbols Outlined já carregado (usado pelo language-selector)
- Tailwind CSS via CDN já presente (classes md:hidden disponíveis)
- Chaves i18n devem ser adicionadas antes de rodar hugo build
- baseof.html deve ser identificado para inclusão do script
```

## Monitoramento e Observabilidade

```bash
# Build-time: validar sem warnings de i18n
hugo --logLevel info 2>&1 | grep -i "missing\|error"
```

```javascript
// mobile-menu.js — log de inicialização (desenvolvimento)
const isDevelopment = window.location.hostname === 'localhost';
if (isDevelopment) {
  console.log('Mobile menu initialized', { timestamp: new Date().toISOString() });
}

// Logar erros de inicialização sempre
window.addEventListener('error', (event) => {
  console.error('Mobile menu error', {
    message: event.message,
    filename: event.filename,
    timestamp: new Date().toISOString()
  });
});
```

## Considerações Técnicas

### Decisões Principais

```
Decisão: Painel dropdown abaixo da topbar (não drawer lateral)
Justificativa: Mais simples de implementar, sem posicionamento absoluto complexo;
              topbar já é fixed, o painel fica como extensão natural da nav.
Trade-off: Ocupa espaço vertical, mas é o padrão esperado em blogs.

Decisão: JS em arquivo separado (static/js/mobile-menu.js)
Justificativa: Consistência com analytics.js e language-service.js do projeto.
Alternativa rejeitada: Inline no header.html — dificulta manutenção e viola padrão do projeto.

Decisão: Ícone Material Symbols 'menu'
Justificativa: Fonte já carregada (language-selector usa 'language');
              zero dependência nova, visual consistente.

Decisão: Toggle via classe 'hidden' do Tailwind
Justificativa: Sem necessidade de CSS customizado; padrão já usado no projeto.
```

### Riscos Conhecidos

```
- baseof.html pode não existir ou o script pode estar sendo incluído de forma diferente
  Mitigação: verificar como analytics.js e language-service.js são carregados antes de implementar

- aria-label do botão muda entre aberto/fechado (mobile_menu_open vs mobile_menu_close)
  Mitigação: JS deve atualizar aria-label e aria-expanded em cada toggle

- Tailwind purge pode remover classes adicionadas dinamicamente via JS
  Mitigação: todas as classes do painel são estáticas no HTML; JS só altera 'hidden'
```

### Conformidade com Padrões

- [code-standards.md](../../.claude/rules/code-standards.md) — nomes em inglês, camelCase para JS, kebab-case para arquivos e classes CSS, partials com nomes descritivos
- [logging.md](../../.claude/rules/logging.md) — logs estruturados no console, separação dev/prod, sem dados sensíveis
- [tests.md](../../.claude/rules/tests.md) — testes E2E com Playwright, um comportamento por teste, nomenclatura descritiva

### Arquivos Relevantes e Dependentes

**Modificados:**
```
layouts/partials/header.html          — botão hambúrguer + painel dropdown
i18n/pt.yaml                          — 3 novas chaves de acessibilidade
i18n/en.yaml                          — 3 novas chaves de acessibilidade
layouts/_default/baseof.html          — inclusão do script mobile-menu.js
```

**Novos:**
```
static/js/mobile-menu.js              — lógica de toggle do menu mobile
```

**Dependentes (sem alteração):**
```
layouts/partials/language-selector.html  — permanece inalterado
static/js/language-service.js           — permanece inalterado
```
