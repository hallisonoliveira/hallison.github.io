# Review: Task 3.0 - Layout e Contatos

**Revisor**: AI Code Reviewer
**Data**: 2026-04-29
**Arquivo da tarefa**: 3_task.md
**Status**: APPROVED WITH OBSERVATIONS

## Resumo

A tarefa implementou corretamente os dois requisitos centrais: (1) ajuste das colunas do grid hero de `md:col-span-5/7` para `md:col-span-3/9` e (2) adição do bloco de contatos inline em `layouts/about/list.html` após `{{ .Content }}`, iterando sobre `socialLinks` com exclusão do "Newsletter". O template permanece com 61 linhas (abaixo do limite de 100), o build do Hugo conclui sem ERRORs e todos os 8 testes E2E passam. A implementação segue fielmente a techspec (RF-04 e RF-05). Há um problema de padrao de importação inconsistente no arquivo de testes e dois problemas menores de violação dos padrões de testes (multiplos comportamentos por teste e ausência de teste para `rel="noopener noreferrer"`).

## Arquivos Revisados

| Arquivo | Status | Problemas |
|---------|--------|-----------|
| `layouts/about/list.html` | OK | 0 |
| `tests/e2e/about.spec.js` | Problemas | 3 |

## Problemas Encontrados

### Criticos

Nenhum problema critico encontrado.

### Importantes

#### [IMPORTANTE-01] `about.spec.js` usa `require()` enquanto o padrão do projeto é `import` — inconsistência de módulo

**Arquivo**: `tests/e2e/about.spec.js`, linha 1

**Descrição**: O arquivo usa CommonJS (`const { test, expect } = require('@playwright/test')`), enquanto o arquivo `tests/e2e/i18n.spec.js` (arquivo de referência do projeto) usa ES Modules (`import { test, expect } from '@playwright/test'`). Embora `language-service.spec.js` também use `require`, o padrão documentado na `tests.md` e seguido pelo arquivo mais completo (`i18n.spec.js`) é ES Modules. O `package.json` não declara `"type": "module"`, o que permite ambos funcionarem, mas gera inconsistência que pode causar confusão futura e erros ao migrar para ESM puro.

**Sugestão de correção**:
```javascript
// Substituir linha 1:
import { test, expect } from '@playwright/test';
```

---

#### [IMPORTANTE-02] Teste "should display LinkedIn and GitHub links in English version" verifica dois comportamentos em um único teste

**Arquivo**: `tests/e2e/about.spec.js`, linhas 34–40

**Descrição**: O teste verifica a visibilidade de dois links distintos (LinkedIn e GitHub) dentro do mesmo caso de teste. O padrão do projeto (`tests.md`) exige "um comportamento por teste". Se o link LinkedIn existir mas o GitHub não, o teste falha sem isolar claramente qual comportamento está quebrado.

**Sugestão de correção**:
```javascript
test('should display LinkedIn link in English version', async ({ page }) => {
  await page.goto('/en/about/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('a[href*="linkedin.com"]')).toBeVisible();
});

test('should display GitHub link in English version', async ({ page }) => {
  await page.goto('/en/about/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('a[href*="github.com"]')).toBeVisible();
});
```

---

#### [IMPORTANTE-03] Teste "should open links in new tab" verifica dois links em um único teste

**Arquivo**: `tests/e2e/about.spec.js`, linhas 58–64

**Descrição**: O mesmo problema do IMPORTANTE-02 se repete: o teste valida `target="_blank"` tanto para LinkedIn quanto para GitHub dentro de um unico caso de teste. Pelo padrão do projeto, cada comportamento deve ser coberto por um teste independente.

**Sugestão de correção**:
```javascript
test('should open LinkedIn link in new tab', async ({ page }) => {
  await page.goto('/about/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('a[href*="linkedin.com"]')).toHaveAttribute('target', '_blank');
});

test('should open GitHub link in new tab', async ({ page }) => {
  await page.goto('/about/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('a[href*="github.com"]')).toHaveAttribute('target', '_blank');
});
```

### Menores

#### [MENOR-01] Ausência de teste para o atributo `rel="noopener noreferrer"`

**Arquivo**: `tests/e2e/about.spec.js`

**Descrição**: O requisito da tarefa (item "Os links devem abrir em nova aba (`target="_blank"`) com `rel="noopener noreferrer"`") cobre dois atributos. Os testes validam `target="_blank"` mas não validam `rel="noopener noreferrer"`. Esta omissão deixa um requisito de segurança sem cobertura de teste. O atributo `rel` é importante pois `target="_blank"` sem `noopener` expõe a aba de origem a ataques via `window.opener`.

