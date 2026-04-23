# Testes

## Tipos de Testes em Hugo

Em um projeto Hugo estático, existem diferentes tipos de testes:

### Testes de Conteúdo

Validar a estrutura e validade do conteúdo (frontmatter, Markdown).

### Testes de Build

Verificar se o Hugo constrói corretamente sem erros.

```bash
# ✅ Construir e validar
hugo

# ✅ Com modo draft
hugo -D
```

### Testes de Integração/E2E

Testar o site gerado com ferramentas como Playwright ou Cypress.

```bash
# Instalar dependências
npm install -D @playwright/test

# Rodar testes
npm test
```

## Validação de Frontmatter

Validar que os posts têm o frontmatter correto.

**Exemplo com Script Node.js:**
```javascript
// scripts/validate-frontmatter.js
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const requiredFields = ['title', 'date', 'description'];
const contentDir = './content';

function validateFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (!frontmatterMatch) {
    throw new Error(`No frontmatter found in ${filePath}`);
  }

  const frontmatter = yaml.load(frontmatterMatch[1]);
  
  for (const field of requiredFields) {
    if (!frontmatter[field]) {
      throw new Error(`Missing required field "${field}" in ${filePath}`);
    }
  }
  
  return frontmatter;
}

// Validar todos os arquivos
fs.readdirSync(contentDir).forEach(file => {
  if (file.endsWith('.md')) {
    try {
      validateFrontmatter(path.join(contentDir, file));
      console.log(`✅ ${file} is valid`);
    } catch (error) {
      console.error(`❌ ${file}: ${error.message}`);
      process.exit(1);
    }
  }
});
```

## Testes JavaScript Client-side

Testar JavaScript vanilla utilizado no site com ferramentas como Vitest.

**Exemplo - Testando uma função utilitária:**
```javascript
// static/js/utils.js
export function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

// static/js/utils.test.js
import { describe, it, expect } from 'vitest';
import { formatDate } from './utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = '2024-04-16';
    const result = formatDate(date);
    expect(result).toBe('16/4/2024');
  });
});
```

**Exemplo - Testando um script DOM:**
```javascript
// static/js/theme-toggle.js
export function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
    });
  }
}

// static/js/theme-toggle.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { initThemeToggle } from './theme-toggle';

describe('initThemeToggle', () => {
  beforeEach(() => {
    document.body.innerHTML = '<button id="theme-toggle">Toggle</button>';
  });

  it('should toggle dark class on button click', () => {
    initThemeToggle();
    const toggle = document.getElementById('theme-toggle');
    
    toggle.click();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    
    toggle.click();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
```

## Testes E2E com Playwright

Testar o site gerado verificando elementos, navegação e comportamentos.

**Exemplo - Testando página de artigo:**
```javascript
// tests/article.spec.js
import { test, expect } from '@playwright/test';

test('should display article with correct structure', async ({ page }) => {
  // Arrange: Navegar até a página
  await page.goto('/articles/how-to-hugo/');
  
  // Assert: Verificar que os elementos existem
  await expect(page.locator('h1')).toContainText('How to use Hugo');
  await expect(page.locator('article')).toBeDefined();
  await expect(page.locator('[data-test="article-date"]')).toBeDefined();
});

test('should navigate between articles', async ({ page }) => {
  await page.goto('/articles/');
  
  // Clicar no primeiro artigo
  const firstArticleLink = page.locator('article a').first();
  await firstArticleLink.click();
  
  // Verificar que navegou
  expect(page.url()).toContain('/articles/');
  await expect(page.locator('article')).toBeDefined();
});
```

**Exemplo - Testando funcionalidade JavaScript:**
```javascript
// tests/theme-toggle.spec.js
import { test, expect } from '@playwright/test';

test('should toggle dark mode', async ({ page }) => {
  await page.goto('/');
  
  // Verificar estado inicial
  const html = page.locator('html');
  let isDark = await html.evaluate(el => el.classList.contains('dark'));
  expect(isDark).toBe(false);
  
  // Clicar no toggle
  await page.locator('#theme-toggle').click();
  
  // Verificar que togglou
  isDark = await html.evaluate(el => el.classList.contains('dark'));
  expect(isDark).toBe(true);
});
```

## Estrutura de Testes

Organize seus testes de forma clara e estruturada.

```
tests/
├── e2e/
│   ├── article.spec.js
│   ├── navigation.spec.js
│   └── theme.spec.js
├── unit/
│   ├── utils.test.js
│   └── theme-toggle.test.js
└── playwright.config.js
```

## Configuração do Playwright

**playwright.config.js:**
```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  webServer: {
    command: 'hugo server',
    url: 'http://localhost:1313',
    reuseExistingServer: !process.env.CI,
  },
  
  use: {
    baseURL: 'http://localhost:1313',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
```

**package.json:**
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

## Foco e Clareza

Teste um comportamento por teste. Evite testes muito grandes.

**Exemplo:**
```javascript
// ❌ Evite - Múltiplos comportamentos
describe('Article Page', () => {
  it('should load and navigate', async ({ page }) => {
    await page.goto('/articles/');
    await expect(page.locator('h1')).toContainText('Articles');
    
    await page.locator('article a').first().click();
    await expect(page.locator('article')).toBeDefined();
    
    await page.goBack();
    await expect(page).toHaveURL('/articles/');
  });
});

// ✅ Prefira - Um comportamento por teste
describe('Article Page', () => {
  it('should display article list', async ({ page }) => {
    await page.goto('/articles/');
    await expect(page.locator('h1')).toContainText('Articles');
  });

  it('should navigate to article details', async ({ page }) => {
    await page.goto('/articles/');
    await page.locator('article a').first().click();
    await expect(page.locator('article')).toBeDefined();
  });
});
```

## Validação de Conteúdo

Verificar se o conteúdo gerado está correto.

**Exemplo - Validar URLs das páginas:**
```javascript
// tests/content-validation.js
import fs from 'fs';
import path from 'path';

describe('Generated Content', () => {
  it('should have valid HTML structure', () => {
    const publicDir = './public';
    const files = fs.readdirSync(publicDir, { recursive: true });
    
    const htmlFiles = files.filter(f => f.endsWith('.html'));
    expect(htmlFiles.length).toBeGreaterThan(0);
  });

  it('should have sitemap', () => {
    const sitemapPath = './public/sitemap.xml';
    expect(fs.existsSync(sitemapPath)).toBe(true);
  });
});
```

## Nomenclatura de Testes

Use nomes claros e descritivos.

**Exemplo:**
```javascript
// ❌ Evite
it('should work', () => { ... });
it('test page', () => { ... });

// ✅ Prefira
it('should display article title in h1', () => { ... });
it('should highlight current language in menu', () => { ... });
it('should load images without errors', () => { ... });
```
