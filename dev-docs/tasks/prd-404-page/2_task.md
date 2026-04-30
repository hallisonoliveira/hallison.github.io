# Tarefa 2.0: Testes E2E com Playwright

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar a suite de testes E2E com Playwright para validar o comportamento da página 404 em ambos os idiomas (PT e EN), cobrindo visibilidade dos elementos, ausência do código numérico e hrefs corretos dos botões de navegação.

<requirements>
- O arquivo `tests/e2e/not-found.spec.js` deve existir com os 6 testes especificados
- Cada teste deve cobrir um único comportamento (um assert por cenário)
- Os testes PT devem usar URLs sob `/` (ex: `/url-inexistente/`)
- Os testes EN devem usar URLs sob `/en/` (ex: `/en/url-that-does-not-exist/`)
- Todos os 6 testes devem passar com `hugo server` rodando
</requirements>

## Subtarefas

- [ ] 2.1 Verificar que `@playwright/test` está instalado (`package.json` / `node_modules`)
- [ ] 2.2 Verificar que `playwright.config.js` aponta para `http://localhost:1313` com `hugo server` como `webServer`
- [ ] 2.3 Criar `tests/e2e/not-found.spec.js` com os 6 testes definidos na `techspec.md`
- [ ] 2.4 Executar `hugo server` em background e rodar `npx playwright test tests/e2e/not-found.spec.js`
- [ ] 2.5 Confirmar que todos os 6 testes passam sem falhas

## Detalhes de Implementação

Consultar a seção **"Testes E2E com Playwright"** da `techspec.md` para o código completo dos 6 testes e os seletores exatos a utilizar.

Os 6 cenários a cobrir são:

| # | Idioma | Comportamento |
|---|--------|---------------|
| 1 | PT | `h1` visível e sem o texto "404" |
| 2 | PT | botão home com `href="/"` visível |
| 3 | PT | botão posts com `href="/posts/"` visível |
| 4 | EN | `h1` visível e sem o texto "404" |
| 5 | EN | botão home com `href="/en/"` visível |
| 6 | EN | botão posts com `href="/en/posts/"` visível |

## Critérios de Sucesso

- `npx playwright test tests/e2e/not-found.spec.js` retorna 6/6 testes passando
- Nenhum teste contém mais de um `expect` (um comportamento por teste)
- Os nomes dos testes descrevem claramente o que está sendo validado

## Testes da Tarefa

- [ ] `npx playwright test tests/e2e/not-found.spec.js --reporter=list` — todos os 6 testes devem aparecer como `passed`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `tests/e2e/not-found.spec.js` — suite a ser criada
- `playwright.config.js` — configuração do Playwright (verificar `webServer` e `baseURL`)
- `package.json` — verificar presença de `@playwright/test`
