# Review: Task 4.0 - Validação de Conteúdo (v2)

**Revisor**: AI Code Reviewer
**Data**: 2026-04-22
**Arquivo da tarefa**: dev-docs/tasks/prd-i18n-system/4_task.md
**Status**: APPROVED WITH OBSERVATIONS

---

## Resumo

Esta é a segunda revisão da Tarefa 4.0. Os três problemas apontados na revisão anterior foram corrigidos:
os scripts `validate:content` e `test:content` foram adicionados ao `package.json`, uma suite de testes
automatizados com 8 casos foi criada em `tests/validate-i18n.test.js` e o comportamento do stream de
saída do sumário final foi alinhado corretamente (stderr em falha, stdout em sucesso).

O script principal `scripts/validate-i18n.js` está funcional e correto: todos os 8 testes passam, todos
os 26 posts reais são validados com sucesso e os critérios da tarefa foram integralmente atendidos.
Restam apenas observações menores de qualidade de código e cobertura de testes que não bloqueiam o uso.

---

## Arquivos Revisados

| Arquivo | Status | Problemas |
|---------|--------|-----------|
| `scripts/validate-i18n.js` | ⚠️ Observações | 2 |
| `tests/validate-i18n.test.js` | ⚠️ Observações | 3 |
| `package.json` | ✅ OK | 0 |

---

## Problemas Encontrados

### Criticos

Nenhum problema crítico encontrado.

### Importantes

Nenhum problema importante encontrado.

### Menores

**MINOR-01 — `validate-i18n.js` linha 43-44: arquivos `.md` que não são diretórios passam silenciosamente**

Quando o script recebe um único arquivo via `process.argv[2]`, `collectMarkdownFiles` retorna uma lista
vazia se o arquivo não tiver a extensão `.md`. O chamador em `main` interpreta a lista vazia como
"nenhum arquivo encontrado" e termina com código 0 e a mensagem `No markdown files found.` — o que pode
confundir o usuário que passou explicitamente um arquivo `.txt` esperando um erro.

```javascript
// Comportamento atual ao passar um .txt:
// $ node scripts/validate-i18n.js /tmp/notes.txt
// No markdown files found.   (exit 0) — silencioso demais

// Sugestão: diferenciar o caso de arquivo único não-.md
if (stat.isFile()) {
  if (!target.endsWith('.md')) {
    console.error(`❌ File is not a markdown file: ${target}`);
    process.exit(1);
  }
  return [target];
}
```

Este comportamento não afeta o uso normal (diretório ou arquivo `.md`), mas pode surpreender em scripts
de CI/CD que passem um caminho errado.

---

**MINOR-02 — `validate-i18n.js` linha 54: filtro `_index` via `startsWith` é frágil**

O comentário adicionado (fix do MINOR-02 da v1) explica corretamente a intenção, mas o filtro usa
`entry.name.startsWith('_index')`, o que excluiria um arquivo hipotético chamado `_indexer-guide.md`
mesmo não sendo um índice de seção Hugo. Uma correspondência exata é mais robusta:

```javascript
// Atual
&& !entry.name.startsWith('_index')

// Sugestão: correspondência exata com as variantes que Hugo reconhece
&& entry.name !== '_index.md'
&& entry.name !== `_index.${entry.name.split('.').pop()}.md` // para _index.pt.md, _index.en.md
```

Como alternativa direta e legível:

```javascript
const HUGO_INDEX_PATTERN = /^_index(\.[a-z]{2})?\.md$/;
// ...
&& !HUGO_INDEX_PATTERN.test(entry.name)
```

---

**MINOR-03 — `tests/validate-i18n.test.js`: ausência de framework de testes — uso de `assert` nativo com runner customizado**

O arquivo implementa seu próprio runner de testes (`function test(name, fn)`, contadores `passed/failed`).
O padrão do projeto (conforme `tests.md`) é usar o Playwright para testes E2E e sugere o Vitest para
testes unitários de JavaScript. Um runner caseiro não tem suporte a saídas coloridas padronizadas,
agrupamento de suites, relatórios de falha com diff, modo `--watch`, nem integração com o ecossistema de
CI/CD existente.

O uso do `assert` nativo do Node.js é correto e sem problemas; o problema é o runner manual em vez de
uma ferramenta dedicada.

Recomendação para o futuro: migrar para Vitest (já listado em `tests.md` como padrão do projeto):

```javascript
// tests/validate-i18n.test.js (com Vitest)
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'child_process';

describe('validate-i18n', () => {
  it('valid file exits 0 and shows checkmark', () => {
    // ...
  });
});
```

---

