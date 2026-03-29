## Array Functions + “Normal” Functions (easy → hard) — interview Q&A (SSE)

### 1) `map` vs `forEach`?
**Answer (SSE)**  
- `map` returns a **new array** of same length (transform).
- `forEach` returns `undefined` (side effects).
If I’m producing a new list, `map` is the clean choice.

```js
const xs = [1, 2, 3];
const ys = xs.map((x) => x * 2); // [2,4,6]
```

### 2) `filter`, `some`, `every`?
**Answer (SSE)**  
- `filter`: subset
- `some`: any match (short-circuits)
- `every`: all match (short-circuits)

```js
[1, 2, 3].some((x) => x > 2);   // true
[1, 2, 3].every((x) => x > 0); // true
```

### 3) What is `reduce` actually for?
**Answer (SSE)**  
`reduce` is for combining elements into one value (number, object, map, grouped structure). I avoid using `reduce` when `map`/`filter` is clearer, unless I want a single pass for performance.

```js
const sum = [1, 2, 3].reduce((acc, x) => acc + x, 0); // 6

const byId = [{ id: 1 }, { id: 2 }].reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
```

### 4) Function declaration vs expression vs arrow?
**Answer (SSE)**  
- **Declaration**: hoisted (usable before definition)
- **Expression**: not hoisted the same way (variable rules apply)
- **Arrow**: lexical `this`, no `arguments`, not constructible with `new`

```js
decl(); // ok
function decl() {}

// expr(); // ReferenceError/TypeError depending on var/let
const expr = function () {};

const arrow = () => {};
```

### 5) `this` in normal vs arrow functions?
**Answer (SSE)**  
Arrow functions capture `this` from the surrounding scope; normal functions set `this` based on call-site (`obj.m()`, `call/apply/bind`, etc.).

```js
const obj = {
  n: 1,
  normal() {
    return this.n;
  },
  arrow: () => {
    // "this" here is not obj
    return this?.n;
  },
};
```

### 6) Sorting pitfalls?
**Answer (SSE)**  
Default `.sort()` is **string sort**; always pass a comparator for numbers. Also, `.sort()` mutates.

```js
[10, 2, 1].sort(); // ["1","10","2"] as strings -> [1,10,2]
[10, 2, 1].sort((a, b) => a - b); // [1,2,10]
```

### 7) Implement `map`/`filter` from scratch (core mechanics)
**Answer (SSE)**  
In an interview I’ll keep it correct and simple; mention sparse arrays if asked.

```js
function myMap(arr, fn) {
  const out = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    if (!(i in arr)) continue; // preserve sparseness behavior
    out[i] = fn(arr[i], i, arr);
  }
  return out;
}

function myFilter(arr, pred) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (!(i in arr)) continue;
    const v = arr[i];
    if (pred(v, i, arr)) out.push(v);
  }
  return out;
}
```

### 8) Single-pass vs chaining — performance tradeoff?
**Answer (SSE)**  
Chaining `filter().map().reduce()` creates intermediate arrays (more allocations) but is readable. For very large arrays or hot paths, a single loop or a single `reduce` can be materially faster and reduce GC.

```js
// single pass
let total = 0;
for (const x of xs) {
  if (x.active) total += x.price * 2;
}
```

