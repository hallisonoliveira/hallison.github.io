---
language: "pt"
title: "A Arquitetura de Design Systems: Além de Tokens"
date: 2024-10-24
draft: false
category: "Engenharia"
image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDZhRVmiZom4GLgAay3Mgv0og3jtaZejF3jTCSUajwB-Q8aIb9CKviVdhGt0Kepu-rGbOip_kAHuSWw4Aq-MItxC1f7B-KSj9T49diXyqMnryKU_BbhkRBvTpXHqQqdxwmf92FHGunjHMDeIRMFG_B-mqwjX658PrI9NRyklzkHEolu3qJOPYq_aCdaNPJCuvXhw21fTreFBsKFz0eyNAWP_oHGUJJbidYGn6Wkospxv_FsSXufEIWfe__KlaI4d_LjqBxRY_SBs2a"
tags: ["Sistemas", "React", "Teorias"]
subtitle: "Além de Tokens"
description: "Além de Tokens"
author: "Adrian Thorne"
author_role: "Principal Architect"
topics: ["Sistemas", "Scale", "UI Logic"]
---

Construir um design system é frequentemente reduzido a um conjunto de cores e escalas tipográficas. No entanto, o verdadeiro rigor intelectual reside no tecido conectivo—a lógica que define como componentes reagem a estado, contexto e ambiente.

## O Problema com Abordagens Token-First

Muitas organizações começam sua jornada de design system criando uma lista exaustiva de design tokens. Embora tokens sejam importantes, eles representam apenas o *vocabulário* de um design system, não sua *gramática*.

Quando você se concentra apenas em tokens, você perde a oportunidade de codificar:

- **Padrões de interação** entre componentes
- **Comportamento consciente de contexto** (como componentes respondem ao seu ambiente)
- **Relações hierárquicas** entre elementos visuais

## Além de Cores e Tipografia

Um design system maduro deve abordar a **gestão de estado** de seus componentes. Isso inclui:

1. **Estados de interação** (hover, focus, active, disabled)
2. **Estados de dados** (loading, error, empty, success)
3. **Estados contextuais** (selected, highlighted, grouped)

## O Princípio da Tela Respirante

Defendemos a mudança tonal e limites suaves em vez de divisões ásperas. Em vez de confiar em linhas de divisor para separar seções, use **progressão tonal** através da hierarquia de surface-container:

- `surface` (#F9F9F9) - Base
- `surface-container-low` (#F3F3F3) - Elevação sutil
- `surface-container` (#EEEEEE) - Elevação média
- `surface-container-high` (#E8E8E8) - Elevação forte

Isso cria uma sensação de profundidade visual sem recorrer a sombras ou bordas.

## CSS Custom Properties como Lógica do Sistema

Usar CSS Custom Properties (variáveis CSS) permite que você codifique não apenas *valores*, mas *relacionamentos*:

```css
:root {
  /* Paleta primária */
  --color-primary: #440001;
  --color-primary-container: #680a08;
  
  /* Estados derivados */
  --color-primary-hover: color-mix(in srgb, var(--color-primary) 80%, white);
  --color-primary-disabled: color-mix(in srgb, var(--color-primary) 40%, #ccc);
}
```

Essa abordagem garante que quando você muda uma cor primária, todos os estados derivados são atualizados automaticamente.

## Divisão Estrita Leva a UIs Rígidas

Quando você reforça limites visuais estritos entre componentes, você inevitavelmente cria interfaces rígidas e inflexíveis. Uma abordagem melhor é abraçar **bordas suaves** e **adaptação contextual**.

Em vez de definir um componente de card com styling fixo, defina como um componente se adapta ao nível de surface do seu container:

- Em `surface-container-low`, use ênfase visual mínima
- Em `surface-container-high`, aumente o contraste ligeiramente
- Em `surface-bright`, adicione elevação sutil

## Conclusão

Um design system que transcende tokens e aborda as questões estruturais mais profundas do comportamento do componente e relações hierárquicas servirá sua organização muito melhor do que um que meramente cataloga cores e tipografia.

O objetivo não é apenas manter consistência—é criar um sistema que cresce com seu produto mantendo seus princípios fundamentais.
