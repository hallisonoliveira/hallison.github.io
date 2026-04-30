# Review: Tarefa 1.0 - Implementação da Página 404

**Reviewer**: AI Code Reviewer
**Date**: 2026-04-30
**Task file**: 1_task.md
**Status**: APPROVED

## Summary

A tarefa implementou a página 404 customizada com suporte a internacionalização em PT e EN. Foram adicionadas 4 chaves de tradução em cada arquivo i18n, realizada uma modificação cirúrgica em `baseof.html` para suporte ao bloco `{{ block "title" }}`, criado o template `layouts/404.html`, e adicionados 6 testes E2E com Playwright. Todos os critérios de sucesso definidos na tarefa foram atendidos: o build conclui sem ERRORs, `public/404.html` e `public/en/404.html` são gerados com conteúdo traduzido, e o código numérico "404" não aparece no conteúdo visível. A qualidade geral da implementação é alta.

## Files Reviewed

| File | Status | Issues |
|------|--------|--------|
| `layouts/404.html` | OK | 0 |
| `i18n/pt.yaml` | OK | 0 |
| `i18n/en.yaml` | OK | 0 |
| `layouts/_default/baseof.html` | OK | 0 |
| `tests/e2e/not-found.spec.js` | OK | 0 |

## Issues Found

### Critical Issues

No critical issues found.

### Major Issues

No major issues found.

### Minor Issues

**1. `tests/e2e/not-found.spec.js` — ausência de assertion de texto traduzido no `h1` (PT e EN)**

Os testes verificam que o `h1` existe e não contém "404", mas não confirmam que o texto traduzido correto está presente. O teste seria mais robusto se incluísse uma assertion positiva.

Arquivo: `tests/e2e/not-found.spec.js`, linhas 7 e 25.

Sugestão:
```javascript
// PT
await expect(page.locator('h1')).toContainText('Página não encontrada');

// EN
await expect(page.locator('h1')).toContainText('Page not found');
```

**2. `tests/e2e/not-found.spec.js` — EN tests não verificam o ícone `search_off`**

O teste PT (linha 9) verifica `span.material-symbols-outlined`, mas os testes EN não fazem essa verificação. Para simetria de cobertura:

Arquivo: `tests/e2e/not-found.spec.js`, teste `should display EN 404 with translated content`.

Sugestão:
```javascript
await expect(page.locator('span.material-symbols-outlined')).toBeVisible();
```

**3. `tests/e2e/not-found.spec.js` — nenhum teste verifica o texto do botão de posts**

Os testes verificam o `href` dos botões mas não o texto visível. Um teste que confirme o label do botão reforçaria a cobertura de i18n.

## Positive Highlights

- O template `layouts/404.html` é limpo, conciso (31 linhas) e segue fielmente a techspec — sem comentários desnecessários, sem código numérico exposto, sem lógica condicional de idioma.
- O uso de `relLangURL` para os hrefs dos botões é a abordagem correta e elegante para suporte multilíngue nativo do Hugo.
- A modificação em `baseof.html` é mínima e retrocompatível — um único bloco `{{ block "title" . }}{{ .Title }}{{ end }}` que não quebra nenhum layout existente.
- As chaves i18n seguem a convenção de nomenclatura do projeto (snake_case com prefixo de contexto `not_found_`), são consistentes entre PT e EN, e os textos são naturais em ambos os idiomas.
- Os 6 testes E2E cobrem os dois idiomas de forma simétrica, seguindo a estrutura `test.describe` recomendada e a regra de um comportamento por teste.
- O build passa sem ERRORs e sem placeholders `[not_found` no HTML gerado, confirmando que todas as chaves i18n estão corretamente registradas.
- A geração de `public/404.html` com título `Página não encontrada | Hallison Oliveira` e `public/en/404.html` com `Page not found | Hallison Oliveira` comprova que o bloco `{{ define "title" }}` funciona corretamente em ambos os contextos de idioma.

## Standards Compliance

| Standard | Status |
|----------|--------|
| Code Standards | OK |
| Hugo / CSS Naming Conventions | OK |
| Logging | OK (sem JavaScript client-side novo) |
| Tests | OK com observacoes |

## Recommendations

1. (Minor) Adicionar assertion positiva do texto do `h1` nos testes PT e EN para confirmar o conteúdo traduzido, não apenas a ausência de "404".
2. (Minor) Incluir verificação do ícone `search_off` no teste EN para paridade com o teste PT.
3. (Minor) Considerar adicionar um teste que verifique o texto visível dos botões, além do `href`, para cobertura completa da tradução dos labels.

## Verdict

A implementação está correta e completa. Todos os requisitos da tarefa foram atendidos: chaves i18n presentes em PT e EN, `baseof.html` com suporte ao bloco `title`, template `404.html` funcional e sem exposição do código numérico, build limpo, e arquivos de saída gerados corretamente para ambos os idiomas. As três observações acima são melhorias menores de cobertura de testes que podem ser incorporadas na Tarefa 2.0 ou em uma iteração futura, sem impacto no merge desta branch.
