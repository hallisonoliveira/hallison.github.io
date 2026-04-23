---
language: "pt"
title: "Estratégias de Testing"
date: 2024-12-20
draft: false
category: "Práticas"
tags: ["Testing", "QA", "Qualidade"]
subtitle: "Testando o que importa, não tudo"
description: "Testando o que importa, não tudo"
author: "Hallison"
author_role: "Developer"
topics: ["Testing", "Qualidade", "Práticas"]
---

Cobertura de teste de 100% não significa código confiável. Testes ruins dão falsa confiança. A estratégia importa mais que o número.

## A Pirâmide de Testes

```
        E2E (UI)
      Integration
    Unit
```

- **Testes Unitários**: Rápidos, cobrem lógica pura
- **Testes de Integração**: Testam componentes juntos
- **Testes E2E**: Testam o fluxo completo do usuário

Tenha muitos testes unitários, alguns de integração, poucos E2E.

## Teste o Comportamento, Não a Implementação

```javascript
// Ruim: dependente da implementação
it('calls setState', () => {
  expect(setState).toHaveBeenCalled();
});

// Melhor: testa comportamento observável
it('displays success message when form is submitted', () => {
  render(<Form />);
  userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

Se a implementação muda mas o comportamento é o mesmo, o teste deveria passar.

## Não Teste Implementações Detalhes de Bibliotecas

```javascript
// Ruim: testa implementação interna
it('creates a new instance of Modal', () => {
  expect(Modal).toHaveBeenCalled();
});

// Melhor: testa o que o usuário vê
it('displays a modal dialog', () => {
  render(<App />);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

## Testes Devem Ser Legíveis

Um teste é documentação que executa. Se é confuso de ler, é confuso de manter.

```javascript
// Ruim: o que isso está testando?
expect(fn(a, b, { x: true, y: false })).toEqual([1, 2, 3]);

// Melhor: claro e explicativo
const result = calculateUserScore(baseScore, multiplier, { 
  includeBonus: true, 
  includePenalty: false 
});

expect(result).toEqual([baseScore, multiplier, bonusPoints]);
```

## Conclusão

Bons testes dão confiança. Testes ruins dão falsa confiança. Escolha qual você quer.
