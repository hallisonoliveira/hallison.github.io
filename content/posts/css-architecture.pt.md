---
language: "pt"
title: "Arquitetura CSS"
date: 2024-12-10
draft: false
category: "Frontend"
tags: ["CSS", "Arquitetura", "Design"]
subtitle: "Organizando estilos para escala"
description: "Organizando estilos para escala"
author: "Hallison"
author_role: "Developer"
topics: ["CSS", "Arquitetura", "Frontend"]
---

CSS cresce de forma caótica. Sem organização, você acaba com especificidade em guerra e estilos globais conflitantes.

## Evite Seletores Globais

```css
/* Ruim: afeta todo h1 na página */
h1 {
  color: blue;
}

/* Melhor: escopo específico */
.article-title {
  color: blue;
}
```

Seletores globais parecem eficientes no início, mas se tornam armadilhas.

## CSS-in-JS ou Utility Classes

Existem várias abordagens que funcionam:

- **CSS Modules**: Escopos CSS automáticos
- **BEM**: Convenção de naming para evitar conflitos
- **Utility Classes**: Tailwind, classes pequenas e reutilizáveis
- **CSS-in-JS**: Estilos dentro do JavaScript

Escolha uma e seja consistente.

## Variáveis CSS para Temas

```css
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --spacing-unit: 8px;
}

.button {
  background: var(--color-primary);
  padding: calc(var(--spacing-unit) * 2);
}
```

Variáveis permitem temas coerentes e fáceis de manter.

## Performance Importa

Remova CSS não utilizado. Minifique. Use CSS crítico inline.

```html
<!-- Ruim: bloqueia renderização -->
<link rel="stylesheet" href="huge-framework.css">

<!-- Melhor: CSS crítico inline, resto defer -->
<style>
  /* CSS crítico */
</style>
<link rel="preload" href="non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

## Conclusão

Boa arquitetura CSS é invisível. Você não pensa sobre conflitos—você apenas escreve componentes.
