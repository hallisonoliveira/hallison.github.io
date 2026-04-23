---
language: "pt"
title: "Princípios de Design de API que Escalam"
date: 2025-01-10
draft: false
category: "Engenharia"
tags: ["API", "Design", "REST"]
subtitle: "Construindo APIs que as pessoas querem usar"
description: "Construindo APIs que as pessoas querem usar"
author: "Hallison"
author_role: "Developer"
topics: ["API", "Design", "Scale"]
---

Uma API é um contrato entre seu serviço e o mundo exterior. Uma boa API deixa esse contrato claro e prazeroso de trabalhar.

## Consistência é Fundamental

Sua API deve parecer coesa. Se um endpoint retorna erros como `404`, não retorne como `error: true` em outro endpoint.

- Use códigos de status HTTP consistentes
- Use formatos de resposta de erro consistentes
- Use convenções de nomeação consistentes

```json
// Bom: formato de erro consistente
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "O usuário solicitado não existe"
  }
}
```

## Estratégia de Versionamento

Não ignore a compatibilidade retroativa. Se você mudar sua API, clientes existentes quebram.

Opções:
- **Versionamento por URL**: `/api/v1/users`
- **Versionamento por Header**: `API-Version: 1.0`
- **Query parameter**: `?version=1`

Escolha um e mantenha-se consistente.

## Documentação Sobre Suposições

A documentação da sua API deve ser tão clara que um desenvolvedor possa usá-la sem adivinhar.

- Documente cada endpoint
- Mostre exemplos de request/response
- Explique códigos de erro
- Forneça SDKs se possível

## Conclusão

Ótimas APIs são APIs chatas. Fazem o que dizem que fazem, previsível e consistentemente.
