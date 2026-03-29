/**
 * Soni Frontend — Easy — Pipe and compose (Tekion)
 * pipe: left-to-right. compose: right-to-left.
 */

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((v, f) => f(v), x);

const add5 = (x) => x + 5;
const multiply2 = (x) => x * 2;
const subtract3 = (x) => x - 3;
const toString = (x) => `${x}`;

console.log("Pipe");
const result1 = pipe(add5, multiply2, subtract3)(10); // (10 + 5) * 2 - 3 = 27
console.log(result1);
const result2 = pipe(toString, add5)(5); // "5" + 5 => "55" (string concat)
console.log(result2);

console.log("Compose");
const result3 = compose(add5, multiply2, subtract3)(10); // (10 - 3) * 2 + 5 = 19
console.log(result3);
const result4 = compose(toString, add5)(5);
console.log(result4);
