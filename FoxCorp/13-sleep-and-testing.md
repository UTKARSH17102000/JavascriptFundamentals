## Sleep to test (easy → hard) — interview Q&A (SSE)

### 1) Implement `sleep(ms)`
**Answer (SSE)**  
Classic promise-based sleep:

```js
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function demo() {
  console.log("start");
  await sleep(200);
  console.log("after 200ms");
}
```

### 2) Why is `sleep()` discouraged in automated tests?
**Answer (SSE)**  
Because it creates:
- **slow tests**
- **flaky tests** (timing varies on CI)
- tests that don’t validate the condition, only the passage of time

Instead, prefer waiting for a **condition** or use **fake timers**.

### 3) Implement `waitFor(condition, timeout, interval)`
**Answer (SSE)**  
This is a better primitive than “sleep and hope”.

```js
async function waitFor(condition, { timeoutMs = 2000, intervalMs = 50 } = {}) {
  const start = Date.now();
  while (true) {
    if (await condition()) return true;
    if (Date.now() - start > timeoutMs) throw new Error("waitFor timeout");
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}
```

### 4) How do you test debounced code deterministically?
**Answer (SSE)**  
Use fake timers (Jest/Vitest) so you can advance time instantly and assert calls precisely.

Jest-style:

```js
jest.useFakeTimers();

const fn = jest.fn();
const d = debounceWithControls(fn, 250);

d("a");
d("b");
expect(fn).not.toHaveBeenCalled();

jest.advanceTimersByTime(249);
expect(fn).not.toHaveBeenCalled();

jest.advanceTimersByTime(1);
expect(fn).toHaveBeenCalledWith("b");
```

### 5) Testing fetch + debounce + abort — what’s the SSE approach?
**Answer (SSE)**  
I isolate responsibilities:
- debounce logic: unit test with fake timers
- fetch client: unit test with mocked fetch
- integration: assert that only latest call updates state; aborted calls don’t

Core technique: mock `fetch` and expose/inspect `AbortSignal` usage, and advance timers to trigger the debounced execution.

