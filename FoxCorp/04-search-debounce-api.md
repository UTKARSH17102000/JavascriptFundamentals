## Search Debounce API (easy → hard) — interview Q&A (SSE)

### 1) What is debouncing? How is it different from throttling?
**Answer (SSE)**  
- **Debounce**: wait for “silence” before running. Great for search boxes where you only care about the final input.
- **Throttle**: run at most once per interval. Great for scroll/resize handlers where you want periodic updates.

### 2) Implement `debounce(fn, delay)`
**Answer (SSE)**  
Key points I mention: timer resets on each call; preserve `this` + args; return a function.

```js
function debounce(fn, delayMs) {
  let t = null;

  return function debounced(...args) {
    const ctx = this;
    clearTimeout(t);
    t = setTimeout(() => fn.apply(ctx, args), delayMs);
  };
}
```

### 3) Add `.cancel()` and `.flush()` (interview favorite)
**Answer (SSE)**  
`cancel` prevents a pending invocation; `flush` runs it immediately.

```js
function debounceWithControls(fn, delayMs) {
  let t = null;
  let lastArgs = null;
  let lastThis = null;

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    clearTimeout(t);
    t = setTimeout(() => {
      t = null;
      fn.apply(lastThis, lastArgs);
      lastArgs = lastThis = null;
    }, delayMs);
  }

  debounced.cancel = () => {
    clearTimeout(t);
    t = null;
    lastArgs = lastThis = null;
  };

  debounced.flush = () => {
    if (!t) return;
    clearTimeout(t);
    t = null;
    fn.apply(lastThis, lastArgs);
    lastArgs = lastThis = null;
  };

  return debounced;
}
```

### 4) Leading vs trailing debounce — what changes?
**Answer (SSE)**  
- **Trailing** (default): fires after the user stops typing.
- **Leading**: fires immediately on first keystroke, then suppresses until quiet period ends.

I’ll also mention a UX nuance: search suggestions often feel best with a small trailing delay; leading is better for “instant open” UIs.

### 5) How do you debounce an API call and avoid race conditions?
**Answer (SSE)**  
Debounce reduces request count, but does not solve stale responses. I combine:
- debounce input
- `AbortController` to cancel old request
- “latest-only” request id to ignore stale results

```js
function createDebouncedSearch(fetcher, delayMs = 250) {
  let t = null;
  let controller = null;
  let reqId = 0;

  return function search(query, onResult, onError) {
    clearTimeout(t);
    t = setTimeout(async () => {
      const myId = ++reqId;
      controller?.abort?.();
      controller = new AbortController();

      try {
        const data = await fetcher(query, { signal: controller.signal });
        if (myId !== reqId) return; // latest-only
        onResult(data);
      } catch (e) {
        if (controller.signal.aborted) return;
        if (myId !== reqId) return;
        onError?.(e);
      }
    }, delayMs);
  };
}
```

### 6) What are common pitfalls?
**Answer (SSE)**  
- Debouncing the **render** instead of the **side effect** (input becomes laggy). Keep input controlled and immediate; debounce only the API call.
- Not handling abort/unmount (React) → setState on unmounted component.
- Showing “No results” while `loading` → janky UI.
- Creating debounce function inside render repeatedly → timer resets. Keep it stable (useMemo/useRef).

