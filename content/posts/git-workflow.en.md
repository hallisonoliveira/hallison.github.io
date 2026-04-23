---
language: "en"
title: "A Git Workflow That Works"
date: 2024-11-20
draft: false
category: "Practices"
tags: ["Git", "Workflow", "Productivity"]
subtitle: "Keeping history clean and readable"
description: "Keeping history clean and readable"
author: "Hallison"
author_role: "Developer"
topics: ["Git", "Workflow", "Practices"]
---

Git workflows vary, but the principles remain: make it easy to understand what changed and why.

## Commit Messages Matter

```bash
# Bad
git commit -m "fix"
git commit -m "updates"
git commit -m "stuff"

# Good
git commit -m "feat: add user authentication"
git commit -m "fix: prevent double-submit on form"
git commit -m "docs: update API endpoint examples"
```

A clear message helps everyone (including future you) understand the change.

## Conventional Commits

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting (not logic)
- `refactor:` Code restructure
- `test:` Test changes
- `chore:` Build, dependencies

## Branching Strategy

Simple approach:
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/xyz`: Feature branches
- `bugfix/xyz`: Bug fixes

Keep branches short-lived (a few days max).

## Pull Request Process

1. Create feature branch
2. Commit with clear messages
3. Open PR with description
4. Get reviewed
5. Merge when approved
6. Delete branch

```bash
# Keep commits clean before merging
git rebase -i main  # squash fixup commits
git push --force-with-lease
```

## Merging vs Rebasing

- **Merge**: Preserves history, creates merge commit
- **Rebase**: Linear history, cleaner but rewrites commits

Pick one and be consistent across your team.

## Conclusion

Clean git history is invisible but invaluable when debugging.
