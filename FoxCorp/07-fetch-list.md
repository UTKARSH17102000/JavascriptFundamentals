## Fetch List (easy → hard) — interview Q&A (SSE)

### 1) What are the minimum UI states for fetching a list?
**Answer (SSE)**  
I always model:
- **loading**
- **success**
- **empty** (success but no items)
- **error**

This prevents ambiguous UI and makes edge cases explicit.

### 2) What’s a common `fetch` gotcha with errors?
**Answer (SSE)**  
`fetch` resolves on HTTP errors. You must check `res.ok` (or status range) and throw yourself.

```js
async function fetchJson(url, { signal } = {}) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}
```

### 3) Vanilla JS snippet: fetch and render list with abort support
**Answer (SSE)**  
I show abort to avoid updating stale UI when user navigates or triggers a new request.

```js
function createListLoader({ listEl, statusEl }) {
  let controller = null;

  return async function load(url) {
    controller?.abort?.();
    controller = new AbortController();

    statusEl.textContent = "Loading…";
    listEl.innerHTML = "";

    try {
      const data = await fetchJson(url, { signal: controller.signal });
      const items = data.items ?? data;

      if (!items || items.length === 0) {
        statusEl.textContent = "No results";
        return;
      }

      const frag = document.createDocumentFragment();
      for (const item of items) {
        const li = document.createElement("li");
        li.textContent = item.name ?? String(item);
        frag.appendChild(li);
      }
      listEl.appendChild(frag);
      statusEl.textContent = "";
    } catch (e) {
      if (controller.signal.aborted) return;
      statusEl.textContent = "Error loading list";
    }
  };
}
```

### 4) How do you avoid duplicate fetches?
**Answer (SSE)**  
Depends on context:
- UI-level: disable button while loading
- request-level: keep an **in-flight map** keyed by URL/query and reuse the same promise
- caching: memoize responses with TTL or SWR pattern

In-flight dedupe:

```js
const inflight = new Map();
async function dedupedFetchJson(url) {
  if (inflight.has(url)) return inflight.get(url);
  const p = fetchJson(url).finally(() => inflight.delete(url));
  inflight.set(url, p);
  return p;
}
```

### 5) Pagination — what problems appear?
**Answer (SSE)**  
- Keeping page, filters, sort consistent
- Preventing race conditions on rapid page changes
- Showing “loading more” vs “full loading”
- Merging pages without duplicates

### 6) How do you handle partial failures when calling multiple endpoints?
**Answer (SSE)**  
Use `Promise.allSettled` and degrade gracefully. I’ll also mention “don’t block the entire page on a non-critical widget”.

```js
const [users, stats] = await Promise.allSettled([
  fetchJson("/api/users"),
  fetchJson("/api/stats"),
]);
```

### 7) SSE-level architecture note: where do you put this logic in real apps?
**Answer (SSE)**  
I separate:
- **API client** (`fetchJson`, auth headers, error normalization)
- **data layer** (caching, dedupe, pagination)
- **UI** (rendering states)

And in React I’d usually use a mature solution (React Query / SWR) unless the exercise requires raw fetch.

