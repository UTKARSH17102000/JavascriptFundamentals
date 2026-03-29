## DOM Manipulation (easy → hard) — interview Q&A (SSE)

### 1) `querySelector` vs `getElementById` — when to use which?
**Answer (SSE)**  
`getElementById` is the fastest and most explicit when I already have a unique `id`. `querySelector` is more flexible (CSS selectors) and works uniformly across element types, but may be slightly slower and easier to overuse with complex selectors. In real apps, the bigger win is **select once, reuse**, and avoid repeated DOM queries inside loops/scroll handlers.

```js
const root = document.getElementById("root");
const button = root.querySelector("button.primary");
```

### 2) Event bubbling vs capturing — what’s the difference?
**Answer (SSE)**  
Events travel in phases: **capture** (window → target), **target**, then **bubble** (target → window). Most listeners default to bubbling. Capturing is useful when you want a parent to intercept before children (e.g., analytics, global guards).

```js
document.addEventListener(
  "click",
  (e) => console.log("capture", e.target),
  { capture: true }
);

document.addEventListener("click", (e) => console.log("bubble", e.target));
```

### 3) What is event delegation and why does it help?
**Answer (SSE)**  
Instead of attaching listeners to many children, attach one listener to a stable ancestor and check `event.target` (or `closest`). It reduces memory/GC pressure and works for dynamically added elements.

```js
const list = document.querySelector("#todoList");

list.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest("[data-action='delete']");
  if (!deleteBtn) return;

  const item = deleteBtn.closest("[data-id]");
  if (!item) return;

  item.remove();
});
```

### 4) `innerHTML` vs `textContent` vs `innerText`
**Answer (SSE)**  
- **`textContent`**: sets/gets raw text; fast; no layout.
- **`innerText`**: “rendered” text; triggers style/layout reads; slower; respects CSS.
- **`innerHTML`**: parses HTML; can cause XSS if you inject user input.

If content is user-provided, I default to `textContent`. I only use `innerHTML` with trusted templates or sanitized HTML.

```js
el.textContent = userInput; // safe against XSS injection
// el.innerHTML = userInput; // dangerous if userInput contains "<img onerror=...>"
```

### 5) How do you render large lists efficiently (10k+)?
**Answer (SSE)**  
I avoid “append 10k nodes synchronously” because it blocks the main thread. Options:
- **Virtualize** (render only visible rows) — best UX.
- **Incremental rendering** with `requestAnimationFrame` / `requestIdleCallback` — simple and effective.
- **Batch DOM writes** via `DocumentFragment` and avoid layout thrashing.

Incremental render example:

```js
function renderChunked(container, items, renderItem, chunkSize = 200) {
  let i = 0;

  function work() {
    const frag = document.createDocumentFragment();
    const end = Math.min(i + chunkSize, items.length);
    for (; i < end; i++) frag.appendChild(renderItem(items[i]));
    container.appendChild(frag);

    if (i < items.length) requestAnimationFrame(work);
  }

  work();
}
```

### 6) What’s layout thrashing? How do you avoid it?
**Answer (SSE)**  
Thrashing happens when you interleave **DOM writes** (change styles/DOM) with **DOM reads** (like `offsetWidth/getBoundingClientRect`) repeatedly, forcing the browser to recalculate layout multiple times.

Rule of thumb: **read first, then write**, and batch writes.

Bad:

```js
for (const el of elements) {
  el.style.width = el.offsetWidth + 10 + "px"; // read after write triggers forced layout
}
```

Better:

```js
const widths = elements.map((el) => el.offsetWidth);
elements.forEach((el, idx) => {
  el.style.width = widths[idx] + 10 + "px";
});
```

### 7) `DocumentFragment` — when and why?
**Answer (SSE)**  
`DocumentFragment` lets me build DOM nodes off-screen and append once, minimizing repeated reflow/paint.

```js
const frag = document.createDocumentFragment();
for (const name of ["A", "B", "C"]) {
  const li = document.createElement("li");
  li.textContent = name;
  frag.appendChild(li);
}
document.querySelector("ul").appendChild(frag);
```

### 8) How do you prevent XSS in DOM updates?
**Answer (SSE)**  
Use `textContent` for user input. If HTML is required, sanitize with a robust sanitizer (e.g., DOMPurify) and enforce a strict CSP. Also, avoid creating HTML by concatenating strings.

### 9) How do you implement a modal focus trap (a11y)?
**Answer (SSE)**  
Key requirements:
- Move focus into modal on open.
- Keep `Tab` cycling inside.
- Restore focus on close.
- Close on `Esc`.

```js
function trapFocus(modalEl) {
  const focusable = () =>
    Array.from(
      modalEl.querySelectorAll(
        "a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex='-1'])"
      )
    ).filter((el) => !el.hasAttribute("inert") && !el.getAttribute("aria-hidden"));

  function onKeyDown(e) {
    if (e.key !== "Tab") return;
    const els = focusable();
    if (els.length === 0) return;

    const first = els[0];
    const last = els[els.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  modalEl.addEventListener("keydown", onKeyDown);
  return () => modalEl.removeEventListener("keydown", onKeyDown);
}
```

### 10) What is `MutationObserver` and where would you use it?
**Answer (SSE)**  
It’s an async DOM observation API for changes (attributes, childList, subtree). Use-cases:
- Integrating with 3rd-party widgets that mutate DOM
- Observing lazy-loaded content for instrumentation
- Auto-enhancing newly inserted nodes

Pitfalls: too-broad observers can be expensive; avoid observing the entire document unless necessary; debounce work if it triggers frequently.

```js
const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.type === "childList") {
      // respond to added nodes
    }
  }
});

observer.observe(document.querySelector("#root"), {
  childList: true,
  subtree: true,
});
```

