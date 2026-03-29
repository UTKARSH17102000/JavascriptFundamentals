## Display Flex (easy → hard) — interview Q&A (SSE)

### 1) Main axis vs cross axis?
**Answer (SSE)**  
Flex layout is axis-based:
- **main axis**: direction of items (`flex-direction`)
- **cross axis**: perpendicular

`justify-content` aligns along **main** axis; `align-items` along **cross** axis.

### 2) What does `flex: 1` mean?
**Answer (SSE)**  
It’s shorthand for `flex-grow`, `flex-shrink`, `flex-basis`. In modern browsers `flex: 1` is effectively:
- grow: 1
- shrink: 1
- basis: 0%

Meaning: items share remaining space evenly.

### 3) Classic interview: sticky footer using Flex
**Answer (SSE)**  
Make the page a column flex container, give main content `flex: 1`.

```html
<div class="page">
  <header>Header</header>
  <main>Main</main>
  <footer>Footer</footer>
</div>
```

```css
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
}
```

### 4) Why do flex children overflow? What does `min-width: 0` fix?
**Answer (SSE)**  
Flex items have a default `min-width: auto`, which can prevent shrinking below their content’s intrinsic width (like long strings). Setting `min-width: 0` allows them to shrink and enables ellipsis/truncation.

```css
.row {
  display: flex;
}
.left {
  flex: 1;
  min-width: 0; /* critical for text truncation */
}
.left .title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 5) `align-content` vs `align-items` — what’s the difference?
**Answer (SSE)**  
- `align-items`: aligns items inside a single flex line.
- `align-content`: aligns the lines within the container (only matters with wrapping: `flex-wrap: wrap`).

### 6) How do you build equal-height columns?
**Answer (SSE)**  
By default, flex items stretch to same height in a row when `align-items: stretch` (default), assuming container has a height constraint (or content defines it). Grid is often simpler for complex equal-height + alignment requirements, but Flex handles the common “cards in a row” case.

### 7) Performance: when can flex become expensive?
**Answer (SSE)**  
Frequent layout recalculations (e.g., changing widths/heights on scroll) can cause reflow. I avoid measuring (`getBoundingClientRect`) and writing layout styles repeatedly in the same tick; batch reads then writes and prefer transforms for animations.

