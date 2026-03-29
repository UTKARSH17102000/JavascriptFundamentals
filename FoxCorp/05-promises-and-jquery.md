## Promises + jQuery (easy → hard) — interview Q&A (SSE)

### 1) Promise states and transitions?
**Answer (SSE)**  
Promises have 3 states:
- **pending** → initial
- **fulfilled** → resolved with a value
- **rejected** → failed with a reason

They are **settled once**; further resolve/reject calls are ignored.

### 2) What’s the most important rule about `.then`?
**Answer (SSE)**  
`.then` always returns a **new promise**. If you return a value, it becomes the next fulfillment value. If you throw, it becomes a rejection. If you return a promise, it “flattens” (adopts it).

```js
Promise.resolve(1)
  .then((x) => x + 1)        // 2
  .then((x) => Promise.resolve(x + 1)) // 3
  .then((x) => { throw new Error("boom"); })
  .catch((e) => e.message);  // "boom"
```

### 3) Microtasks vs macrotasks — why should I care?
**Answer (SSE)**  
Promise callbacks run in the **microtask queue**, which drains **before** timers (macrotasks). This affects ordering and UI responsiveness.

```js
console.log("A");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
console.log("B");
// A, B, promise, timeout
```

### 4) `fetch` vs `$.ajax` — how are failures different?
**Answer (SSE)**  
- `fetch` **rejects only on network errors** (or abort). HTTP 404/500 still resolves; you must check `res.ok`.
- `$.ajax` typically calls error callbacks for non-2xx depending on config.

### 5) Convert `$.ajax` to a native Promise wrapper (interview safe)
**Answer (SSE)**  
Even though `$.ajax` already returns a jqXHR “thenable-ish”, I prefer a real Promise for consistent semantics.

```js
function ajaxJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      method: options.method ?? "GET",
      data: options.data,
      dataType: "json",
      success: (data) => resolve(data),
      error: (xhr, statusText, err) => reject(err ?? new Error(statusText)),
    });
  });
}
```

### 6) Implement retry with exponential backoff
**Answer (SSE)**  
I’ll mention: limit attempts, backoff, jitter, and only retry idempotent operations (GET) unless the API is designed for safe retries.

```js
async function retry(fn, { attempts = 3, baseMs = 200 } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn(i);
    } catch (e) {
      lastErr = e;
      const backoff = baseMs * 2 ** i;
      const jitter = Math.floor(Math.random() * 0.25 * backoff);
      await new Promise((r) => setTimeout(r, backoff + jitter));
    }
  }
  throw lastErr;
}
```

### 7) `Promise.all` vs `allSettled` — when to use which?
**Answer (SSE)**  
- `Promise.all`: fail-fast; if any rejects, the whole result rejects.
- `Promise.allSettled`: you always get per-promise results; useful for “best effort” UIs.

```js
const results = await Promise.allSettled([p1, p2, p3]);
for (const r of results) {
  if (r.status === "fulfilled") console.log(r.value);
  else console.warn(r.reason);
}
```

### 8) Unhandled rejections — what causes them and how to prevent?
**Answer (SSE)**  
Causes: creating promises and never awaiting/handling them; missing `.catch`; async event handlers where errors are dropped.

Prevention:
- always `await` or `.catch`
- in React, wrap async effects carefully
- add global logging (`window.onunhandledrejection`) but treat it as safety net, not a fix

