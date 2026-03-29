## Locking Resources (easy → hard) — interview Q&A (SSE)

### 1) Why do we need locks if JavaScript is single-threaded?
**Answer (SSE)**  
Even though JS runs on a single main thread, we still have concurrency through:
- async interleaving (multiple promises/events)
- Web Workers (real parallelism)
- multi-tab / multi-process scenarios
- backend calls where the **shared resource** is external (DB, cache, file, API)

So “locking” is often about **coordinating access** to shared state across async flows.

### 2) Define mutex vs semaphore
**Answer (SSE)**  
- **Mutex**: 1 holder at a time (exclusive).
- **Semaphore**: N holders at a time (rate limiting / concurrency limit).

### 3) Deadlock / starvation — what are they?
**Answer (SSE)**  
- **Deadlock**: A waits for B, B waits for A forever. Usually multiple locks acquired in different order.
- **Starvation**: a task never gets the lock because others keep winning.

Mitigations I mention: lock ordering, timeouts, fairness queues.

### 4) Implement an async mutex in JS (practical interview snippet)
**Answer (SSE)**  
This ensures critical sections run one-at-a-time across async boundaries.

```js
class Mutex {
  constructor() {
    this._queue = [];
    this._locked = false;
  }

  lock() {
    return new Promise((resolve) => {
      if (!this._locked) {
        this._locked = true;
        resolve(this._unlock.bind(this));
      } else {
        this._queue.push(resolve);
      }
    });
  }

  _unlock() {
    const next = this._queue.shift();
    if (next) next(this._unlock.bind(this));
    else this._locked = false;
  }

  async runExclusive(fn) {
    const unlock = await this.lock();
    try {
      return await fn();
    } finally {
      unlock();
    }
  }
}

// Usage:
const m = new Mutex();
await m.runExclusive(async () => {
  // critical section
});
```

### 5) Implement a semaphore (limit concurrency)
**Answer (SSE)**  
Common use: limit parallel API calls to avoid rate limiting.

```js
class Semaphore {
  constructor(limit) {
    this._limit = limit;
    this._inUse = 0;
    this._queue = [];
  }

  acquire() {
    return new Promise((resolve) => {
      const tryAcquire = () => {
        if (this._inUse < this._limit) {
          this._inUse++;
          resolve(this.release.bind(this));
        } else {
          this._queue.push(tryAcquire);
        }
      };
      tryAcquire();
    });
  }

  release() {
    this._inUse--;
    const next = this._queue.shift();
    if (next) next();
  }

  async withPermit(fn) {
    const release = await this.acquire();
    try {
      return await fn();
    } finally {
      release();
    }
  }
}
```

### 6) Multi-tab locking (frontend) — how would you coordinate?
**Answer (SSE)**  
If available, I use the **Web Locks API** (best). Otherwise:
- `BroadcastChannel` for coordination + leader election
- `localStorage` “lock key” + expiry + `storage` events (more fragile)

I mention failure modes: tab crashes leaving stale lock; need TTL/heartbeat.

### 7) Backend locking vs idempotency
**Answer (SSE)**  
I often reduce the need for distributed locks by designing:
- **idempotent APIs**
- unique request keys (idempotency key)
- database constraints (unique indexes) + transactional updates

Locks are still needed sometimes, but the SSE move is to avoid them when possible.

