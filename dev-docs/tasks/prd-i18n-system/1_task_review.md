# Review: Task 1.0 - Configuração i18n Hugo

**Reviewer**: AI Code Reviewer
**Date**: 2026-04-16
**Task file**: 1_task.md
**Status**: APPROVED WITH OBSERVATIONS

## Summary

A tarefa implementou com sucesso a configuração base do sistema de internacionalização (i18n) do Hugo. Os arquivos `i18n/pt.yaml` e `i18n/en.yaml` foram criados com todas as chaves obrigatórias previstas no `1_task.md`, as chaves estão simétricas entre os dois idiomas, e o build do Hugo não apresenta nenhum warning de tradução ausente. O script de validação de chaves `scripts/validate-i18n-keys.js` foi criado como um bônus positivo não previsto explicitamente na tarefa. Foram identificados pontos de melhoria relacionados a parâmetros redundantes no `config.toml`, ausência de testes E2E configurados e subtarefa 1.2 parcialmente implementada.

## Files Reviewed

| File | Status | Issues |
|------|--------|--------|
| `config.toml` | ⚠️ Issues | 2 |
| `i18n/pt.yaml` | ✅ OK | 0 |
| `i18n/en.yaml` | ✅ OK | 0 |
| `scripts/validate-i18n-keys.js` | ⚠️ Issues | 1 |
| `package.json` | ⚠️ Issues | 1 |

## Issues Found

### Criticos

Nenhum problema crítico encontrado.

### Problemas Importantes

**[MAJOR-01] config.toml: Parâmetros `defaultLanguage` e `enableI18nWarn` em `[params]` são custom, não Hugo-native**

- **Arquivo**: `config.toml`, linhas 29-30
- **Problema**: Os parâmetros `defaultLanguage = 'pt'` e `enableI18nWarn = true` foram colocados dentro de `[params]`, o que os torna parâmetros de template customizados acessíveis via `.Site.Params.defaultLanguage`. Eles não afetam o comportamento do Hugo de forma alguma. O comportamento nativo de Hugo para warnings de i18n é controlado pelo parâmetro `enableMissingTranslationPlaceholders = true` que já existe na raiz do config (linha 7), e a linguagem padrão é definida por `defaultContentLanguage = 'pt'` (linha 5).
- **Risco**: Pode criar confusão entre desenvolvedores futuros que esperam que `enableI18nWarn` seja um parâmetro funcional do Hugo. A subtarefa 1.2 pedia esses parâmetros, mas eles não têm efeito real no comportamento do build.
- **Sugestão**: Remover os parâmetros `defaultLanguage` e `enableI18nWarn` de `[params]`, pois são redundantes com os parâmetros nativos já existentes. Adicionar um comentário explicativo se necessário:

```toml
# Linguagem padrão: PT na raiz (/), EN prefixado (/en/)
defaultContentLanguage = 'pt'
defaultContentLanguageInSubdir = false

# Exibe placeholder visual [i18n] para chaves sem tradução
enableMissingTranslationPlaceholders = true
```

**[MAJOR-02] Ausência de testes E2E configurados**

- **Arquivo**: `package.json` e diretório `tests/`
- **Problema**: O critério de sucesso e os testes da tarefa (`1_task.md` linhas 48-67) requerem validação via build do Hugo e validação de arquivos críticos. O `package.json` inclui apenas o script `validate:i18n`, mas não há script equivalente a `validate:build` (conforme `scripts/validate-build.sh` previsto no `techspec.md`). O diretório `tests/` e a configuração do Playwright também não existem.
- **Risco**: A ausência do script de validação de build impede CI/CD de detectar regressões no sistema i18n automaticamente.
- **Sugestão**: Adicionar o script ao `package.json`:

```json
{
  "scripts": {
    "validate:i18n": "node scripts/validate-i18n-keys.js",
    "validate:build": "bash scripts/validate-build.sh"
  }
}
```

E criar o arquivo `scripts/validate-build.sh` conforme especificado no `techspec.md`.

### Melhorias Menores

**[MINOR-01] `scripts/validate-i18n-keys.js`: Mensagens de log em português com emojis**

- **Arquivo**: `scripts/validate-i18n-keys.js`, linhas 11, 34, 39, 67-68
- **Problema**: O padrão de código do projeto (`code-standards.md`) especifica que o código-fonte deve ser em inglês. As mensagens de console dentro do script estão em português e utilizam emojis (`✅`, `❌`).
- **Sugestão**: Traduzir as mensagens para inglês e remover emojis:

