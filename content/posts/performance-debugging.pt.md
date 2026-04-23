---
language: "pt"
title: "Debug de Performance"
date: 2024-12-15
draft: false
category: "Engenharia"
tags: ["Performance", "Debug", "Otimização"]
subtitle: "Encontrando gargalos antes que se tornem problemas"
description: "Encontrando gargalos antes que se tornem problemas"
author: "Hallison"
author_role: "Developer"
topics: ["Performance", "Debug", "Ferramentas"]
---

Performance não é sobre intuição. É sobre medição, identificação de gargalos e otimização focada.

## Sempre Meça Primeiro

```javascript
// Ruim: adivinhar
// "Acho que essa função é lenta"

// Bom: medir
console.time('processData');
processData();
console.timeEnd('processData');
// processData: 125.5ms

// Melhor: profiling detalhado
// Use browser DevTools, Node.js profiler, ou APM tools
```

Você não pode otimizar o que não mede.

## Comum Culpados

1. **Loops aninhados**: O(n²) vs O(n)
2. **N+1 queries**: Uma query faz 100 queries
3. **Memória**: Vazamentos, estruturas grandes demais
4. **Rede**: Requisições desnecessárias
5. **Renderização**: Reflows/repaints desnecessários

## Otimizando Sem Medir é Guesswork

```javascript
// Você poderia otimizar tudo isso
function process(items) {
  let result = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items[i].subitems.length; j++) {
      // ... processamento
    }
  }
  return result;
}

// Mas meça primeiro! Talvez o gargalo real seja aqui
function fetchData(id) {
  for (let i = 0; i < 100; i++) {
    // Fazendo 100 requisições de rede em sequência!
    api.fetch('/endpoint/' + i);
  }
}
```

## Cache Quando Apropriado

Memorização funciona se o padrão de acesso é previsível:

```javascript
const cache = new Map();

function expensiveComputation(input) {
  if (cache.has(input)) {
    return cache.get(input);
  }
  
  const result = doHeavyWork(input);
  cache.set(input, result);
  return result;
}
```

## Conclusão

Código rápido vem de medição e entendimento. Código lento vem de otimizações adivinhadas.
