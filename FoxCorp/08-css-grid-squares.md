## CSS Grid Layout “fill up squares” (easy → hard) — interview Q&A (SSE)

### 1) What are the core Grid concepts?
**Answer (SSE)**  
Grid has:
- **container** and **items**
- **tracks** (rows/cols), **lines**
- **areas** (`grid-template-areas`)

I mention that Grid is for 2D layout (rows + cols), while Flex is 1D.

### 2) Build a responsive grid that fills available width
**Answer (SSE)**  
Use `repeat(auto-fit, minmax(...))` so it adapts to container width.

```css
.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
```

### 3) How do you keep each cell perfectly square?
**Answer (SSE)**  
Modern approach: `aspect-ratio: 1 / 1` on items. It’s clean and avoids hacky padding tricks.

```css
.cell {
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  background: #222;
}
```

### 4) Full working snippet: “fill up squares” grid

```html
<div class="grid">
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
</div>
```

```css
.grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}
.cell {
  aspect-ratio: 1 / 1;
  background: linear-gradient(135deg, #2b2b2b, #151515);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
```

### 5) `auto-fill` vs `auto-fit`?
**Answer (SSE)**  
- `auto-fill`: creates as many tracks as will fit, including “empty” tracks.
- `auto-fit`: collapses empty tracks so items stretch to fill space.

For “cards that expand”, I typically use `auto-fit`.

### 6) Prevent layout shifts with images in grid cells?
**Answer (SSE)**  
Reserve space with `aspect-ratio`, explicit `width/height`, and use `object-fit: cover`.

```css
.cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

### 7) Advanced: why can “masonry” be tricky in Grid?
**Answer (SSE)**  
True masonry needs items to pack vertically based on actual height; classic CSS Grid lays out by rows. There are experimental approaches, but in production I’d:
- use a JS layout library if needed, or
- accept a uniform card height, or
- use column-based layout with tradeoffs.

