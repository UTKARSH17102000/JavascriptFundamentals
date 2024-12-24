// Closures are a fundamental concept in JavaScript that allow functions to access variables from an outer function's scope even after the outer function has finished executing. This is possible because functions in JavaScript form closures around the scope in which they were declared. Let's break this down with an explanation, use cases, code snippets, and some output-related questions.

// Explanation of Closures
// A closure is created when a function is defined inside another function, allowing the inner function to access the outer function's variables. This access is preserved even after the outer function has returned, which means the inner function "closes over" the variables of the outer function.

// Example of Closures
// closures_example.js
// function outerFunction(outerVariable) {
//     return function innerFunction(innerVariable) {
//         console.log('Outer Variable:', outerVariable);
//         console.log('Inner Variable:', innerVariable);
//     };
// }

// const newFunction = outerFunction('outside');
// newFunction('inside');
// // Output:
// // Outer Variable: outside
// // Inner Variable: inside

// In this example, innerFunction is a closure that captures the outerVariable from outerFunction. Even after outerFunction has executed, innerFunction retains access to outerVariable.

// Use Cases of Closures
// 1.
// Data Privacy: Closures can be used to create private variables that cannot be accessed from outside the function scope.

// data_privacy.js
// function createCounter() {
//     let count = 0;
//     return {
//         increment: function() {
//             count++;
//             return count;
//         },
//         decrement: function() {
//             count--;
//             return count;
//         },
//         getCount: function() {
//             return count;
//         }
//     };
// }

// const counter = createCounter();
// console.log(counter.getCount());  // 0
// console.log(counter.increment()); // 1
// console.log(counter.increment()); // 2
// console.log(counter.decrement()); // 1
// 2.
// Function Factories: Closures can be used to create functions with preset configurations.

// function_factory.js
// function createMultiplier(multiplier) {
//     return function(number) {
//         return number * multiplier;
//     };
// }

// const double = createMultiplier(2);
// const triple = createMultiplier(3);

// console.log(double(5)); // 10
// console.log(triple(5)); // 15
// 3.
// Event Handlers: Closures are often used in event handlers to maintain access to variables from the outer scope.

// event_handler.js
// function setupButton() {
//     let count = 0;
//     document.getElementById('myButton').addEventListener('click', function() {
//         count++;
//         console.log('Button clicked', count, 'times');
//     });
// }

// setupButton();


// Output Questions
// 1.
// Question: What will be the output of the following code?

// question1.js
// function makeCounter() {
//     let count = 0;
//     return function() {
//         return count++;
//     };
// }

// const counter1 = makeCounter();
// const counter2 = makeCounter();

// console.log(counter1()); // ?
// console.log(counter1()); // ?
// console.log(counter2()); // ?
// console.log(counter2()); // ?

// Answer:
// question1.js
// 0
// 1
// 0
// 1

// Explanation: Each call to makeCounter creates a new closure with its own count variable. Therefore, counter1 and counter2 maintain separate count states.
// 2.
// Question: What will be the output of the following code?

// question2.js
// function outer() {
//     let x = 10;
//     return function() {
//         console.log(x);
//     };
// }

// const closureFunc = outer();
// x = 20;
// closureFunc(); // ?

// Answer:
// question2.js
// 10

// Explanation: The closure captures the value of x at the time outer is called, not when the closure is executed. Therefore, it logs 10, not 20.
// 3.
// Question: What will be the output of the following code?

// question3.js
// function createFunctions() {
//     let arr = [];
//     for (let i = 0; i < 3; i++) {
//         arr.push(function() {
//             console.log(i);
//         });
//     }
//     return arr;
// }

// const funcs = createFunctions();
// funcs[0](); // ?
// funcs[1](); // ?
// funcs[2](); // ?

// Answer:
// question3.js
// 0
// 1
// 2

// Explanation: Using let in the loop creates a new binding for each iteration, so each function captures a different value of i.


// Understanding closures is crucial for writing efficient and maintainable JavaScript code, especially when dealing with asynchronous operations, callbacks, and module patterns.



function x() {
    let a = 10;
    function y() {
        console.log(a);
    };

    a = 100;
   return y
}

let z = x();

z(); // Output: 100 bcoz clousures persist the reference of the var not the core value so when y function is called a refrence has the updated value as 100 in it.

// Closures are also widely used in functional programming, where they allow functions to capture and reuse state. For example, they can be used to implement higher-order functions, such as map, reduce, and filter, that operate on collections.


// Uses of Closures
// - Module Design Pattern
// - Currying
// - Functions like once 
// - memoize
// - maintaining state in async world
// - set TimeOuts
// -  Iterators



// Certainly! Let's explore how closures are utilized in each of these use cases:

// 1. Module Design Pattern
// The Module Design Pattern uses closures to encapsulate private data and expose only the necessary parts of the module. This pattern helps in organizing code and maintaining data privacy.

// Example:

// module_pattern.js
// const myModule = (function() {
//     let privateVar = "I'm private";

//     function privateFunction() {
//         console.log("This is a private function");
//     }

//     return {
//         publicMethod: function() {
//             console.log(privateVar);
//             privateFunction();
//         }
//     };
// })();

// myModule.publicMethod(); // Outputs: "I'm private" and "This is a private function"

// 2. Currying
// Currying is a functional programming technique where a function is transformed into a sequence of functions, each with a single argument. Closures are used to remember the arguments passed to the curried function.

// Example:

// currying.js
// function curry(fn) {
//     return function curried(...args) {
//         if (args.length >= fn.length) {
//             return fn.apply(this, args);
//         } else {
//             return function(...args2) {
//                 return curried.apply(this, args.concat(args2));
//             };
//         }
//     };
// }

