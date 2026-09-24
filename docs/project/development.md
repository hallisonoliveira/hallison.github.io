---
type: Development Workflow
title: Desenvolvimento e qualidade
description: Ambiente local, validações de conteúdo e testes automatizados do projeto.
tags: [hugo, nodejs, playwright, testing, quality]
status: stable
sources:
  - resource: ../../package.json
    title: Scripts npm e dependências
  - resource: ../../Makefile
    title: Atalhos de desenvolvimento e validação
  - resource: ../../scripts/validate-build.sh
    title: Verificação do build Hugo
  - resource: ../../playwright.config.js
    title: Configuração dos testes E2E
---

# Pré-requisitos

O projeto usa Hugo e Node.js. Os testes end-to-end usam Playwright. Em Windows, `npm run hugo:server` chama o binário Hugo pelo WSL em `/snap/bin/hugo`; confirme esse pré-requisito antes de diagnosticar uma falha de servidor de testes.

# Comandos

| Comando | Finalidade |
| --- | --- |
| `make dev` | servidor Hugo local com hot reload |
| `npm run validate:i18n` | compara as chaves em `i18n/pt.yaml` e `i18n/en.yaml` |
| `npm run validate:content` | valida o frontmatter dos posts |
| `npm run test:content` | roda os testes de conteúdo |
| `npm run test:build` | gera o site e falha para traduções ausentes |
| `npm run test:e2e` | roda os testes Playwright |
| `make check` | executa as validações sem E2E |
| `make test` | executa validações, testes de conteúdo e E2E |

# Critérios de validação

Escolha a menor verificação proporcional ao risco da mudança. Alterações em catálogos ou templates que chamam `i18n` exigem a validação de i18n; mudanças editoriais exigem a validação de conteúdo; templates e comportamento de interface devem incluir build e os testes E2E relevantes.

Não edite `public/`, `resources/`, `.hugo_build.lock` ou `build.log` como se fossem arquivos-fonte. Eles são produzidos ou usados durante o build.
