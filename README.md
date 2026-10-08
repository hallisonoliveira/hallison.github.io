# Blog de Hallison Oliveira

Blog pessoal estático construído com [Hugo](https://gohugo.io/), com interface em português e inglês. O português é publicado na raiz; o inglês fica no prefixo `/en/`.

## Início rápido

Pré-requisitos: Node.js e npm. Instale as dependências do projeto e inicie o servidor:

```bash
make setup
make dev
```

`make setup` instala as dependências JavaScript do `package-lock.json` e, se Hugo estiver ausente, instala Hugo pelo Homebrew no macOS. Em outros sistemas, instale Hugo separadamente e deixe-o disponível no `PATH`. O deploy usa Hugo `0.92.2`, conforme [`vercel.json`](vercel.json). Para rodar os testes E2E no Windows, o Hugo também deve estar disponível no WSL em `/snap/bin/hugo`.

O servidor local fica disponível em `http://localhost:1313`.

## Comandos úteis

```bash
make build                 # gera o site em public/
make check                 # valida i18n, conteúdo e build
make test                  # executa validações e testes Playwright
npm run validate:i18n      # verifica chaves PT/EN
npm run validate:content   # verifica frontmatter dos posts
npm run test:e2e           # executa testes end-to-end
```

## Estrutura

```text
content/        Conteúdo em Markdown e bundles de posts
layouts/        Templates, partials e shortcodes Hugo
i18n/           Traduções da interface
static/          JavaScript e imagens estáticas
tests/           Testes de conteúdo e Playwright
docs/            Base de conhecimento do projeto em Open Knowledge Format
AGENTS.md        Instruções de trabalho para agentes
```

Posts ficam em `content/posts/<slug>/`, com `index.pt.md` e, quando houver tradução, `index.en.md`. Ativos específicos do post devem ficar no mesmo bundle.

## Documentação e agentes

A documentação do projeto é um bundle [Open Knowledge Format (OKF)](https://github.com/GoogleCloudPlatform/open-knowledge-format): Markdown versionado com frontmatter YAML para leitura humana e por agentes. Comece por [docs/index.md](docs/index.md).

As convenções operacionais para agentes — arquitetura Hugo, localização, validações e limites de edição — estão em [AGENTS.md](AGENTS.md).

## Deploy

A hospedagem usa Vercel com Hugo `0.92.2`, conforme [`vercel.json`](vercel.json). Revise o diff antes de executar `make deploy`: o alvo faz build, commit e push de todas as mudanças no repositório.
