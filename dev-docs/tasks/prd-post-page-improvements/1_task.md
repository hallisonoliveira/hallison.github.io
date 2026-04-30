# Tarefa 1.0: Criar partials de conteúdo (post-header + post-content)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Extrair do `layouts/_default/single.html` atual os blocos de header e conteúdo em dois partials independentes: `post-header.html` e `post-content.html`. Cada partial deve seguir as classes de referência definidas na techspec e garantir conformidade visual com o mockup em `mockup/post/code.html`.

<requirements>
- Criar `layouts/partials/post-header.html` com: chip de categoria, data, tempo de leitura, título (RF01), subtitle opcional e imagem de destaque (RF02)
- Criar `layouts/partials/post-content.html` com: grid 12 colunas, sidebar sticky (autor + topics) e corpo do artigo com prose (RF03, RF04, RF05, RF07, RF09)
- Nenhum dos partials deve alterar header, footer ou lógica de posts relacionados/navegação
- Todos os nomes de variáveis devem seguir camelCase; nomes de arquivos em kebab-case (code-standards.md)
- Cada arquivo deve ter no máximo 100 linhas
</requirements>

## Subtarefas

- [ ] 1.1 Criar `layouts/partials/post-header.html` — chip de categoria, data, tempo de leitura, título (RF01) com classes `font-headline text-5xl md:text-7xl font-extrabold tracking-tighter`, subtitle opcional e imagem de destaque (RF02) com `aspect-[21/9] rounded-xl overflow-hidden grayscale hover:grayscale-0`
- [ ] 1.2 Criar `layouts/partials/post-content.html` — grid `lg:col-span-8 lg:col-start-5`, sidebar sticky com autor e topics, prose com classes RF03/RF05/RF09 (`prose prose-lg max-w-none prose-p:font-body prose-p:text-xl prose-p:leading-relaxed prose-p:mb-6 prose-img:rounded-xl prose-img:my-8 prose-a:text-primary-container prose-a:underline`)
- [ ] 1.3 Verificar que o drop cap (RF04) continua funcionando via CSS global em `baseof.html` — nenhuma alteração necessária, apenas confirmar ausência de `prose-p:indent-*`
- [ ] 1.4 Validar build sem erros (`hugo`) e inspecionar HTML gerado do post `empatia-assertiva`

## Detalhes de Implementação

Ver seções **`post-header.html`** e **`post-content.html`** em `techspec.md` para referência completa de classes e estrutura de grid.

## Critérios de Sucesso

- `test -f layouts/partials/post-header.html` retorna sucesso
- `test -f layouts/partials/post-content.html` retorna sucesso
- `hugo` conclui sem erros ou warnings críticos
- HTML gerado em `public/posts/empatia-assertiva/index.html` contém `aspect-[21/9]` e `font-headline`
- Nenhum arquivo ultrapassa 100 linhas

## Testes da Tarefa

- [ ] `hugo` — build sem erros
- [ ] `test -f layouts/partials/post-header.html && test -f layouts/partials/post-content.html` — arquivos existem
- [ ] `grep "aspect-\[21\/9\]" public/posts/empatia-assertiva/index.html` — imagem de destaque com proporção correta
- [ ] `grep "font-headline" public/posts/empatia-assertiva/index.html` — título com fonte correta
- [ ] `grep "prose-a:text-primary-container\|text-primary-container" public/posts/empatia-assertiva/index.html` — links diferenciados (RF09)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `layouts/_default/single.html` — fonte de extração
- `layouts/partials/post-header.html` — novo
- `layouts/partials/post-content.html` — novo
- `mockup/post/code.html` — referência visual
- `layouts/_default/baseof.html` — CSS global (drop cap, fontes)
