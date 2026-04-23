---
language: "pt"
title: "Um Git Workflow que Funciona"
date: 2024-11-20
draft: false
category: "Práticas"
tags: ["Git", "Workflow", "Produtividade"]
subtitle: "Mantendo o histórico limpo e legível"
description: "Mantendo o histórico limpo e legível"
author: "Hallison"
author_role: "Developer"
topics: ["Git", "Workflow", "Práticas"]
---

Os workflows de Git variam, mas os princípios permanecem: tornar fácil entender o que mudou e por quê.

## As Mensagens de Commit Importam

```bash
# Ruim
git commit -m "fix"
git commit -m "updates"
git commit -m "stuff"

# Bom
git commit -m "feat: add user authentication"
git commit -m "fix: prevent double-submit on form"
git commit -m "docs: update API endpoint examples"
```

Uma mensagem clara ajuda todos (incluindo você no futuro) a entender a mudança.

## Conventional Commits

- `feat:` Nova feature
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação (não lógica)
- `refactor:` Reestruturação de código
- `test:` Mudanças em testes
- `chore:` Build, dependências

## Estratégia de Branching

Abordagem simples:
- `main`: Código pronto para produção
- `develop`: Branch de integração
- `feature/xyz`: Branches de features
- `bugfix/xyz`: Correções de bugs

Mantenha branches de curta duração (alguns dias no máximo).

## Processo de Pull Request

1. Criar branch de feature
2. Fazer commits com mensagens claras
3. Abrir PR com descrição
4. Obter aprovação
5. Fazer merge quando aprovado
6. Deletar branch

```bash
# Mantenha commits limpos antes de fazer merge
git rebase -i main  # squash fixup commits
git push --force-with-lease
```

## Merge vs Rebase

- **Merge**: Preserva histórico, cria merge commit
- **Rebase**: Histórico linear, mais limpo mas reescreve commits

Escolha um e seja consistente com seu time.

## Conclusão

Um histórico de Git limpo é invisível mas inestimável quando debugando.