// function add(a, b) {
//     return a + b;
// }

// const curriedAdd = curry(add);
// console.log(curriedAdd(1)(2)); // Outputs: 3

// 3. Functions like `once`
// The once function ensures that a given function is executed only once. Closures are used to keep track of whether the function has been called.

// Example:

// once.js
// function once(fn) {
//     let called = false;
//     return function(...args) {
//         if (!called) {
//             called = true;
//             return fn.apply(this, args);
//         }
//     };
// }

// const initialize = once(() => console.log("Initialized"));
// initialize(); // Outputs: "Initialized"
// initialize(); // No output

// 4. Memoization
// Memoization is an optimization technique that caches the results of expensive function calls. Closures are used to store the cache.

// Example:

// memoize.js
// function memoize(fn) {
//     const cache = {};
//     return function(...args) {
//         const key = JSON.stringify(args);
//         if (!cache[key]) {
//             cache[key] = fn.apply(this, args);
//         }
//         return cache[key];
//     };
// }

// const factorial = memoize(function(n) {
//     if (n === 0) return 1;
//     return n * factorial(n - 1);
// });

// console.log(factorial(5)); // Outputs: 120
// console.log(factorial(5)); // Cached output: 120

// 5. Maintaining State in Async World
// Closures help maintain state across asynchronous operations, such as callbacks or promises.

// Example:

// async_state.js
// function fetchData(url) {
//     let data;
//     return function(callback) {
//         if (data) {
//             callback(data);
//         } else {
//             fetch(url)
//                 .then(response => response.json())
//                 .then(json => {
//                     data = json;
//                     callback(data);
//                 });
//         }
//     };
// }

// const getData = fetchData('https://api.example.com/data');
// getData(data => console.log(data)); // Fetches and logs data
// getData(data => console.log(data)); // Logs cached data

// 6. `setTimeouts`
// Closures are used in setTimeout to capture the state at the time the timeout is set.

// Example:

// setTimeout.js
// for (let i = 0; i < 3; i++) {
//     setTimeout(() => {
//         console.log(i);
//     }, 1000);
// }
// // Outputs: 0, 1, 2

// 7. Iterators
// Iterators use closures to maintain the current state of iteration.

// Example:

// iterator.js
// function createIterator(array) {
//     let index = 0;
//     return {
//         next: function() {
//             if (index < array.length) {
//                 return { value: array[index++], done: false };
//             } else {
//                 return { done: true };
//             }
//         }
//     };
// }

// const iterator = createIterator([1, 2, 3]);
// console.log(iterator.next().value); // Outputs: 1
// console.log(iterator.next().value); // Outputs: 2
// console.log(iterator.next().value); // Outputs: 3
// console.log(iterator.next().done);  // Outputs: true

// Each of these examples demonstrates how closures can be leveraged to manage state, encapsulate data, and create more flexible and reusable code structures.







// Tabnine
// Claude 3.5 Sonnet
// Certainly! While closures are a powerful feature in JavaScript, they do come with some potential disadvantages. Let's discuss the main drawbacks of using closures:

// disadvantages.js
// // Disadvantages of Closures

// // 1. Memory Consumption
// function createCounter() {
//     let count = 0;
//     return function() {
//         return ++count;
//     };
// }
// const counter = createCounter();

// // 2. Performance Implications
// function outerFunction(x) {
//     return function innerFunction(y) {
//         return x + y;
//     };
// }
// const addFive = outerFunction(5);

// // 3. Potential for Memory Leaks
// function setupHandler() {
//     let largeData = new Array(1000000).fill('some data');
//     document.getElementById('myButton').addEventListener('click', function() {
//         console.log(largeData.length);
//     });
// }

// // 4. Complexity and Readability
// function complexClosure() {
//     let a = 1;
//     return function(b) {
//         return function(c) {
//             return function(d) {
//                 return a + b + c + d;
//             };
//         };
//     };
// }
// const result = complexClosure()(2)(3)(4);

// // 5. Unexpected Behavior with Loops
// function createFunctions() {
//     var funcs = [];
//     for (var i = 0; i < 3; i++) {
//         funcs.push(function() { console.log(i); });
//     }
//     return funcs;
// }

// Let's break down these disadvantages:

// 1.
// Memory Consumption:
// Closures can lead to higher memory consumption because they keep references to their outer scope, even after the outer function has returned. In the createCounter example, the count variable is kept in memory as long as the returned function exists.
// 2.
// Performance Implications:
// Accessing variables through closures can be slower than accessing local variables or global variables. In the outerFunction example, accessing x in the inner function is slightly slower than if x were a local variable.
// 3.
// Potential for Memory Leaks:
// If not handled properly, closures can lead to memory leaks, especially in environments like browsers. In the setupHandler example, the large array is kept in memory as long as the event listener exists, even if it's no longer needed.
// 4.
// Complexity and Readability:
// Excessive use of closures can make code harder to read and understand, especially with nested closures. The complexClosure function demonstrates how closures can lead to deeply nested and potentially confusing code.
// 5.
// Unexpected Behavior with Loops:
// When used incorrectly with loops, closures can lead to unexpected behavior. In the createFunctions example, if var is used instead of let, all functions will close over the same i, leading to unexpected results.


// To mitigate these disadvantages:
// Be mindful of memory usage, especially with long-lived closures.
// Use closures judiciously and consider alternatives when appropriate.
// Be aware of potential memory leaks, especially in browser environments.
// Strive for clear and readable code, even when using closures.
// Use let instead of var in loops when creating closures.


// Despite these disadvantages, closures remain a powerful and essential feature in JavaScript when used appropriately. The key is to understand both their benefits and potential drawbacks to use them effectively in your code.