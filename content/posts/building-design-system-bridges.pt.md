---
language: "pt"
title: "Construindo Pontes de Design System"
date: 2024-11-10
draft: false
category: "Design Systems"
tags: ["Design Systems", "Colaboração", "Frontend"]
subtitle: "Conectando design e desenvolvimento"
description: "Conectando design e desenvolvimento"
author: "Hallison"
author_role: "Developer"
topics: ["Design Systems", "Design", "Desenvolvimento"]
---

A maior lacuna em design systems é entre designers e desenvolvedores. Um bom design system é uma ponte, não uma parede.

## O Problema

Designers criam em Figma. Developers implementam em código. Algo se perde na tradução.

- Designers não conhecem limitações técnicas
- Developers não entendem decisões de design
- Especificações ficam desatualizadas rapidamente

## Usando Tokens Efetivamente

Tokens não são apenas números. Eles são a linguagem compartilhada.

```javascript
// design-tokens.js
export const tokens = {
  color: {
    primary: '#440001',
    surface: '#f9f9f9',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
  },
  typography: {
    body: { fontSize: '16px', lineHeight: '1.5' },
  },
};

// Componentes usam tokens
const Button = styled.button`
  color: ${tokens.color.primary};
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
`;
```

Quando um token muda, tudo muda automaticamente.

## Documentação Viva

A melhor documentação é código que executa:

```javascript
// Button.stories.js (Storybook)
export default {
  title: 'Button',
  component: Button,
};

export const Primary = () => <Button variant="primary">Click me</Button>;
export const Secondary = () => <Button variant="secondary">Click me</Button>;
```

Storybook, Zeroheight, ou Chromatic documentam componentes enquanto eles estão sendo desenvolvidos.

## Colaboração em Componentes

1. Designer cria no Figma
2. Developer implementa com tokens
3. Designer valida em Storybook
4. Ambos ajustam conforme necessário

O ciclo é curto e colaborativo.

## Conclusão

Design systems que ligam design e desenvolvimento não se quebram. Eles evoluem.
