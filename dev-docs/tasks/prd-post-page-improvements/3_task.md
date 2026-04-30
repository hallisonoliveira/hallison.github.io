# Tarefa 3.0: Testes E2E com Playwright

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar testes E2E com Playwright que validem os requisitos funcionais e visuais principais da página de post, com foco especial no bug RF08 (post atual nos relacionados) e na conformidade estrutural do layout.

<requirements>
- Configurar Playwright se ainda não estiver configurado no projeto (ver `tests.md` em `.claude/rules/`)
- Cobrir RF08 (post atual não aparece nos relacionados), RF01 (título com fonte correta), RF02 (imagem com proporção correta)
- Um comportamento por teste (seguir padrão definido em `tests.md`)
- Testes devem rodar contra o servidor Hugo local (`hugo server`)
</requirements>

## Subtarefas

- [ ] 3.1 Verificar/configurar Playwright (`playwright.config.js`, `package.json`) apontando para `http://localhost:1313`
- [ ] 3.2 Criar `tests/e2e/post-page.spec.js` com os seguintes testes:
  - RF08: post atual não aparece nos links da seção de relacionados
  - RF02: imagem de destaque com `aspect-[21/9]` visível
  - RF01: `h1.font-headline` visível na página
- [ ] 3.3 Executar `npm test` (ou `npx playwright test`) e garantir que todos os testes passam

## Detalhes de Implementação

Ver seção **Testes E2E com Playwright** em `techspec.md` para o código de referência dos três testes.

## Critérios de Sucesso

- Todos os testes passam sem falhas
- Nenhum teste verifica múltiplos comportamentos ao mesmo tempo
- RF08 confirmado: nenhum link na seção de relacionados aponta para `/empatia-assertiva/`

## Testes da Tarefa

- [ ] `npx playwright test` — todos os testes passam
- [ ] RF08: `page.locator('section a[href]')` não contém `empatia-assertiva` em nenhum href
- [ ] RF02: `div.aspect-\[21\/9\]` está visível
- [ ] RF01: `h1.font-headline` está visível

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `tests/e2e/post-page.spec.js` — novo
- `playwright.config.js` — novo ou existente
- `package.json` — adicionar script `test` se ausente
- `techspec.md` — referência dos testes E2E
