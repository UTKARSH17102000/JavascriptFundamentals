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


function curry (fn) {
    return function curried(args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...args2) {
                return curried.apply(this, args.concat(args2));
            }
        }
    }
}

// infinite currying
function curry (fn){

    return function curried(...args){
        if (args.length === 0) {
            return fn(...args);
          }
          return (...moreArgs) => curried(...args, ...moreArgs);
    }
}