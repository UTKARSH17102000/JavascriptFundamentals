## Chainable API (easy → hard) — interview Q&A (SSE)

### 1) What makes an API chainable?
**Answer (SSE)**  
The key is that each method returns an object that has the next method. Most often that’s `return this`, but it can also be a new object (immutable chaining). Chaining is mainly about **ergonomics** and **composability**.

### 2) Show a minimal chainable calculator.
**Answer (SSE)**  
Mutable chain: return `this` from methods; expose a `value()` getter.

```js
class Calculator {
  constructor(n = 0) {
    this._n = n;
  }
  add(x) {
    this._n += x;
    return this;
  }
  sub(x) {
    this._n -= x;
    return this;
  }
  value() {
    return this._n;
  }
}

const res = new Calculator(10).add(5).sub(3).value(); // 12
```

### 3) Mutable chaining vs immutable chaining — tradeoffs?
**Answer (SSE)**  
- **Mutable**: simpler, fewer allocations; but riskier in shared references and harder to reason about in concurrency-ish flows (async).
- **Immutable**: easier to reason about; works nicely with functional patterns; but allocates more objects.

Immutable example:

```js
class ICalc {
  constructor(n = 0) {
    this._n = n;
  }
  add(x) {
    return new ICalc(this._n + x);
  }
  sub(x) {
    return new ICalc(this._n - x);
  }
  value() {
    return this._n;
  }
}
```

### 4) How do you support variadic args (`add(1,2,3)`)?
**Answer (SSE)**  
Accept rest args and reduce.

```js
add(...xs) {
  this._n += xs.reduce((a, b) => a + b, 0);
  return this;
}
```

### 5) How do you implement `.tap(fn)` without breaking chaining?
**Answer (SSE)**  
`tap` calls a callback with current value and returns `this`. It’s useful for debugging/metrics.

```js
tap(fn) {
  fn(this._n);
  return this;
}

new Calculator(1).add(2).tap(console.log).sub(1).value(); // logs 3
```

### 6) How do you design an async chainable API?
**Answer (SSE)**  
I usually model it as a **command queue**: each call appends a step to a promise chain. Then `await api.done()` (or make it thenable).

```js
class AsyncChain {
  constructor(seed = 0) {
    this._p = Promise.resolve(seed);
  }

  add(x) {
    this._p = this._p.then((n) => n + x);
    return this;
  }

  async value() {
    return await this._p;
  }
}

const v = await new AsyncChain(10).add(5).add(2).value(); // 17
```

### 7) How do you handle errors in an async chain?
**Answer (SSE)**  
I decide semantics:
- Either the chain becomes “failed” and stays failed (common, like promises),
- Or I allow recovery steps (`.catch(handler)` style).

```js
class SafeAsyncChain {
  constructor(seed = 0) {
    this._p = Promise.resolve(seed);
  }
  step(fn) {
    this._p = this._p.then(fn);
    return this;
  }
  catch(fn) {
    this._p = this._p.catch(fn);
    return this;
  }
  value() {
    return this._p;
  }
}
```

### 8) How can you make the chain “thenable” so `await chain` works?
**Answer (SSE)**  
Implement a `then` method that delegates to the internal promise. This makes the object behave like a promise in `await` and `.then`.

```js
class ThenableChain {
  constructor(seed = 0) {
    this._p = Promise.resolve(seed);
  }
  add(x) {
    this._p = this._p.then((n) => n + x);
    return this;
  }
  then(onFulfilled, onRejected) {
    return this._p.then(onFulfilled, onRejected);
  }
}

const v = await new ThenableChain(1).add(2).add(3); // 6
```

