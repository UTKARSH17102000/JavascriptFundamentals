## React Typeahead (snippet + theory) — interview Q&A (SSE)

> Per your note: **no full implementation required**. I’m including a solid **snippet** and the **theory / interview talking points** you’re expected to cover.

### 1) What state do you keep for a typeahead?
**Answer (SSE)**  
At minimum:
- **`query`**: current input value (controlled input).
- **`results`**: array of suggestions.
- **`status`**: `"idle" | "loading" | "success" | "error"`.
- **`activeIndex`**: keyboard navigation index.
- **`isOpen`**: dropdown visibility.

Often:
- **cache** (Map) to avoid refetching same query
- **request cancellation** (AbortController)
- **latest-only guard** to prevent stale updates

### 2) Biggest real-world problems?
**Answer (SSE)**  
- **Debounce**: avoid hammering API on every keystroke.
- **Race conditions**: older requests returning after newer requests.
- **Cancellation**: abort in-flight fetch on query change/unmount.
- **UX**: don’t flash “No results” while still loading; handle empty query.
- **A11y**: correct ARIA roles (`combobox`, `listbox`, `option`), keyboard support.

### 3) How do you handle race conditions reliably?
**Answer (SSE)**  
Two robust patterns:
- **Abort previous request** with `AbortController`.
- **Latest request id**: only apply results if the request id matches the latest.

I often do both: abort for network savings and request-id for correctness in edge cases.

### 4) Snippet: debounced query + abort + latest-only

```jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function TypeaheadSnippet() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle|loading|success|error

  const abortRef = useRef(null);
  const reqIdRef = useRef(0);

  const cache = useMemo(() => new Map(), []);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      abortRef.current?.abort?.();
      setResults([]);
      setStatus("idle");
      return;
    }

    if (cache.has(q)) {
      setResults(cache.get(q));
      setStatus("success");
      return;
    }

    // cancel previous
    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;

    const myReqId = ++reqIdRef.current;
    setStatus("loading");

    (async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // latest-only guard
        if (myReqId !== reqIdRef.current) return;

        cache.set(q, data.items ?? data); // depends on API shape
        setResults(cache.get(q));
        setStatus("success");
      } catch (e) {
        if (controller.signal.aborted) return; // ignore abort
        if (myReqId !== reqIdRef.current) return;
        setStatus("error");
      }
    })();
  }, [debouncedQuery, cache]);

  return (
    <div>
      <label>
        Search:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>

      {status === "loading" && <div>Loading…</div>}
      {status === "error" && <div>Something went wrong</div>}

      {status === "success" && results.length === 0 && <div>No results</div>}
      {results.length > 0 && (
        <ul>
          {results.map((r) => (
            <li key={r.id ?? r}>{r.label ?? String(r)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 5) Accessibility talking points (what interviewers listen for)
**Answer (SSE)**  
I mention:
- `role="combobox"` on the input wrapper, `aria-expanded`, `aria-controls`
- `role="listbox"` for results container
- `role="option"` per item and `aria-selected`
- keyboard handling: ArrowUp/Down, Enter, Escape
- focus management and screen reader announcements

