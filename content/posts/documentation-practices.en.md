---
language: "en"
title: "Documentation That Developers Actually Read"
date: 2024-11-12
draft: false
category: "Practices"
tags: ["Documentation", "Communication", "Best Practices"]
subtitle: "Writing docs people will use"
description: "Writing docs people will use"
author: "Hallison"
author_role: "Developer"
topics: ["Documentation", "Communication", "Practices"]
---

Most documentation is written once and never updated. It becomes outdated and useless. But documentation doesn't have to be like that.

## The Problem with Traditional Docs

- 50 pages in a wiki nobody navigates
- Outdated examples that don't work
- Missing real-world context
- No guidance on *why* things are the way they are

## Documentation That Works

**Keep it close to the code:**

```javascript
// At the top of your function
/**
 * Calculates user score based on activity metrics.
 * 
 * Weights:
 * - posts: 10 points each
 * - comments: 2 points each
 * - reactions: 0.5 points each
 * 
 * Why this weighting? Posts require more effort.
 */
function calculateScore(user) {
  // ...
}
```

**Write for different audiences:**

- **Setup instructions**: For new developers
- **Architecture decisions**: For people modifying systems
- **Examples**: Real code that works
- **Troubleshooting**: Common problems and solutions

## READMEs That Matter

Every project should have a README that answers:

1. What is this?
2. How do I set it up?
3. How do I run it?
4. Where do I look for [common task]?
5. What are the gotchas?

That's often enough.

## Keeping Docs Updated

- Docs in the repo, with the code
- Update docs in the same PR as code changes
- Link from comments to relevant docs
- If a doc becomes a lie, fix it or delete it

## Conclusion

Good documentation saves hours. But only if it's kept alive.
