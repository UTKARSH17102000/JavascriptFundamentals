/**
 * Soni Frontend — Medium / Hard — Currying (Pubmatic)
 * 1) Infinite currying that sums until empty call.
 * 2) Fixed-arity currying with partial application.
 */

function currySum(a) {
  return function (b) {
    if (b === undefined) {
      return a;
    }
    return currySum(a + b);
  };
}

const sumResult = currySum(1)(2)(3)(4)();
console.log("curry sum", sumResult);

function currying(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...args2) {
      return curried.apply(this, args.concat(args2));
    };
  };
}

function multiply(a, b, c, d) {
  return a * b * c * d;
}

const curriedMultiply = currying(multiply);
console.log(curriedMultiply(1)(2)(3)(4));
console.log(curriedMultiply(1, 2)(3, 4));
console.log(curriedMultiply(1)(2, 3)(4));
