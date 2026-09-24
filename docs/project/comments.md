---
type: External Integration
title: Comentários com Giscus
description: Integração opcional de comentários em posts, armazenados como GitHub Discussions.
tags: [comments, giscus, github-discussions, i18n]
status: setup-required
sources:
  - resource: ../../config.toml
    title: Configuração de comentários
  - resource: ../../layouts/partials/comments.html
    title: Partial de comentários
  - resource: https://github.com/giscus/giscus
    title: Documentação do Giscus
---

# Escopo

Comentários são exibidos somente em páginas individuais da seção `posts`. O autor pode omiti-los de um post com `comments: false` no frontmatter.

Quando a configuração estiver completa, o componente carrega o Giscus automaticamente ao abrir um post. Isso conecta o visitante ao GitHub durante o carregamento da página.

# Idioma e associação entre traduções

O widget recebe `pt` em páginas em português e `en` em páginas em inglês. Essa definição traduz os controles do Giscus; não traduz o texto escrito pelos participantes.

O termo de associação da discussão é o `translationKey` da página. Versões PT e EN de um mesmo artigo devem compartilhar esse campo e, portanto, a mesma conversa. Defina um valor explícito e estável, como `posts/kubectl-curl-api-kubernetes`, em vez de derivá-lo da URL.

# Ativação

Antes de habilitar o recurso:

1. Ative GitHub Discussions em `hallisonoliveira/hallison.github.io`.
2. Crie ou selecione uma categoria de Discussions para os comentários (a configuração atual usa `Blog Comments`).
3. Instale o GitHub App do Giscus nesse repositório e gere a configuração em [giscus.app](https://giscus.app/).
4. Preencha `repoId` e `categoryId` em `params.comments.giscus` no `config.toml` com os valores fornecidos pelo configurador.

Os IDs são necessários para evitar que o widget seja publicado com uma configuração incompleta. `params.comments.enabled` é `true`, então o widget aparece automaticamente após o preenchimento dos dois IDs. Use a página de Discussions do GitHub para moderar ou fechar as conversas.
