# Tarefa 1.0: Padronizar layouts

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Aplicar todas as correções de padding, max-width, espaçamento vertical e duration de transições nos quatro arquivos de layout: `single.html`, `index.html`, `posts/list.html` e `about/list.html`. Nenhum conteúdo, partial ou arquivo fora de `layouts/` deve ser alterado.

<requirements>
- RF-01: Remover `px-6 md:px-12` duplicado do `<article>`, `<section>` de leituras relacionadas e `<nav>` em `single.html`
- RF-02: Envolver conteúdo principal de `index.html` e `posts/list.html` em `<div class="max-w-screen-xl mx-auto">`; substituir `max-w-7xl` por `max-w-screen-xl` em `about/list.html`
- RF-03: Corrigir `mt-32` → `mt-24` na section de leituras relacionadas em `single.html`; `mb-32` → `mb-24` nas seções Hero e Philosophy em `about/list.html`
- RF-04: Adicionar `duration-300` nos share buttons e nav links de `single.html`; adicionar `duration-300` nos social links de `about/list.html`
- Não alterar `baseof.html`, partials, conteúdo ou configuração
</requirements>

## Subtarefas

- [ ] 1.1 Editar `layouts/_default/single.html`: remover `px-6 md:px-12` do article, section e nav; corrigir `mt-32` → `mt-24`; adicionar `duration-300` nos share buttons e nav links
- [ ] 1.2 Editar `layouts/index.html`: envolver conteúdo principal em `<div class="max-w-screen-xl mx-auto">`
- [ ] 1.3 Editar `layouts/posts/list.html`: envolver conteúdo principal em `<div class="max-w-screen-xl mx-auto">`
- [ ] 1.4 Editar `layouts/about/list.html`: substituir `max-w-7xl` por `max-w-screen-xl`; `mb-32` → `mb-24`; adicionar `duration-300` nos social links

## Detalhes de Implementação

Ver seção **Design de Implementação** em `techspec.md` — RF-01, RF-02, RF-03 e RF-04 detalham exatamente quais classes mudam em cada elemento, com trechos antes/depois.

Ponto de atenção: as margens negativas compensatórias `-mx-6 md:-mx-12 lg:-mx-16` da seção Philosophy em `about/list.html` devem ser mantidas intactas.

## Critérios de Sucesso

- Nenhum elemento em `single.html` redefine `px-6 md:px-12` além do `baseof.html`
- Todas as páginas possuem um container `max-w-screen-xl mx-auto` envolvendo o conteúdo principal
- Seções primárias usam `mb-24` (não `mb-32`) como espaçamento inferior
- Todos os links e botões com `transition-colors` ou `transition-opacity` possuem `duration-300`
- Build Hugo sem erros ou warnings após as alterações

## Testes da Tarefa

- [ ] Build smoke test: `hugo && echo "Build OK"` — deve completar sem erros
- [ ] Inspeção visual no browser (hugo server): alinhar horizontalmente as páginas `/`, `/posts/`, `/about/` e um post individual — margens devem ser visualmente idênticas em desktop e mobile

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `layouts/_default/single.html`
- `layouts/index.html`
- `layouts/posts/list.html`
- `layouts/about/list.html`
- `layouts/_default/baseof.html` (leitura, sem modificação — fonte de verdade do padding base)
