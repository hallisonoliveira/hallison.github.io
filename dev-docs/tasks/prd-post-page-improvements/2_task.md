# Tarefa 2.0: Criar partials de navegação/relacionados + refatorar single.html

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar os partials `post-related.html` (com correção do bug RF08) e `post-navigation.html`, e então reescrever `layouts/_default/single.html` como orquestrador limpo que delega para os quatro partials criados nas tarefas 1.0 e 2.0.

<requirements>
- Criar `layouts/partials/post-related.html` excluindo o post atual da lista de relacionados pelo `.Permalink` (RF08)
- Criar `layouts/partials/post-navigation.html` com navegação prev/next dentro da seção `posts`
- Reescrever `layouts/_default/single.html` como orquestrador com no máximo 15 linhas, chamando os quatro partials
- Não alterar header, footer, i18n ou config.toml
- Nomes de variáveis em camelCase; arquivos em kebab-case
</requirements>

## Subtarefas

- [ ] 2.1 Criar `layouts/partials/post-related.html` com lógica corrigida:
  ```hugo
  {{ $currentPermalink := .Permalink }}
  {{ $allInCategory := where (where .Site.RegularPages "Type" "posts") "Params.category" .Params.category }}
  {{ $filtered := where $allInCategory "Permalink" "ne" $currentPermalink }}
  {{ $related := first 3 (shuffle $filtered) }}
  ```
- [ ] 2.2 Criar `layouts/partials/post-navigation.html` extraindo o bloco prev/next do `single.html` atual
- [ ] 2.3 Reescrever `layouts/_default/single.html` como orquestrador chamando `post-header`, `post-content`, `post-related` e `post-navigation`
- [ ] 2.4 Validar build completo e inspecionar HTML gerado

## Detalhes de Implementação

Ver seções **`post-related.html`**, **`post-navigation.html`** e **`single.html` (orquestrador)** em `techspec.md` para estrutura completa.

## Critérios de Sucesso

- `hugo` conclui sem erros
- O post `empatia-assertiva` **não aparece** nos seus próprios posts relacionados
- `single.html` tem no máximo 15 linhas
- Todos os quatro partials existem em `layouts/partials/`

## Testes da Tarefa

- [ ] `hugo` — build sem erros
- [ ] `test -f layouts/partials/post-related.html && test -f layouts/partials/post-navigation.html` — arquivos existem
- [ ] `wc -l layouts/_default/single.html` — máximo 15 linhas
- [ ] `hugo && grep -c "empatia-assertiva" public/posts/empatia-assertiva/index.html` — verificar que não há link para o próprio post na seção relacionada (o resultado deve corresponder apenas à URL canônica da página, não a cards de relacionados)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `layouts/_default/single.html` — a ser reescrito
- `layouts/partials/post-related.html` — novo
- `layouts/partials/post-navigation.html` — novo
- `layouts/partials/post-header.html` — criado na tarefa 1.0
- `layouts/partials/post-content.html` — criado na tarefa 1.0
- `i18n/pt.yaml`, `i18n/en.yaml` — chaves já existentes, sem alteração
