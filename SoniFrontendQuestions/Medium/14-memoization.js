/**
 * Soni Frontend — Medium — Memoization (Rippling, Forward Network)
 * Cache by serialized args; objects sorted by key for stable keys.
 */

const memoization = (fn) => {
  const cache = new Map();
  const serialize = (value) => {
    if (typeof value === "object" && value !== null) {
      const sortedKeys = Object.keys(value).sort();
      return `{${sortedKeys
        .map((key) => `"${key}":${JSON.stringify(value[key])}`)
        .join(",")}}`;
    }
    return JSON.stringify(value);
  };
  return function (...args) {
    const cacheKey = args.map(serialize).join("|");
    if (cache.has(cacheKey)) {
      console.log(`Cache hit for: ${cacheKey}`);
      return cache.get(cacheKey);
    }
    console.log(`Cache miss for: ${cacheKey}`);
    const result = fn.apply(this, args);
    cache.set(cacheKey, result);
    return result;
  };
};

const exampleFunction = (a, b) => {
  console.log("Function executed");
  return a + b;
};

const memoizedExample = memoization(exampleFunction);
console.log(memoizedExample(1, 2));
console.log(memoizedExample(1, 2));
console.log(memoizedExample("hello", "world"));
console.log(memoizedExample("hello", "world"));

const exampleObj = (obj1, num) => {
  console.log("Function executed");
  return obj1.a + obj1.b + obj1.c + num;
};
const memoizedExampleObj = memoization(exampleObj);
console.log(memoizedExampleObj({ a: 1, b: 2, c: 3 }, 6));
console.log(memoizedExampleObj({ c: 3, b: 2, a: 1 }, 6));
console.log(memoizedExampleObj({ a: 1, b: 2, c: 3 }, 10));
console.log(memoizedExampleObj({ a: 1, b: 2, c: 3 }, 10));