**Sugestão de correção**:
```javascript
test('should have rel noopener noreferrer on LinkedIn link', async ({ page }) => {
  await page.goto('/about/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('a[href*="linkedin.com"]')).toHaveAttribute('rel', 'noopener noreferrer');
});

test('should have rel noopener noreferrer on GitHub link', async ({ page }) => {
  await page.goto('/about/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('a[href*="github.com"]')).toHaveAttribute('rel', 'noopener noreferrer');
});
```

---

#### [MENOR-02] Cobertura da versão EN para `target="_blank"` ausente

**Arquivo**: `tests/e2e/about.spec.js`

**Descrição**: O teste de `target="_blank"` só cobre a versão PT (`/about/`). Como a tarefa exige que os links funcionem nas duas versões (PT e EN), a versão inglesa (`/en/about/`) deveria ter o mesmo conjunto de assertions de atributos.

**Sugestão**: Adicionar um test.describe "About page — Contact links — EN" com os mesmos testes de `target` e `rel` apontando para `/en/about/`.

---

#### [MENOR-03] Ausência de teste para os ícones Material Symbols

**Arquivo**: `tests/e2e/about.spec.js`

**Descrição**: Os requisitos da tarefa incluem "Os ícones devem usar a classe `material-symbols-outlined`". Não há nenhum teste que verifique a presença do elemento `<span class="material-symbols-outlined">` dentro dos links de contato. É uma cobertura funcional que pode detectar regressão se a classe for removida ou o span omitido.

**Sugestão**:
```javascript
test('should render icons with material-symbols-outlined class', async ({ page }) => {
  await page.goto('/about/');
  await page.waitForLoadState('networkidle');
  const icon = page.locator('a[href*="linkedin.com"] span.material-symbols-outlined');
  await expect(icon).toBeVisible();
});
```

## Destaques Positivos

- O template `list.html` implementa RF-04 e RF-05 com fidelidade exata ao HTML especificado na techspec, sem desvios.
- A soma das colunas do grid (3 + 9 = 12) está correta, mantendo a integridade do layout de 12 colunas.
- O filtro `{{ if ne .name "Newsletter" }}` é uma solução elegante e declarativa que dispensa alterações na estrutura do `config.toml`.
- Os atributos `target="_blank"` e `rel="noopener noreferrer"` foram implementados juntos, conforme boas práticas de segurança web.
- O arquivo `list.html` permanece com 61 linhas, bem abaixo do limite de 100 estabelecido pelo padrão do projeto e exigido explicitamente pela tarefa.
- Os testes E2E cobrem tanto a versão PT (`/about/`) quanto a versão EN (`/en/about/`), cumprindo o requisito bilíngue da tarefa.
- Todos os 8 testes passam sem falhas e o build do Hugo conclui sem ERRORs.
- Os nomes dos testes seguem o padrão `should ...`, descritivos e claros, conforme `tests.md`.
- Os grupos de testes usam `test.describe` de forma coerente, separando por contexto (PT hero, EN hero, links de contato).
- O uso de `waitForLoadState('networkidle')` nos testes é consistente com o padrão já estabelecido em `language-service.spec.js`.

## Conformidade com Padrões

| Padrão | Status |
|--------|--------|
| Padrões de Código (code-standards.md) | OK |
| Padrões Hugo (camelCase/kebab-case/template size) | OK |
| REST/HTTP | Não aplicável |
| Logging | Não aplicável |
| Testes (tests.md) | Com ressalvas |

## Recomendações

1. **(Importante)** Padronizar o `require()` de `about.spec.js` para `import` de ES Modules, alinhando ao padrão de `i18n.spec.js`.
2. **(Importante)** Separar o teste "should display LinkedIn and GitHub links in English version" em dois testes independentes (um por link).
3. **(Importante)** Separar o teste "should open links in new tab" em dois testes independentes (um por link).
4. **(Menor)** Adicionar testes para o atributo `rel="noopener noreferrer"` em ambos os links, tanto PT quanto EN.
5. **(Menor)** Adicionar testes para cobertura de `target="_blank"` na versão EN (`/en/about/`).
6. **(Menor)** Considerar adicionar teste que valide a presença do `span.material-symbols-outlined` dentro dos links de contato, garantindo cobertura do requisito de ícones.

## Veredito

A implementação do template `layouts/about/list.html` está correta e production-ready. Os problemas encontrados estão concentrados exclusivamente na suite de testes E2E: inconsistência de estilo de importação (CommonJS vs ESM) e violações do princípio "um comportamento por teste" estabelecido em `tests.md`. Esses problemas não impedem o funcionamento da feature, mas reduzem a qualidade e manutenibilidade da suite de testes. O código pode ser integrado com as correções nos testes aplicadas em follow-up.
