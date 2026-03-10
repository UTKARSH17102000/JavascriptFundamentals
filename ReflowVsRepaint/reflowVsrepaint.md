Reflow vs Repaint – Senior-Level Interview Notes

This file is meant as a study/reference sheet.
It mixes theory, examples, and interview-style questions.

You can run this file in the browser console or a bundler environment
and play with the examples by copying the snippets.
 

============================================================
1. Rendering Pipeline – Where Reflow & Repaint Fit In
============================================================

At a high level, modern browsers render a page in these phases:

1) Parse HTML -> build DOM tree
2) Parse CSS -> build CSSOM (CSS Object Model)
3) Combine DOM + CSSOM -> Render Tree (only visible nodes)
4) Layout (a.k.a. Reflow) – compute geometry:
     - each element's size, position, line breaks, etc.
5) Paint – fill pixels (colors, borders, shadows, text, images)
6) Composite – merge multiple layers (GPU) into the final image

Historically, people say "reflow" and "repaint".
In many modern docs you'll also see:
  - "layout" instead of "reflow"
  - "paint" or "raster"
  - "compositing" / "composite-only updates"

============================================================
2. Definitions
============================================================

Reflow (Layout):
- When the browser must recalculate the layout:
  positions, sizes, line wrapping, etc.
- Expensive because it can affect large parts of the render tree.
- May trigger subsequent paint & composite.

Repaint (Paint):
- When visual appearance changes (e.g. color, background, shadow)
  but geometry (size/position) stays the same.
- Triggers paint of affected areas and then compositing.

Composite-only Update:
- Some properties (e.g. CSS transforms, opacity) can change
  without layout or paint, only layer compositing changes.
- These are the cheapest in terms of runtime performance and are
  preferred for animations.

============================================================
3. What Triggers Reflow vs Repaint?
============================================================

(A) Reflow / Layout Triggers (examples):
- Changing element dimensions:
    el.style.width/height/margin/padding/border
- Changing font properties affecting metrics:
    font-size, font-family, font-weight (often)
- Inserting/removing nodes from the DOM:
    parent.appendChild(child), removeChild, innerHTML = ...
- Changing layout-affecting display properties:
    display, position, top/left, flex/grid changes, etc.
- Querying layout information that forces layout to be up-to-date:
    el.offsetWidth / offsetHeight
    el.getBoundingClientRect()
    getComputedStyle(el).width / height in some cases

(B) Repaint / Paint Triggers (without layout):
- Changes that affect only visual style, not size/position:
    color, background-color, box-shadow, outline, visibility, etc.

(C) Composite-only Triggers (no layout, no paint, only compositing):
- Properties like:
    transform, opacity, filter (often promoted to own layer),
    will-change (hint to browser).
- These are ideal for smooth 60fps animations when used correctly.

============================================================
4. Why Senior Engineers Care
============================================================

- Performance: unnecessary or repeated reflows/repaints are a
  common cause of jank, slow scrolling, and high CPU usage.
- Power/Battery: frequent layout/paint/composite work drains power.
- UX: choppy animations, layout shifts, and flickering degrade
  perceived quality, especially on lower-end devices.

Senior-level expectations:
- Understand how code (JS/CSS/DOM) maps to rendering costs.
- Be able to reason about and improve rendering performance.
- Know how to diagnose layout/paint issues using DevTools.

============================================================
5. Classic Anti-Pattern: Layout Thrashing
============================================================

Layout Thrashing = interleaving "read layout" and "write layout" in
such a way that the browser is forced to recalculate layout
repeatedly in a tight loop.

Example (naive, bad):

```javascript
function layoutThrashingExampleBad() {
  const items = document.querySelectorAll(".item");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

```

READ: forces layout to be up-to-date

```javascript
    const height = item.offsetHeight;

```

WRITE: changes layout again

```javascript
    item.style.height = height + 10 + "px";
  }
}

```

