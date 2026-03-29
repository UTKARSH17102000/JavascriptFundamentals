/**
 * Soni Frontend — Easy — call, apply, bind polyfills (Jio, Expedia)
 */

Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("myCall must be called on a function");
  }
  context =
    context !== null && context !== undefined ? Object(context) : globalThis;
  const uniqueSymbol = Symbol();
  context[uniqueSymbol] = this;
  const result = context[uniqueSymbol](...args);
  delete context[uniqueSymbol];
  return result;
};

Function.prototype.myApply = function (context, args) {
  if (typeof this !== "function") {
    throw new TypeError("myApply must be called on a function");
  }
  context =
    context !== null && context !== undefined ? Object(context) : globalThis;
  if (!Array.isArray(args)) {
    throw new TypeError("The second argument must be an array");
  }
  const uniqueSymbol = Symbol();
  context[uniqueSymbol] = this;
  const result = context[uniqueSymbol](...args);
  delete context[uniqueSymbol];
  return result;
};

Function.prototype.myBind = function (context, ...boundArgs) {
  if (typeof this !== "function") {
    throw new TypeError("myBind must be called on a function");
  }
  context =
    context !== null && context !== undefined ? Object(context) : globalThis;
  const fn = this;
  return function (...args) {
    return fn.apply(context, [...boundArgs, ...args]);
  };
};

function greet(name) {
  return `Hello, ${name}`;
}
const person = { name: "John" };
console.log(greet.myCall(person, "Alice"));

function sum(a, b) {
  return a + b;
}
console.log(sum.myApply({}, [5, 10]));

function multiply(a, b) {
  return a * b;
}
const boundMultiply = multiply.myBind(null, 2);
console.log(boundMultiply(3));
console.log(boundMultiply(4));
