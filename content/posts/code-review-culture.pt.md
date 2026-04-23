---
language: "pt"
title: "Cultura de Code Review"
date: 2025-01-05
draft: false
category: "Práticas"
tags: ["Code Review", "Cultura", "Colaboração"]
subtitle: "Tornando o feedback construtivo e crescimento mútuo"
description: "Tornando o feedback construtivo e crescimento mútuo"
author: "Hallison"
author_role: "Developer"
topics: ["Code Review", "Práticas", "Cultura de Engenharia"]
---

Code review não é sobre encontrar erros. É sobre distribuir conhecimento, manter padrões e melhorar coletivamente.

## Code Review Como Educação

Cada revisão é uma oportunidade de ensinar e aprender. O revisor aprende sobre novos padrões do código que está vendo. O autor aprende da perspectiva do revisor.

```javascript
// Antes: funcionava, mas
function getUserData(id) {
  return database.query('SELECT * FROM users WHERE id = ?', [id]);
}

// Melhor: mais seguro e legível
async function getUserData(userId: string): Promise<User> {
  return database.query(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [userId]
  );
}
```

A revisão bem feita explica *por quê* é melhor, não apenas que é melhor.

## Feedback Construtivo

Crítica sem sugestões é apenas reclamação. Bom feedback inclui:

- O que está certo
- O que pode melhorar
- Como melhorar
- Por quê essa abordagem é melhor

## Pull Requests Pequenos são Mais Fáceis de Revisar

Um PR de 50 linhas é revisto completamente. Um PR de 500 linhas é parcialmente revisto (ou pior, aprovado sem revisar).

Mantenha PRs focados:
- Uma feature por PR
- Uma correção por PR
- Uma refatoração por PR

## Linting e Automação

Não revise formatação. Use ferramentas automatizadas para:
- Formatação de código
- Regras de linting
- Type checking
- Testes

Seu feedback humano é precioso—use-o para lógica e arquitetura.

## Conclusão

Uma cultura de code review forte não é sobre ser crítico. É sobre ser coletivamente responsável pela qualidade e manutenibilidade do código.