- If `items.length` is large, the browser does:
    reflow -> paint (for first iteration),
    then read -> reflow -> paint again for next, etc.

Optimized version – batch reads and writes:

```javascript
function layoutThrashingExampleGood() {
  const items = document.querySelectorAll(".item");
  const heights = [];

```

1) Batch READS (only forces layout once)

```javascript
  for (let i = 0; i < items.length; i++) {
    heights[i] = items[i].offsetHeight;
  }

```

2) Batch WRITES

```javascript
  for (let i = 0; i < items.length; i++) {
    items[i].style.height = heights[i] + 10 + "px";
  }
}

```

– Even better: group DOM writes using `requestAnimationFrame`
  so browser can coalesce and schedule them around frame boundaries.

```javascript
function batchedWritesWithRAF() {
  const items = document.querySelectorAll(".item");

  const heights = [];
  for (let i = 0; i < items.length; i++) {
    heights[i] = items[i].offsetHeight;
  }

  window.requestAnimationFrame(() => {
    for (let i = 0; i < items.length; i++) {
      items[i].style.height = heights[i] + 10 + "px";
    }
  });
}

```

============================================================
6. Example: Reflow-Heavy DOM Manipulation
============================================================

Naive approach: touching the DOM in every iteration.

```javascript
function appendManyNodesNaive(count = 1000) {
  const list = document.getElementById("list");
  list.innerHTML = ""; // clear

  for (let i = 0; i < count; i++) {
    const li = document.createElement("li");
    li.textContent = "Item " + i;
    list.appendChild(li); // may cause repeated reflows
  }
}

```

Optimized approach: use a DocumentFragment to avoid repeated layout.

```javascript
function appendManyNodesOptimized(count = 1000) {
  const list = document.getElementById("list");
  list.innerHTML = ""; // one layout invalidation for clear

  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const li = document.createElement("li");
    li.textContent = "Item " + i;
    frag.appendChild(li); // only in-memory
  }

```

Single DOM insertion -> single layout update

```javascript
  list.appendChild(frag);
}

```

============================================================
7. Example: Repaint vs Composite-only Animation
============================================================

(A) Bad for performance – animating layout-related property:

  .box {
    position: absolute;
    left: 0;
    transition: left 200ms linear;
  }

  // JS:
  box.style.left = "400px";

– This will trigger layout (reflow) on each frame of animation.

(B) Better – use transform for composite-only animation:

  .box {
    transform: translateX(0);
    transition: transform 200ms linear;
  }

  // JS:
  box.style.transform = "translateX(400px)";

– Usually results in only compositing work, smoother animation.

============================================================
8. Browser Optimizations to Be Aware Of
============================================================

- Layout invalidation is incremental:
  The whole page doesn't always reflow; browsers track "dirty" nodes.
- Coalescing:
  Multiple writes within the same frame may be merged into one layout/paint.
- Layer promotion:
  Some elements become their own composite layers (e.g., 3D transforms,
  video, canvas, etc.). This can improve performance but too many layers
  can also be expensive (memory, compositing).
- Heuristics:
  Browsers use heuristics to delay or skip work that isn't visible.

============================================================
9. Best Practices to Minimize Reflow/Repaint
============================================================

- **Batch DOM writes**:
    - Collect changes and apply them together (e.g., using fragments,
      class toggles, or innerHTML once).

- **Separate reads from writes**:
    - First read layout properties you need, then apply all style changes.

- **Avoid synchronous layout queries inside tight loops**:
    - Example: calling `el.offsetWidth` repeatedly after writes.

- **Prefer transform/opacity for animations**:
    - This enables composite-only updates.

- **Use CSS `contain` / `will-change` when appropriate**:
    - `contain: layout paint;` limits the layout/paint scope of a subtree.
    - `will-change: transform;` (used sparingly) hints about future changes.

