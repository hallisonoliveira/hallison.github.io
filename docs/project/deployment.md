---
type: Deployment Configuration
title: Entrega e hospedagem
description: Configuração de build e artefatos de publicação do site Hugo.
tags: [hugo, vercel, deployment, build]
status: stable
sources:
  - resource: ../../vercel.json
    title: Configuração de build da Vercel
  - resource: ../../Makefile
    title: Comandos de build e deploy
  - resource: ../../scripts/validate-build.sh
    title: Validação da saída de produção
---

# Build

O comando `hugo` gera a saída estática em `public/`. O script `npm run test:build` executa o Hugo com avisos de internacionalização e confirma que a saída inclui a página inicial padrão, a página inicial em inglês e o sitemap.

# Hospedagem

`vercel.json` fixa o Hugo `0.92.2` para o ambiente de build da Vercel. Ao usar funcionalidades de Hugo mais recentes, alinhe essa versão antes de depender delas em produção.

# Publicação manual

O alvo `make deploy` executa o build e, em seguida, adiciona todos os arquivos, cria um commit e envia ao remoto. Como isso pode incluir alterações não relacionadas, revise o status e o diff antes de usá-lo. A automação de deploy não substitui as validações descritas em [Desenvolvimento e qualidade](development.md).
