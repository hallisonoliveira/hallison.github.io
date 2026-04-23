---
language: "pt"
title: "A Geometria do Lifecycle de Componentes"
date: 2024-11-30
draft: false
category: "Frontend"
tags: ["React", "Lifecycle", "Padrões"]
subtitle: "Entendendo quando o código executa"
description: "Entendendo quando o código executa"
author: "Hallison"
author_role: "Developer"
topics: ["React", "Lifecycle", "Padrões"]
---

Componentes têm um ciclo de vida: criados, renderizados, atualizados, destruídos. Entender esse ciclo separa bons código React de tudo mais.

## O Ciclo Básico

```javascript
// 1. Componente é criado
function MyComponent({ id }) {
  // 2. Setup (não pode usar hooks depois disso)
  
  // 3. Efeitos rodam (setup subscriptions, fetch)
  useEffect(() => {
    console.log('Mounted or id changed');
    return () => console.log('Cleanup');
  }, [id]);
  
  // 4. Render (deve ser puro!)
  return <div>{id}</div>;
}
// 5. Componente é desmontado ou props mudam
```

## useEffect Timing

```javascript
// Roda após cada render
useEffect(() => {
  console.log('After every render');
});

// Roda apenas na montagem
useEffect(() => {
  console.log('Only on mount');
}, []);

// Roda quando 'id' muda
useEffect(() => {
  console.log('After id changed');
}, [id]);
```

## Cleanup é Crítico

```javascript
useEffect(() => {
  const subscription = api.subscribe(id, (data) => {
    setData(data);
  });
  
  // Cleanup: previne memory leaks
  return () => subscription.unsubscribe();
}, [id]);
```

Sem cleanup, subscriptions se acumulam e sua app fica lenta.

## Render Deve Ser Puro

```javascript
// Ruim: side effects durante render
function MyComponent() {
  api.fetch('/data'); // Rodará múltiplas vezes!
  return <div>{data}</div>;
}

// Melhor: side effects em useEffect
function MyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    api.fetch('/data').then(setData);
  }, []);
  
  return <div>{data}</div>;
}
```

## Conclusão

O ciclo de vida não é mágica. É uma sequência previsível. Entenda-o e seu código React se torna muito mais fácil.
