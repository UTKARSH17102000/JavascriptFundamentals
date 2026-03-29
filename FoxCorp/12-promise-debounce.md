## Promise Debounce (debouncing async) (easy → hard) — interview Q&A (SSE)

### 1) Why is debouncing async harder than debouncing sync?
**Answer (SSE)**  
With sync debounce, you only decide when to call `fn`. With async debounce, you must also define what happens to:
- callers that invoked the function earlier (what promise do they get?)
- in-flight requests (do we cancel them?)
- stale results (do we ignore them?)

So you need clear semantics.

### 2) What semantics do you usually pick?
**Answer (SSE)**  
Common SSE-friendly semantics:
- **latest-only execution**
- **all callers receive the same promise** representing the last call
- **cancel in-flight** with `AbortController` if the underlying operation supports it

### 3) Implement: debounced async where all callers share last promise
**Answer (SSE)**  
Behavior:
- multiple calls within `delay` get the **same returned promise**
- only the last arguments are used
- supports aborting in-flight work (optional)

```js
function debounceAsync(fn, delayMs = 250) {
  let t = null;
  let lastArgs = null;
  let lastThis = null;

  let inFlightController = null;
  let pendingPromise = null;
  let pendingResolve = null;
  let pendingReject = null;

  function schedule() {
    clearTimeout(t);
    t = setTimeout(async () => {
      t = null;

      // cancel previous in-flight if any
      inFlightController?.abort?.();
      inFlightController = typeof AbortController !== "undefined" ? new AbortController() : null;

      const resolve = pendingResolve;
      const reject = pendingReject;
      const args = lastArgs;
      const ctx = lastThis;

      // reset next wave
      pendingPromise = null;
      pendingResolve = null;
      pendingReject = null;
      lastArgs = null;
      lastThis = null;

      try {
        const result = await fn.apply(ctx, [...args, { signal: inFlightController?.signal }]);
        resolve(result);
      } catch (e) {
        if (inFlightController?.signal?.aborted) {
          // Treat abort as a rejection; you can choose to swallow instead.
          reject(Object.assign(new Error("Aborted"), { cause: e }));
          return;
        }
        reject(e);
      }
    }, delayMs);
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    if (!pendingPromise) {
      pendingPromise = new Promise((res, rej) => {
        pendingResolve = res;
        pendingReject = rej;
      });
    }

    schedule();
    return pendingPromise;
  }

  debounced.cancel = () => {
    clearTimeout(t);
    t = null;
    inFlightController?.abort?.();
    inFlightController = null;
    if (pendingReject) pendingReject(new Error("Cancelled"));
    pendingPromise = pendingResolve = pendingReject = null;
    lastArgs = lastThis = null;
  };

  return debounced;
}
```

### 4) Interview discussion: what about earlier callers—resolve/reject/ignore?
**Answer (SSE)**  
If all callers share the last promise, then “earlier callers” are implicitly saying “I want the eventual last result.” That’s perfect for typeahead queries.

If instead you want each call to return its own promise and reject “superseded” calls, implement a different contract (often called `debounceLatest` with per-call cancellation).

### 5) How do you prevent stale results if you don’t have abort?
**Answer (SSE)**  
Use a monotonic request id and ignore results that aren’t the latest.

```js
function latestOnlyAsync(fn) {
  let id = 0;
  return async (...args) => {
    const my = ++id;
    const res = await fn(...args);
    if (my !== id) return undefined; // ignore stale
    return res;
  };
}
```