```javascript
console.log('Validating i18n keys...\n');
console.error(`Keys in PT but missing in EN: ${missingInEN.join(', ')}`);
console.log('All keys are present in both languages');
```

**[MINOR-02] `config.toml`: `baseURL` com valor de placeholder**

- **Arquivo**: `config.toml`, linha 1
- **Problema**: `baseURL = 'http://example.org/'` é um valor placeholder. Embora este seja um detalhe de configuração de ambiente e não diretamente relacionado à tarefa 1.0, pode causar problemas com URLs geradas em produção.
- **Sugestão**: Atualizar para a URL real de produção (`https://hallison.dev/`) conforme especificado no `techspec.md`, linha 220.

**[MINOR-03] `config.toml`: Nomenclatura camelCase em `[params]` inconsistente com guia de estilo TOML**

- **Arquivo**: `config.toml`, linhas 26-30 (bloco `[params]`)
- **Problema**: O padrão `code-standards.md` especifica que parâmetros TOML devem usar kebab-case (ex: `site-name`, `author-name`). Os parâmetros `siteName`, `author`, `defaultLanguage`, `enableI18nWarn` usam camelCase.
- **Nota**: Esta inconsistência já existia antes da tarefa 1.0 (apenas `defaultLanguage` e `enableI18nWarn` são novos), portanto é uma observação de contexto mais do que um problema desta entrega.

## Destaques Positivos

- Os arquivos `i18n/pt.yaml` e `i18n/en.yaml` estão bem estruturados com comentários de secao claros, cobrindo todas as chaves obrigatórias: navegação, footer, posts, 12 meses e formato de data.
- As chaves são completamente simétricas entre PT e EN - zero divergências.
- O formato de data é corretamente localizado: PT usa `{{ .day }} de {{ .month }} de {{ .year }}` e EN usa `{{ .month }} {{ .day }}, {{ .year }}`.
- O build do Hugo executa sem nenhum warning `[i18n]`, confirmado via `hugo --i18n-warnings`.
- Os arquivos críticos `public/index.html`, `public/en/index.html` e `public/sitemap.xml` são gerados corretamente.
- O script `scripts/validate-i18n-keys.js` foi criado proativamente com verificacao de chaves obrigatórias, verificacao de simetria entre idiomas e saída clara de erros - vai além do mínimo da tarefa.
- A estrutura de idiomas respeita a spec: PT na raiz (`/`), EN prefixado (`/en/`), via `defaultContentLanguageInSubdir = false`.

## Conformidade com Padrões

| Padrão | Status |
|--------|--------|
| Padrões de Código | ⚠️ |
| Padrões Hugo (kebab-case TOML, camelCase templates) | ⚠️ |
| Logging | ✅ |
| Testes | ⚠️ |

## Recomendações

1. **(Alta prioridade)** Remover `defaultLanguage` e `enableI18nWarn` de `[params]` no `config.toml` - são parâmetros sem efeito funcional que podem induzir a erro. Os parâmetros nativos equivalentes (`defaultContentLanguage` e `enableMissingTranslationPlaceholders`) já existem e funcionam corretamente.
2. **(Alta prioridade)** Criar `scripts/validate-build.sh` e registrar o script `validate:build` no `package.json` para completar o requisito de testes de integração da tarefa.
3. **(Média prioridade)** Atualizar `baseURL` de `http://example.org/` para `https://hallison.dev/` no `config.toml`.
4. **(Baixa prioridade)** Traduzir mensagens de console em `scripts/validate-i18n-keys.js` para inglês e remover emojis, alinhando ao padrão de código do projeto.

## Verdict

A implementação atinge os critérios funcionais da tarefa: os arquivos i18n existem, estão bem-formados, as chaves correspondem entre os idiomas e o Hugo constrói sem warnings de tradução. O problema mais relevante é a adição de parâmetros custom em `[params]` que simulam parâmetros nativos do Hugo sem ter efeito real (`defaultLanguage`, `enableI18nWarn`). O script de validação de build previsto no `techspec.md` não foi criado, deixando o `package.json` incompleto. Nenhum desses problemas bloqueia o funcionamento do sistema i18n em produção.

**Próximos passos antes de avançar para a Tarefa 2.0:**
- Remover os parâmetros redundantes de `[params]` no `config.toml`
- Criar `scripts/validate-build.sh` e adicionar `validate:build` ao `package.json`
