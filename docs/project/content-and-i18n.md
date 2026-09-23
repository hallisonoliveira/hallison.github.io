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
draft: false
tags: []
categories: []
```

`image`, `category` e `tags` são usados nos posts existentes quando pertinentes. O validador de conteúdo exige `title`, `date` e `description` em arquivos de post; mantenha o YAML válido e datas em formato ISO.

# Páginas de seção

Índices de seção usam `_index.<idioma>.md`, como `content/posts/_index.pt.md` e `content/about/_index.en.md`. Esses arquivos representam a página de listagem, não um post individual.

# Traduções de interface

As mensagens de interface ficam em `i18n/pt.yaml` e `i18n/en.yaml`. Templates acessam essas mensagens pela função Hugo `i18n`.

Ao criar uma nova chave:

1. adicione a mesma chave aos dois catálogos;
2. forneça a tradução adequada em cada idioma;
3. execute `npm run validate:i18n`.

Conteúdo editorial pode existir em apenas um idioma quando isso for uma decisão consciente. Não crie traduções vazias nem faça o validador passar com texto fictício.
