# Tarefa 2.0: Refatorar Templates para i18n

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Refatorar os templates Hugo existentes para usar a função `i18n` nativa e `relLangURL` para geração de URLs localizadas. Esta tarefa remove lógica JS inline e integra as chaves de tradução criadas na Tarefa 1.0. Inclui refatoração de components críticos e criação de novo partial para seletor de idioma.

<requirements>
- Refatorar `layouts/_default/baseof.html` para remover lógica JS inline e importar `language-service.js`
- Refatorar `layouts/partials/header.html` para usar `i18n` e `relLangURL`
- Refatorar `layouts/partials/footer.html` para usar `i18n`
- Criar novo `layouts/partials/language-selector.html` com button acessível
- Atualizar `layouts/posts/list.html` para filtrar posts por idioma automaticamente
- Garantir que todas as URLs geradas respeitam o padrão: PT raiz, EN prefixado (`/en/`)
- Validar que HTML gerado é válido e acessível
</requirements>

## Subtarefas

- [ ] 2.1 Refatorar `layouts/_default/baseof.html` (remover JS inline, adicionar `<script src="/js/language-service.js">`)
- [ ] 2.2 Refatorar `layouts/partials/header.html` (trocar links hardcoded por `{{ relLangURL "/" }}` e adicionar `{{ i18n "nav_*" }}`)
- [ ] 2.3 Refatorar `layouts/partials/footer.html` (usar `{{ i18n "footer_*" }}` para strings)
- [ ] 2.4 Criar `layouts/partials/language-selector.html` (button com id `language-toggle`, aria-labels)
- [ ] 2.5 Atualizar `layouts/posts/list.html` para filtrar `where .Site.RegularPages "Type" "posts"` por idioma
- [ ] 2.6 Validar URLs geradas e estrutura HTML

## Detalhes de Implementação

Consulte as seções do `techspec.md`:
- **Estrutura de Templates** (linha 71-196): código template detalhado para cada arquivo
- **Fluxo de Dados** (linha 35-58): como dados fluem pelo sistema
- **Relacionamentos Principais** (linha 60-67): dependências entre componentes

Pontos-chave:
- `baseof.html` deve ter `<script src="/js/language-service.js" defer></script>` no final
- `header.html` deve usar `{{ relLangURL "/" }}` para home, posts, about
- `language-selector.html` deve ter `id="language-toggle"` e `data-current-lang="{{ .Site.Language }}"`
- `posts/list.html` deve renderizar apenas posts do idioma atual via Hugo

## Critérios de Sucesso

- ✓ Todos os templates refatorados estão sintaticamente corretos
- ✓ Nenhuma hardcode de URLs; todas usam `relLangURL`
- ✓ Todas as strings de UI usam `{{ i18n "chave" }}`
- ✓ `language-selector.html` é acessível (aria-labels, button semântico)
- ✓ Build Hugo executa sem erros ou warnings
- ✓ URLs geradas respeitam padrão: `/` (PT), `/en/` (EN)
- ✓ HTML gerado é válido (sem tags abertas, atributos corretos)

## Testes da Tarefa

- [ ] **Teste de sintaxe**: Validar que todos os templates Hugo estão sintaticamente corretos
  ```bash
  hugo --printI18nWarnings 2>&1 | grep -i "error" && exit 1
  echo "✅ Templates sintaticamente corretos"
  ```

- [ ] **Teste de integração**: Build completo e validação de URLs
  ```bash
  hugo
  
  # Verificar que URLs PT estão na raiz
  test -f public/index.html || exit 1
  test -f public/posts/index.html || exit 1
  
  # Verificar que URLs EN têm prefixo /en/
  test -f public/en/index.html || exit 1
  test -f public/en/posts/index.html || exit 1
  
  echo "✅ URLs geradas corretamente"
  ```

- [ ] **Teste HTML válido**: Validar estrutura HTML sem errors
  ```bash
  # Se tiver htmlvalidator instalado, ou usar manual inspection
  # Verificar que language-selector tem id e data-current-lang
  grep -q 'id="language-toggle"' public/index.html && echo "✅ Language toggle encontrado"
  ```

- [ ] **Teste de acessibilidade**: Validar aria-labels
  ```bash
  grep -q 'aria-label' public/index.html && echo "✅ ARIA labels presentes"
  ```

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `layouts/_default/baseof.html` - Template base (modificar)
- `layouts/partials/header.html` - Header com navegação (modificar)
- `layouts/partials/footer.html` - Footer (modificar)
- `layouts/partials/language-selector.html` - Novo seletor de idioma (criar)
- `layouts/posts/list.html` - Listagem de posts (modificar)
- `dev-docs/tasks/prd-i18n-system/techspec.md` - Referência técnica (ler)
