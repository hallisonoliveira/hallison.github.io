---
language: "en"
title: "State Management Doesn't Have to Be Complex"
date: 2024-12-12
draft: false
category: "Frontend"
tags: ["React", "State", "Architecture"]
subtitle: "When you need Redux and when you don't"
description: "When you need Redux and when you don't"
author: "Hallison"
author_role: "Developer"
topics: ["State", "React", "Architecture"]
---

Every team eventually asks: "Should we use Redux?" The answer is usually "no."

## Start Simple

React has built-in tools for state:

```javascript
const [count, setCount] = useState(0);
const [user, setUser] = useContext(UserContext);
```

This covers most use cases. You don't need Redux for this.

## When Complexity Grows

As your app grows, you might need:

- Shared state across many components
- Time-travel debugging
- Middleware for side effects
- Persistent state across reloads

Now Redux (or similar) makes sense.

## Modern Alternatives

The landscape has changed:

- **Zustand**: Minimal, easy to learn
- **Jotai**: Atomic state
- **TanStack Query**: For server state (don't put API data in Redux)
- **Valtio**: Proxy-based simplicity

```javascript
// Zustand example: clean and simple
import create from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## The Real Problem Redux Solves

Not the state itself—it's the ability to debug state changes. If you don't need that, you don't need Redux.

## Conclusion

Resist the urge to add Redux on day one. Let complexity emerge naturally, then solve it.
