---
language: "en"
title: "Testing Strategies for Real Projects"
date: 2025-01-05
draft: false
category: "Engineering"
tags: ["Testing", "Quality", "Best Practices"]
subtitle: "Moving beyond 100% coverage"
description: "Moving beyond 100% coverage"
author: "Hallison"
author_role: "Developer"
topics: ["Testing", "Quality", "Practices"]
---

The obsession with test coverage percentages misses the point. A test suite should catch regressions and give you confidence to refactor.

## The Testing Pyramid

Think in layers:

1. **Unit tests** (bottom): Test individual functions. Fast, many of them.
2. **Integration tests** (middle): Test components working together. Moderate speed, moderate count.
3. **E2E tests** (top): Test the full user flow. Slow, fewer of them.

Don't flip this pyramid. Too many E2E tests? Your CI becomes slow.

## What to Test

Ask yourself: "Would I feel confident shipping without this test?"

- **Business logic**: Always test core features
- **Edge cases**: Off-by-one errors, null values, empty lists
- **Error handling**: Does it fail gracefully?
- **UI interactions**: Only critical paths need E2E tests

Skip:
- Tests for framework features (React rendering, etc.)
- Tests that only check implementation details
- Trivial getters/setters

## Testing Tools

Modern testing doesn't require a PhD:

- **Jest**: Unit testing
- **Vitest**: Faster unit testing
- **Playwright**: E2E testing
- **React Testing Library**: Component testing (test behavior, not implementation)

## Conclusion

Write tests that matter. Build confidence. Sleep well.
