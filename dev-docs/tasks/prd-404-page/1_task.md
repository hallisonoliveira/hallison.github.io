# Tarefa 1.0: Implementação da página 404

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a página 404 customizada completa: adicionar as chaves de tradução em ambos os idiomas, adaptar `baseof.html` para suportar título dinâmico e criar o template `layouts/404.html` com layout, ícone, mensagem internacionalizada e botões de navegação.

<requirements>
- As 4 chaves `not_found_*` devem existir em `i18n/pt.yaml` com os textos em português
- As 4 chaves `not_found_*` devem existir em `i18n/en.yaml` com os textos em inglês
- A tag `<title>` em `baseof.html` deve usar `{{ block "title" . }}{{ .Title }}{{ end }}` como fallback
- O arquivo `layouts/404.html` deve existir e estender `baseof.html` via `{{ define "main" }}`
- A página deve exibir o ícone `search_off` (Material Symbols), um `h1` semântico e dois botões `<a>`
- O código numérico "404" não deve aparecer no conteúdo visível da página
- `public/404.html` deve ser gerado pelo Hugo (contexto PT)
- `public/en/404.html` deve ser gerado pelo Hugo (contexto EN)
- O build deve concluir sem ERRORs nem warnings de tradução ausente (`[not_found`)
</requirements>

## Subtarefas

- [ ] 1.1 Adicionar as 4 chaves `not_found_*` em `i18n/pt.yaml`
- [ ] 1.2 Adicionar as 4 chaves `not_found_*` em `i18n/en.yaml`
- [ ] 1.3 Modificar linha da tag `<title>` em `layouts/_default/baseof.html` para suportar `{{ block "title" }}`
- [ ] 1.4 Criar `layouts/404.html` com o template completo
- [ ] 1.5 Executar `hugo` e verificar geração dos arquivos de saída
- [ ] 1.6 Testar em `hugo server` acessando URLs inexistentes em PT e EN

## Detalhes de Implementação

Consultar as seções **"Estrutura de Templates"**, **"Configuração de Dados (config.toml)"** e **"Sequenciamento de Desenvolvimento"** da `techspec.md` para os valores exatos das chaves i18n, o código do template e a modificação precisa em `baseof.html`.

## Critérios de Sucesso

- `hugo` conclui sem ERRORs e sem linhas `[not_found` no HTML gerado
- `public/404.html` existe e contém o texto em português
- `public/en/404.html` existe e contém o texto em inglês
- Nenhuma ocorrência de `>404<` no conteúdo visível dos arquivos gerados
- Em `hugo server`, acessar `/url-inexistente/` exibe a página 404 em PT e `/en/url-inexistente/` exibe em EN

## Testes da Tarefa

- [ ] `test -f public/404.html && echo "PT gerado" || echo "PT ausente"`
- [ ] `test -f public/en/404.html && echo "EN gerado" || echo "EN ausente"`
- [ ] `grep -r "\[not_found" public/404.html public/en/404.html && echo "chave ausente" || echo "traduções OK"`
- [ ] `grep -E ">404<" public/404.html && echo "código exposto" || echo "sem código numérico"`
- [ ] `hugo 2>&1 | grep -E "ERROR" || echo "build sem ERRORs"`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `i18n/pt.yaml` — adicionar chaves `not_found_*`
- `i18n/en.yaml` — adicionar chaves `not_found_*`
- `layouts/_default/baseof.html` — modificar tag `<title>` (1 linha)
- `layouts/404.html` — criar template (novo arquivo)
- `public/404.html` — saída PT (gerado pelo Hugo)
- `public/en/404.html` — saída EN (gerado pelo Hugo)
