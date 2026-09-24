---
okf_version: "0.2"
---

# Base de conhecimento do projeto

Este diretório é o bundle [Open Knowledge Format (OKF)](https://github.com/GoogleCloudPlatform/open-knowledge-format) do blog. Ele registra conhecimento de projeto em Markdown versionado, legível por pessoas e agentes.

Leia os documentos por área antes de alterar a respectiva parte do sistema. Os `index.md` permitem descoberta progressiva; arquivos de conceito têm frontmatter YAML com tipo, descrição, estado e fontes.

## Projeto

- [Arquitetura Hugo](project/architecture.md) — topologia do site, templates e ativos.
- [Conteúdo e internacionalização](project/content-and-i18n.md) — modelo editorial e regras de localização.
- [Desenvolvimento e qualidade](project/development.md) — comandos, validações e testes.
- [Entrega](project/deployment.md) — build e hospedagem.
- [Comentários](project/comments.md) — integração opcional com Giscus e GitHub Discussions.

## Manutenção

- [Histórico de documentação](log.md) — atualizações significativas deste bundle.

## Como contribuir

1. Crie ou atualize um documento de conceito para mudanças de conhecimento duradouro.
2. Inclua `type` no frontmatter; use `title`, `description`, `tags`, `status` e `sources` quando aplicáveis.
3. Registre a origem das afirmações em `sources` e marque o documento como `draft` enquanto não tiver sido confirmado.
4. Atualize este índice e o `log.md` quando adicionar, mover, depreciar ou alterar materialmente um conceito.
