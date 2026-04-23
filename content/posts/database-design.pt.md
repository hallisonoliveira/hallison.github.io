---
language: "pt"
title: "Design de Banco de Dados"
date: 2025-01-08
draft: false
category: "Engenharia"
tags: ["Banco de Dados", "Design", "Arquitetura"]
subtitle: "Estruturando dados para crescimento e performance"
description: "Estruturando dados para crescimento e performance"
author: "Hallison"
author_role: "Developer"
topics: ["Banco de Dados", "Design", "Escalabilidade"]
---

O design de banco de dados determina se sua aplicação escala ou se quebra sob carga. Decisões iniciais terão impacto por anos.

## Normalização vs Desnormalização

Normalização remove redundância. Desnormalização adiciona redundância para performance.

A resposta correta é: ambas.

```sql
-- Normalizado: tabelas separadas
CREATE TABLE users (id INT, name VARCHAR(255));
CREATE TABLE orders (id INT, user_id INT, total DECIMAL);

-- Query: requer JOIN
SELECT u.name, COUNT(o.id) 
FROM users u 
LEFT JOIN orders o ON u.id = o.user_id 
GROUP BY u.id;

-- Desnormalizado: cache na tabela users
ALTER TABLE users ADD COLUMN order_count INT;
-- Query: rápido, sem JOIN
SELECT name, order_count FROM users;
```

Use normalização como base. Desnormalize onde performance importa.

## Índices São Críticos

Sem índices corretos, qualquer query pode ficar lenta com crescimento de dados.

```sql
-- Ruim: vai fazer full table scan em 1 milhão de linhas
SELECT * FROM users WHERE email = 'user@example.com';

-- Melhor: índice garante lookup rápido
CREATE INDEX idx_users_email ON users(email);
```

Mas não indexe tudo—cada índice que você adiciona desacelera writes.

## Schema Versionamento

Seu schema mudará. Tenha um processo:

1. Nova migração para cada mudança
2. Migrations são versionadas
3. Rollbacks devem ser possíveis
4. Migrations devem ser testadas

## Conclusão

Bom design de banco de dados é invisível. Você só nota quando está ruim.
