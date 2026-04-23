---
language: "en"
title: "Database Design Fundamentals"
date: 2024-11-28
draft: false
category: "Backend"
tags: ["Database", "SQL", "Design"]
subtitle: "Getting the schema right from the start"
description: "Getting the schema right from the start"
author: "Hallison"
author_role: "Developer"
topics: ["Database", "Design", "Backend"]
---

Your database schema is the foundation. Get it wrong, and refactoring becomes painful.

## Normalization Matters

Normalize to avoid redundancy and anomalies:

```sql
-- Bad: redundant data
CREATE TABLE orders (
  id INT,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_city VARCHAR(255),
  product_name VARCHAR(255)
);

-- Better: separate tables
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  city VARCHAR(255)
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT FOREIGN KEY,
  product_id INT FOREIGN KEY
);
```

The rule: A fact should live in exactly one place.

## Indexes Speed Up Queries

```sql
-- Slow query
SELECT * FROM orders WHERE customer_id = 123;

-- Add an index
CREATE INDEX idx_orders_customer ON orders(customer_id);
```

Now the query is fast. But don't index everything—indexes slow down inserts.

## Types Matter

```sql
-- Don't use VARCHAR for everything
email VARCHAR(255),  -- Good
created_at TIMESTAMP,  -- Good
is_active BOOLEAN,  -- Good (not 0/1)
amount DECIMAL(10,2),  -- Good (not FLOAT for money)
```

## Constraints Prevent Bad Data

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INT CHECK (age >= 0)
);
```

Constraints push validation to the database—the single source of truth.

## Conclusion

Spend time on schema design. It's cheap to fix now, expensive later.
