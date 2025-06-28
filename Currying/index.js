let multiply = function (x, y) {
    console.log(x*y)
}

let multiplyByTwoUsingBind = multiply.bind(this,2)

multiplyByTwoUsingBind(3) // Output: 6



let multiplyByThreeUsingBind = multiply.bind(this,3)

multiplyByThreeUsingBind(3) // Output: 9


// Closure Approch

let multiplyBy = function (x) {
    return function (y) {
        console.log(x*y)
    }
}

let multiplyByTwo = multiplyBy(2)

multiplyByTwo(3) // Output: 6


// Certainly! Let's review the code and discuss JavaScript currying, its best practices, real-world use cases, and potential follow-up questions.

// The code demonstrates two approaches to currying: using bind() and using closures.

// 1.
// Using bind():
// let multiply = function (x, y) {
//     console.log(x*y)
// }

// let multiplyByTwoUsingBind = multiply.bind(this, 2)
// multiplyByTwoUsingBind(3) // Output: 6

// let multiplyByThreeUsingBind = multiply.bind(this, 3)
// multiplyByThreeUsingBind(3) // Output: 9

// 2.
// Using closures:
// let multiplyBy = function (x) {
//     return function (y) {
//         console.log(x*y)
//     }
// }

// let multiplyByTwo = multiplyBy(2)
// multiplyByTwo(3) // Output: 6

// Both approaches achieve currying, which is the technique of transforming a function with multiple arguments into a sequence of functions, each with a single argument.

// Best way to solve:
// The closure approach is generally considered the best way to implement currying in JavaScript. It's more flexible and doesn't rely on the bind() method, which is specific to JavaScript. The closure approach can be easily extended to support multiple levels of currying.

// Real-world use cases:
// 1.
// Function composition: Currying makes it easier to compose functions, allowing for more modular and reusable code.
// 2.
// Event handling: Creating specialized event handlers with pre-set parameters.
// 3.
// Partial application: Fixing a certain number of arguments to a function, producing another function of smaller arity.
// 4.
// Configuration of functions: Creating specialized versions of more generic functions.


// Example of a real-world use case:
// const applyDiscount = (discount) => (price) => price * (1 - discount);

// const tenPercentOff = applyDiscount(0.1);
// const twentyPercentOff = applyDiscount(0.2);

// console.log(tenPercentOff(100)); // 90
// console.log(twentyPercentOff(100)); // 80

// Potential follow-up questions and solutions:

// 1.
// Q: How would you implement a curry function that works with any number of arguments?
// A: Here's an implementation:

// function curry(fn) {
//   return function curried(...args) {
//     if (args.length >= fn.length) {
//       return fn.apply(this, args);
//     } else {
//       return function(...args2) {
//         return curried.apply(this, args.concat(args2));
//       }
//     }
//   };
// }

// // Usage:
// function sum(a, b, c) {
//   return a + b + c;
// }

// const curriedSum = curry(sum);
// console.log(curriedSum(1)(2)(3)); // 6
// console.log(curriedSum(1, 2)(3)); // 6
// console.log(curriedSum(1, 2, 3)); // 6

// 2.
// Q: How would you implement infinite currying?
// A: Here's an implementation:

// function infiniteCurry(fn) {
//   return function curried(...args) {
//     if (args.length === 0) {
//       return fn(...args);
//     }
//     return (...moreArgs) => curried(...args, ...moreArgs);
//   };
// }

// // Usage:
// const sum = infiniteCurry((a, b, c, d) => a + b + c + d);
// console.log(sum(1)(2)(3)(4)()); // 10
// console.log(sum(1, 2)(3, 4)()); // 10

// 3.
// Q: How would you optimize a curried function for performance?
// A: One way is to memoize the results:

// function memoize(fn) {
//   const cache = new Map();
//   return function(...args) {
//     const key = JSON.stringify(args);
//     if (cache.has(key)) {
//       return cache.get(key);
//     }
//     const result = fn.apply(this, args);
//     cache.set(key, result);
//     return result;
//   };
// }

// const expensiveOperation = memoize((x, y) => {
//   console.log('Calculating...');
//   return x * y;
// });

// const curriedExpensiveOperation = curry(expensiveOperation);

// console.log(curriedExpensiveOperation(2)(3)); // Logs: Calculating... 6
// console.log(curriedExpensiveOperation(2)(3)); // Logs: 6 (from cache)

