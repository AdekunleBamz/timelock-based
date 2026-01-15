# Performance Optimization Guide

## Overview

This guide covers performance optimization strategies for the Timelock Vault application.

## Bundle Size Optimization

### 1. Analyze Bundle

```bash
# Build with analysis
npm run build -- --mode=analyze

# Or use rollup-plugin-visualizer
npm install -D rollup-plugin-visualizer
```

### 2. Code Splitting

Vite automatically splits code. Optimize further:

```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Vault = lazy(() => import('./pages/Vault'));

// Lazy load heavy components
const Chart = lazy(() => import('./components/Chart'));
```

### 3. Tree Shaking

```typescript
// ✅ Good - imports only what's needed
import { formatEther } from './utils/formatters';

// ❌ Bad - imports everything
import * as formatters from './utils/formatters';
```

### 4. Remove Unused Dependencies

```bash
# Find unused dependencies
npx depcheck

# Remove them
npm uninstall unused-package
```

## Runtime Performance

### 1. Memoization

```typescript
import { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const sortedDeposits = useMemo(() => {
  return deposits.sort((a, b) => b.amount - a.amount);
}, [deposits]);

// Memoize callbacks
const handleDeposit = useCallback(() => {
  // deposit logic
}, [dependencies]);
```

### 2. Virtual Lists

For large lists:

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={deposits.length}
  itemSize={80}
  width="100%"
>
  {Row}
</FixedSizeList>
```

### 3. Debounce & Throttle

```typescript
import { useDebounce } from './hooks/useDebounce';

const debouncedSearch = useDebounce(searchTerm, 300);
```

### 4. Avoid Unnecessary Re-renders

```typescript
import { memo } from 'react';

export const DepositCard = memo(({ deposit }) => {
  return <div>{/* ... */}</div>;
});
```

## Network Optimization

### 1. Cache API Responses

```typescript
import { cache } from './utils/cache';

// Cache for 5 minutes
const data = cache.get('deposits');
if (!data) {
  const freshData = await fetchDeposits();
  cache.set('deposits', freshData, 5 * 60 * 1000);
}
```

### 2. Batch Requests

```typescript
// Instead of multiple requests
const [deposits, stats, history] = await Promise.all([
  fetchDeposits(),
  fetchStats(),
  fetchHistory(),
]);
```

### 3. Optimize Web3 Calls

```typescript
// Use multicall for batch reads
const results = await multicall([
  vault.balanceOf(address),
  vault.totalDeposits(),
  vault.getUserDeposits(address),
]);
```

## Image Optimization

### 1. Use Modern Formats

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.avif" type="image/avif">
  <img src="image.jpg" alt="Description">
</picture>
```

### 2. Lazy Load Images

```typescript
<img 
  src="placeholder.jpg" 
  data-src="actual-image.jpg"
  loading="lazy"
  alt="Description"
/>
```

### 3. Responsive Images

```html
<img 
  srcset="image-320w.jpg 320w,
          image-640w.jpg 640w,
          image-1280w.jpg 1280w"
  sizes="(max-width: 320px) 280px,
         (max-width: 640px) 600px,
         1200px"
  src="image-640w.jpg"
  alt="Description"
/>
```

## CSS Optimization

### 1. Critical CSS

Extract and inline critical CSS for above-the-fold content.

### 2. Remove Unused CSS

```bash
# Use PurgeCSS
npm install -D @fullhuman/postcss-purgecss
```

### 3. Use CSS Variables

```css
:root {
  --color-primary: #0066cc;
  --spacing-unit: 8px;
}

.button {
  background: var(--color-primary);
  padding: calc(var(--spacing-unit) * 2);
}
```

## Loading Performance

### 1. Resource Hints

```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://api.example.com">

<!-- Prefetch resources -->
<link rel="prefetch" href="/dashboard">

<!-- Preload critical resources -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

### 2. Skeleton Screens

Use loading skeletons instead of spinners:

```typescript
{loading ? <Skeleton count={5} /> : <DataList />}
```

### 3. Progressive Loading

```typescript
// Load essential data first
const essentialData = await fetchEssentialData();
setData(essentialData);

// Load non-critical data in background
fetchNonCriticalData().then(setAdditionalData);
```

## Monitoring

### 1. Web Vitals

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 2. Performance API

```typescript
// Measure component render time
performance.mark('component-start');
// ... render component
performance.mark('component-end');
performance.measure('component-render', 'component-start', 'component-end');
```

### 3. React DevTools Profiler

Use React DevTools to profile component renders and identify bottlenecks.

## Best Practices

1. **Lazy load non-critical resources**
2. **Optimize images and fonts**
3. **Minimize JavaScript bundle size**
4. **Cache aggressively**
5. **Use CDN for static assets**
6. **Enable compression (gzip/brotli)**
7. **Minimize main thread work**
8. **Avoid layout thrashing**
9. **Use requestAnimationFrame for animations**
10. **Profile regularly**

## Performance Budget

Set and monitor performance budgets:

- **JavaScript:** < 200 KB
- **CSS:** < 50 KB
- **Images:** < 500 KB total
- **Fonts:** < 100 KB
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Largest Contentful Paint:** < 2.5s

## Testing

```bash
# Lighthouse
npm install -g lighthouse
lighthouse https://yoursite.com --view

# WebPageTest
# Use online tool at webpagetest.org
```

## Continuous Monitoring

Integrate performance monitoring:

- Google Lighthouse CI
- SpeedCurve
- Calibre
- WebPageTest API
