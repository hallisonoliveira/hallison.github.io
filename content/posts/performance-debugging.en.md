---
language: "en"
title: "Performance Debugging: A Practical Guide"
date: 2024-12-20
draft: false
category: "Engineering"
tags: ["Performance", "Debugging", "Optimization"]
subtitle: "Finding and fixing the bottlenecks"
description: "Finding and fixing the bottlenecks"
author: "Hallison"
author_role: "Developer"
topics: ["Performance", "Debugging", "Tools"]
---

Performance problems are invisible until you measure them. And measuring wrong gives you false solutions.

## Measure First

Don't guess where the problem is:

- **DevTools Performance tab**: Record user interactions, see the flame chart
- **Lighthouse**: Scores your entire site
- **Web Vitals**: LCP, FID, CLS—the metrics that matter for UX
- **Profiling tools**: Chrome DevTools for CPU, Network tab for loading

## Common Culprits

### Rendering

```javascript
// Bad: forces layout recalculation
element.style.width = '100px';
console.log(element.offsetWidth); // triggers layout
element.style.width = '200px';

// Good: batch DOM changes
element.style.width = '100px';
// don't read offsetWidth between changes
element.style.width = '200px';
```

### Bundle Size

Too much JavaScript shipped to the browser. Solutions:
- Code splitting: Load routes only when needed
- Tree shaking: Remove unused code
- Lazy loading: Defer non-critical imports

### Network

Loading images that are way too large, or too many requests:

```javascript
// Use optimized image formats (WebP, AVIF)
// Lazy load images below the fold
<img loading="lazy" src="..." />
```

## Tools That Help

- **Webpack Bundle Analyzer**: See what's in your bundle
- **React DevTools Profiler**: Where is React spending time?
- **Lighthouse**: Automated site audit

## Conclusion

Measure, identify the real bottleneck, fix it. Don't micro-optimize prematurely.
