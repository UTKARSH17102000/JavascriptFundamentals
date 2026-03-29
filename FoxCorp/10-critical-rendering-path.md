## Critical Rendering Path (easy → hard) — interview Q&A (SSE)

### 1) Define “critical rendering path”
**Answer (SSE)**  
It’s the sequence of steps the browser takes to paint pixels:
HTML → **DOM**, CSS → **CSSOM**, DOM + CSSOM → **render tree**, then **layout** (geometry), **paint**, and **compositing**.

### 2) What blocks rendering?
**Answer (SSE)**  
- **CSS** is render-blocking: browser needs CSSOM to paint.
- **Sync scripts** block HTML parsing (and often block rendering).

So I mention: minimize critical CSS, use `defer`, avoid sync script in `<head>`.

### 3) `async` vs `defer` (very common)
**Answer (SSE)**  
- `defer`: downloads in parallel, executes **after parse**, in order. Best default for most scripts.
- `async`: downloads in parallel, executes **as soon as ready**, can interrupt parsing, not ordered. Good for truly independent scripts (analytics) but can be tricky.

```html
<script src="/app.js" defer></script>
<script src="https://analytics.example/x.js" async></script>
```

### 4) Reflow vs repaint vs composite?
**Answer (SSE)**  
- **Reflow/layout**: recalculating positions/sizes (expensive).
- **Repaint**: redrawing pixels (less expensive than layout, still costs).
- **Composite**: stitching layers together; often the cheapest, especially for `transform`/`opacity` animations.

### 5) What causes layout shift (CLS) and how to prevent it?
**Answer (SSE)**  
CLS is unexpected movement of content.
Prevention:
- reserve space for images/ads (set width/height or `aspect-ratio`)
- avoid injecting content above existing content
- use font loading strategies and fallback sizing

### 6) How do fonts affect CRP (FOIT/FOUT)?
**Answer (SSE)**  
- FOIT: invisible text while font loads
- FOUT: fallback text then swap

Mitigations:
- `font-display: swap` (often best UX)
- preload critical fonts
- choose fallback with similar metrics

### 7) How do you measure CRP in practice?
**Answer (SSE)**  
I talk about:
- Chrome DevTools Performance + Lighthouse
- Core Web Vitals: **LCP**, **CLS**, **INP**, plus **TTFB**

And I always separate: server/TTFB vs render-blocking vs JS execution vs images.

### 8) Given a slow page, how do you prioritize fixes?
**Answer (SSE)**  
I start with evidence:
- if TTFB high → server/CDN/cache
- if LCP image → optimize image, preload, size properly
- if long JS tasks → split bundle, `defer`, reduce hydration cost, code-split
- if CSS blocks → reduce critical CSS, avoid huge CSS in head

