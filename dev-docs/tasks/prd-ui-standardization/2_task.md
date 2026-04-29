# Tarefa 2.0: Validação de build e testes E2E

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Validar que as alterações da Tarefa 1.0 estão corretas por meio de build limpo e testes E2E com Playwright. Os testes devem cobrir: alinhamento horizontal consistente entre páginas, presença de `max-w-screen-xl` em todas as rotas principais e espaçamento `mb-24` na página Sobre.

<requirements>
- Build Hugo deve completar sem erros nem warnings
- Testes E2E devem cobrir as três rotas principais: `/`, `/posts/`, `/about/`
- Testes E2E devem cobrir uma página de post individual
- Um comportamento por teste (não agrupar múltiplos asserts em um único `it`)
- Playwright já configurado no projeto (`playwright.config.js` e `package.json`)
</requirements>

## Subtarefas

- [ ] 2.1 Executar `hugo` e confirmar saída limpa (sem ERROR nem WARN)
- [ ] 2.2 Implementar teste: alinhamento horizontal do article em post deve bater com section da home (diferença < 4px)
- [ ] 2.3 Implementar teste: container `max-w-screen-xl` visível em `/`, `/posts/` e `/about/`
- [ ] 2.4 Implementar teste: seção Hero de `/about/` possui classe `mb-24`
- [ ] 2.5 Executar `npm test` e garantir que todos os testes passam

## Detalhes de Implementação

Ver seção **Testes E2E com Playwright** em `techspec.md` — contém os três blocos `describe` com implementação de referência para cada teste.

Os testes devem ser criados em `tests/e2e/ui-standardization.spec.js` (ou pasta equivalente já existente no projeto).

## Critérios de Sucesso

- `hugo 2>&1 | grep -E "ERROR|WARN"` retorna vazio
- Todos os testes Playwright passam em Chromium e Firefox
- Nenhum teste existente regride

## Testes da Tarefa

- [ ] `hugo && echo "Build OK"` — build sem erros
- [ ] `npx playwright test tests/e2e/ui-standardization.spec.js` — todos os casos passam

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `tests/e2e/ui-standardization.spec.js` (novo)
- `playwright.config.js`
- `package.json`
