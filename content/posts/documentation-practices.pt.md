---
language: "pt"
title: "Práticas de Documentação"
date: 2025-01-12
draft: false
category: "Práticas"
tags: ["Documentação", "Comunicação", "Manutenibilidade"]
subtitle: "Escrevendo documentação que pessoas realmente leem"
description: "Escrevendo documentação que pessoas realmente leem"
author: "Hallison"
author_role: "Developer"
topics: ["Documentação", "Comunicação", "Práticas"]
---

Documentação ruim é pior que nenhuma documentação. Documentação desatualizada causa bugs. Documentação clara economiza horas de depuração.

## Documente a Intenção, Não a Implementação

```javascript
// Ruim: o que o código faz é óbvio
// Incrementa i
i++;

// Melhor: por quê?
// Nós processamos elementos em pares, então pulamos para o próximo par
i += 2;
```

Leia o código para entender *como*. Leia comentários para entender *por quê*.

## README Como Porta de Entrada

Um bom README responde:

- O que é esse projeto?
- Como eu o instalo/uso?
- Como eu contribuo?
- Onde eu consigo ajuda?

## API Documentation Should Be Examples First

```javascript
// Antes: abstrato
// getUserById(id: string): Promise<User>

// Depois: concreto
/**
 * Fetch a user by their ID
 * 
 * @example
 * const user = await getUserById('user-123');
 * console.log(user.name); // "John"
 * 
 * @param id - The user's unique identifier
 * @returns The user object or null if not found
 */
async function getUserById(id: string): Promise<User | null> {
```

## Mantenha Docs Próximo ao Código

Documentação no repositório fica desatualizada. Documentação no código fica com o código.

Use JSDoc, docstrings, ou comentários estruturados que possam ser extraídos.

## Conclusão

Boa documentação é um investimento que paga dividendos por anos. Má documentação é débito técnico que deteriora.