**MINOR-04 — `tests/validate-i18n.test.js` linhas 100-105: teste de integração assume estado da rede de posts**

O teste `real posts in content/posts/ all pass` valida que todos os posts existentes passam. Isso é
positivo, mas ele vai falhar silenciosamente no futuro se um post inválido for adicionado ao repositório,
pois o teste não documenta nem isola essa dependência. A natureza do teste (integração contra sistema de
arquivos real) deveria estar explicitamente comentada para que o desenvolvedor entenda que ele é sensível
ao estado do conteúdo.

Não é um defeito, mas uma fragilidade latente.

---

**MINOR-05 — `tests/validate-i18n.test.js` linha 115: `console.log` do sumário não é testado quanto ao stream correto**

O teste `summary line goes to stdout on success` (linha 108-113) verifica apenas que `result.stdout`
contém `Summary:`. Ele não verifica que `result.stderr` está vazio — ou seja, não garante que o sumário
não apareceu em ambos os streams simultaneamente. A correção do MINOR-01 da v1 funciona corretamente
(verificado manualmente), mas o teste não fecha o ciclo de forma completa.

```javascript
// Sugestão: adicionar asserção complementar
test('summary line goes to stdout on success', () => {
  const file = writeTempFile('---\ntitle: Test\ndate: 2024-04-16T00:00:00Z\ndescription: Desc\n---\nContent\n');
  const result = run([file]);
  fs.unlinkSync(file);
  assert.ok(result.stdout.includes('Summary:'), 'Expected Summary in stdout');
  assert.ok(!result.stderr.includes('Summary:'), 'Summary should NOT appear in stderr on success');
});
```

---

## Destaques Positivos

- Todos os 8 testes passam e cobrem os casos centrais da especificação da tarefa.
- A regex do parser de frontmatter (`/^---\r?\n([\s\S]*?)\r?\n---/`) lida corretamente com fins de
  linha CRLF e LF, garantindo compatibilidade cross-platform.
- O tratamento de erros em `validateFile` é defensivo e correto: testa `undefined`, `null` e string
  vazia para cada campo obrigatório.
- O uso de `path.resolve` em `collectMarkdownFiles` e `main` garante que caminhos relativos e absolutos
  funcionem uniformemente.
- A separação de responsabilidades entre `extractFrontmatter`, `validateFile`, `collectMarkdownFiles` e
  `main` segue a convenção de "uma função, uma responsabilidade".
- O script usa apenas dependências já presentes no projeto (`js-yaml`) e módulos nativos do Node.js.
- A correção do MINOR-01 da v1 (stream do sumário) foi aplicada corretamente e verificada: sumário vai
  para stderr quando há falhas e para stdout quando tudo passa.
- O comentário explicativo para o filtro `_index` (MINOR-02 da v1) foi adicionado e é claro.
- Os scripts `validate:content` e `test:content` no `package.json` seguem a convenção de nomenclatura
  existente (`validate:i18n`).

---

## Conformidade com Padrões

| Padrão | Status |
|--------|--------|
| Padrões de código (code-standards.md) | ✅ |
| Padrões JavaScript/Node.js | ✅ |
| REST/HTTP | N/A |
| Logging | ✅ |
| Testes (tests.md) | ⚠️ |

**Nota sobre Testes**: O runner customizado diverge do padrão do projeto (Playwright/Vitest). Os testes
funcionam, mas não seguem a estrutura recomendada pela documentação em `tests.md`.

---

## Recomendações

1. **(Futura melhoria)** Migrar `tests/validate-i18n.test.js` para Vitest para alinhar com o padrão
   definido em `tests.md`. O custo de migração é baixo pois os casos de teste já estão bem definidos.

2. **(Baixa prioridade)** Substituir `startsWith('_index')` por uma regex exata `(/^_index(\.[a-z]{2})?\.md$/)` para tornar o filtro de índices Hugo mais preciso e documentado.

3. **(Baixa prioridade)** Adicionar validação explícita quando um arquivo não-`.md` é passado
   diretamente como argumento, retornando erro em vez de `No markdown files found.`.

4. **(Baixa prioridade)** Complementar o teste do sumário adicionando a asserção de que `stderr` não
   contém `Summary:` em caso de sucesso.

---

## Veredicto

**APPROVED WITH OBSERVATIONS.** Todos os problemas críticos e importantes da revisão anterior foram
corrigidos. O script está funcional, os critérios da tarefa estão atendidos integralmente e os 8 testes
passam. As observações restantes são de qualidade incremental e não bloqueiam o uso em produção ou em
CI/CD. A migração para Vitest é a recomendação mais impactante para o longo prazo, mas pode ser feita em
uma tarefa separada.