- **Minimize DOM depth and complexity**:
    - Deep and complex layouts increase the cost of layout and paint.

- **Use requestAnimationFrame for visual updates**:
    - Schedules work for before the next paint, aligning with the browser's
      rendering loop.

============================================================
10. Debugging Reflow/Repaint Issues (DevTools)
============================================================

Common approaches:
- Performance (or Timeline) panel:
    - Record a session and look for:
      - "Layout" / "Recalculate Style" / "Paint" events.
      - Their duration and frequency per frame.
- Rendering tab (Chrome):
    - "Paint flashing" – highlights areas being repainted.
- FPS meter:
    - Watch for dropped frames during interactions/animations.
- Layer borders:
    - Visualize composite layers to debug layer explosion.

============================================================
11. Senior-Level Interview Questions Around Reflow/Repaint
============================================================

Below are questions you might encounter and hints for answering.
Use them for mock interviews or flashcards.

1) What is the difference between reflow and repaint?
   - Reflow (layout) recomputes geometry (sizes/positions).
   - Repaint redraws pixels without changing layout.

2) Can you describe the browser rendering pipeline end-to-end?
   - Discuss DOM, CSSOM, render tree, layout, paint, compositing.

3) Give examples of operations that cause reflow vs repaint vs composite-only.
   - Reflow: changing width/height, adding/removing elements, fonts.
   - Repaint: changing color or background-color only.
   - Composite-only: transform/opacity animations.

4) What is layout thrashing and how do you avoid it?
   - Pattern of interleaving read/write layout operations causing many
     forced sync layouts.
   - Avoid by batching reads and writes and using rAF.

5) How would you optimize a page that scrolls jankily on mobile?
   - Profile with DevTools, search for heavy layout/paint per scroll.
   - Use transform-based animations, reduce DOM complexity, lazy load,
     debounce expensive handlers, etc.

6) How do virtual DOM libraries (like React) help with reflows/repaints?
   - They minimize actual DOM mutations by diffing trees.
   - But misuse (e.g., frequent full re-renders, large lists) can still
     cause heavy layout/paint.

7) How do you debug and reason about which CSS properties are "expensive"?
   - Use DevTools performance/coverage, consult "CSS Triggers" references,
     run experiments toggling properties.

8) What is a composite layer and when do you want one?
   - A separately rendered surface composited by GPU.
   - Good for isolating animations, but too many layers are costly.

9) How does CSS `contain` help with rendering performance?
   - Limits the impact of layout/paint to a subtree, preventing the
     entire page from reflowing/painting.

10) What is content-visibility and how does it relate to rendering?
    - `content-visibility: auto;` allows skipping rendering for off-screen
      content until needed, reducing layout/paint costs.

11) What are the trade-offs of using `will-change`?
    - Pros: smoother animations by pre-promoting layers.
    - Cons: memory overhead, too many layers; should be used selectively.

12) How does CLS (Cumulative Layout Shift) relate to reflow?
    - Layout shifts are user-visible reflows during page lifetime.
    - CLS is a user-centric metric capturing instability; minimizing
      unexpected reflows is key.

13) In a large React/SPA app, how would you localize expensive layout work?
    - Portal heavy components; use CSS containment; split complex DOM into
      separate subtrees; avoid full-page reflows by constraining layout.

14) How do you decide if an observed bottleneck is CPU-bound layout/paint
    vs JavaScript vs network?
    - Use performance profiling:
      - JS: long tasks, scripting time.
      - Layout: many "Recalculate Style"/"Layout" entries.
      - Paint/composite: long paint/composite durations.
      - Network: waterfall in Network panel.

15) How would you explain reflow/repaint trade-offs to a non-frontend engineer?
    - Use analogies: "reflow is rearranging furniture; repaint is repainting
      the walls; compositing is putting the final photo collage together."

Feel free to extend this list with more questions from your own
interview experience or from real performance issues you encounter.

End of reflow vs repaint notes.
