---
type: Content Model
title: Conteúdo e internacionalização
description: Convenções para posts, páginas de seção, ativos e traduções do blog.
tags: [hugo, content, i18n, editorial]
status: stable
sources:
  - resource: ../../archetypes/posts.md
    title: Arquétipo de post
  - resource: ../../content/posts/
    title: Bundles de posts existentes
  - resource: ../../i18n/
    title: Catálogo de traduções da interface
  - resource: ../../scripts/validate-i18n.js
    title: Validador de frontmatter de posts
---

# Posts

Posts ficam em `content/posts/<slug>/`. Cada versão de idioma usa um arquivo `index.<idioma>.md`, por exemplo `index.pt.md` e `index.en.md`. Imagens e outros ativos específicos pertencem ao mesmo diretório do post, para que possam ser referenciados com caminhos relativos.

O frontmatter de um post precisa conter:

```yaml
title: "Título do post"
date: 2026-09-23
description: "Resumo curto para metadados e listagens."
translationKey: "posts/slug-do-post"
draft: false
tags: []
categories: []
ai_usage:
  - none
```

`image`, `category` e `tags` são usados nos posts existentes quando pertinentes. O validador de conteúdo exige `title`, `date`, `description` e `translationKey` em arquivos de post; mantenha o YAML válido e datas em formato ISO.

`ai_usage` registra o uso de IA generativa e é uma lista sem valores repetidos, com um ou mais destes valores: `none`, `review`, `translation`, `code`, `visual`, `research` e `assistance`. `none` é exclusivo e não pode ser combinado com outra categoria. O arquétipo já inclui `none` para novos posts. Posts publicados antes da introdução desse metadado podem não declará-lo até que o histórico editorial seja confirmado; nesse caso, o selo não é exibido.

O partial `post-ai-usage.html` mostra o selo ao fim do artigo e direciona para a página de política localizada em `/ai-policy/` ou `/en/ai-policy/`.

`translationKey` é o identificador estável do artigo. As versões traduzidas de um mesmo post devem usar exatamente o mesmo valor. Além de ligar as traduções no Hugo, ele identifica a discussão compartilhada do Giscus; não o altere ao mudar o título ou o slug.

# Páginas de seção

Índices de seção usam `_index.<idioma>.md`, como `content/posts/_index.pt.md` e `content/about/_index.en.md`. Esses arquivos representam a página de listagem, não um post individual.

# Traduções de interface

As mensagens de interface ficam em `i18n/pt.yaml` e `i18n/en.yaml`. Templates acessam essas mensagens pela função Hugo `i18n`.

Ao criar uma nova chave:

1. adicione a mesma chave aos dois catálogos;
2. forneça a tradução adequada em cada idioma;
3. execute `npm run validate:i18n`.

Conteúdo editorial pode existir em apenas um idioma quando isso for uma decisão consciente. Não crie traduções vazias nem faça o validador passar com texto fictício.
