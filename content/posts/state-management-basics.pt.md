---
language: "pt"
title: "Básicos de State Management"
date: 2024-12-05
draft: false
category: "Frontend"
tags: ["State Management", "React", "Arquitetura"]
subtitle: "Pensando sobre estado antes de escolher ferramentas"
description: "Pensando sobre estado antes de escolher ferramentas"
author: "Hallison"
author_role: "Developer"
topics: ["State Management", "Frontend", "Arquitetura"]
---

State management é frequentemente o primeiro passo para complexidade desnecessária. Mas sem uma estratégia clara, seu estado cresce de forma caótica.

## Comece Sem Bibliotecas

Muitos projetos iniciam com Redux, Zustand ou Context. Na verdade:

```javascript
// Simples: state no componente
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  );
}
```

Muitas vezes, isso é suficiente.

## State Local vs Global

- **State Local**: Vive em um componente (useState)
- **State Global**: Compartilhado entre muitos componentes

```javascript
// Global: múltiplos componentes precisa saber sobre o usuário
<UserProvider>
  <Header /> {/* Precisa do usuário */}
  <Content /> {/* Precisa do usuário */}
  <Footer /> {/* Precisa do usuário */}
</UserProvider>
```

## Levantando State

Quando múltiplos componentes irmãos precisam compartilhar estado, levante para o pai:

```javascript
function App() {
  const [user, setUser] = useState(null);
  
  return (
    <>
      <Header user={user} />
      <Content user={user} setUser={setUser} />
    </>
  );
}
```

Se isso fica muito aninhado, considere Context ou state management.

## Quando Você Precisa de Uma Biblioteca

- Muitos componentes precisam do mesmo estado
- State é complexo (muitas ações interdependentes)
- Você precisa persistir estado
- Você precisa de DevTools para debugging

## Conclusão

Escolha a solução mais simples que funciona. State management é um detalhe de implementação, não o ponto inicial.
