---
type: Project Architecture
title: Arquitetura Hugo do blog
description: Organização do site estático, seus idiomas, templates e ativos de interface.
tags: [hugo, architecture, static-site, i18n]
status: stable
sources:
  - resource: ../../config.toml
    title: Configuração principal do Hugo
  - resource: ../../layouts/_default/baseof.html
    title: Template base do site
  - resource: ../../layouts/
    title: Layouts Hugo do projeto
---

# Visão geral

O projeto é um site estático em Hugo, com layouts próprios e conteúdo editorial organizado em page bundles. A configuração principal fica em [`config.toml`](../../config.toml). O repositório não declara um tema Hugo ativo: os templates em [`layouts/`](../../layouts/) definem a apresentação atual.

# Idiomas e rotas

| Idioma | Código | Publicação |
| --- | --- | --- |
| Português | `pt-br` | raiz do site |
| Inglês | `en-us` | subdiretório `/en/` |

O português é o idioma padrão. Use `relLangURL` nos layouts para links internos que devem acompanhar o idioma atual.

# Componentes

| Área | Responsabilidade |
| --- | --- |
| `content/` | páginas e posts em Markdown com frontmatter YAML |
| `layouts/` | templates, partials, páginas de seção e shortcodes |
| `i18n/` | traduções da interface em YAML |
| `static/` | arquivos copiados diretamente para a saída, incluindo JavaScript |
| `archetypes/` | modelos usados ao criar conteúdo com Hugo |
| `tests/` | testes de conteúdo e fluxos end-to-end |

# Interface

O template base carrega Tailwind CSS por CDN e declara a configuração de cores e fontes inline. A navegação, consentimento de cookies, analytics e rodapé são partials. Scripts de comportamento do cliente são servidos de `static/js/`.

Comentários são um componente opcional de post em `layouts/partials/comments.html`. Quando configurado, o componente carrega o Giscus apenas após uma ação explícita do leitor; os comentários são armazenados em GitHub Discussions. Veja [Comentários](comments.md) para configuração e operação.

`public/` e `resources/` são artefatos de build: a fonte de verdade são os arquivos de conteúdo, layouts, configuração e ativos em `static/`.