// These questions and implementations demonstrate a deeper understanding of currying and its applications in JavaScript, showcasing techniques like infinite currying and performance optimization through memoization.

   
function curry(fn) {
    return function curried(...args) {
        console.log(args, fn, args.length, fn.length);
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...args2) {
                return curried.apply(this, args.concat(args2));
            }
        }
    }
}

const sum1 = (a, b) => a + b;

const curriedSum = curry(sum1);

console.log('hello', curriedSum(1)(2)(3)(4)(5)); // Output: hello 3

// infinite currying
// function curry (fn){

//     return function curried(...args){
//         if (args.length === 0) {
//             return fn(...args);
//           }
//           return (...moreArgs) => curried(...args, ...moreArgs);
//     }
// }

// In javascript functions are first class objects means that they behave like any other variables.





let sum = function(a) {
    return function(b){
        if(b){ // if arguments exist call the next function
            return sum(a + b);
        }
        return a; // return code
    }
}
sum(1)(2)(3)(4)(5)(6)(7)(8)(9)(10)()

// Certainly! Let's review the code, provide an optimized version, and discuss some follow-up questions.

// The given code implements an infinite currying function for summation. Here's an optimized version with explanations:

// index.js
// const sum = (a) => {
//     const fn = (b) => b ? sum(a + b) : a;
//     fn.valueOf = () => a;
//     return fn;
// };

// console.log(sum(1)(2)(3)(4)(5)()); // 15
// console.log(+sum(1)(2)(3)(4)(5));  // 15

// Optimizations and improvements:
// 1.
// Used arrow functions for conciseness.
// 2.
// Removed the need for an empty function call at the end by implementing valueOf().
// 3.
// The valueOf() method allows the function to be implicitly converted to a number, enabling operations like addition without an empty function call.


// Now, let's discuss some follow-up questions:

// 1.
// Q: How does this implementation handle type coercion?
// A: The valueOf() method allows the function to be implicitly converted to a number when used in mathematical operations or when explicitly converted using the unary plus operator (+).
// 2.
// Q: How would you modify this implementation to support other operations like multiplication or subtraction?
// A: Here's an example for a more flexible currying function:


// index.js
// const curry = (initialValue, operation) => {
//     const fn = (a) => a !== undefined ? curry(operation(initialValue, a), operation) : initialValue;
//     fn.valueOf = () => initialValue;
//     return fn;
// };

// const sum = curry(0, (a, b) => a + b);
// const multiply = curry(1, (a, b) => a * b);

// console.log(+sum(1)(2)(3)(4)(5));  // 15
// console.log(+multiply(1)(2)(3)(4)(5));  // 120

// 3.
// Q: How would you implement error handling for invalid inputs?
// A: You could add type checking and throw errors for invalid inputs:


// index.js
// const sum = (a) => {
//     if (typeof a !== 'number') throw new TypeError('Arguments must be numbers');
//     const fn = (b) => {
//         if (b === undefined) return a;
//         if (typeof b !== 'number') throw new TypeError('Arguments must be numbers');
//         return sum(a + b);
//     };
//     fn.valueOf = () => a;
//     return fn;
// };

// console.log(+sum(1)(2)(3)); // 6
// console.log(+sum(1)('2')); // TypeError: Arguments must be numbers

// 4.
// Q: How would you implement a currying function that can handle a fixed number of arguments?
// A: Here's an implementation:


// index.js
// const curryN = (fn, n = fn.length) => {
//     return function curried(...args) {
//         if (args.length >= n) {
//             return fn.apply(this, args);
//         } else {
//             return (...args2) => curried.apply(this, args.concat(args2));
//         }
//     };
// };

// const add3 = (a, b, c) => a + b + c;
// const curriedAdd3 = curryN(add3);

// console.log(curriedAdd3(1)(2)(3)); // 6
// console.log(curriedAdd3(1, 2)(3)); // 6
// console.log(curriedAdd3(1)(2, 3)); // 6

// 5.
// Q: How does currying relate to partial application, and what are the key differences?
// A: This question allows you to discuss the relationship between currying and partial application, highlighting that currying always produces a unary function, while partial application can fix any number of arguments.


// These questions and implementations demonstrate a deeper understanding of currying, its applications, and related concepts in JavaScript. They showcase techniques for handling different scenarios and optimizing for various use cases.
