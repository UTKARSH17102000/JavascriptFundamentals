// Higher-order functions in JavaScript are functions that either take one or more functions as arguments or return a function as a result. They are a fundamental concept in functional programming and can be used to create more flexible and reusable code.

// Here's an explanation of higher-order functions as if asked in an interview:

// Higher-order functions are functions that operate on other functions, either by taking them as arguments or by returning them as a result. They allow you to abstract common patterns and behaviors, making your code more modular, reusable, and expressive.

// Some common types of questions related to higher-order functions that can be asked in an interview include:

// 1.
// What is a higher-order function?
// 2.
// Can you give an example of a higher-order function?
// 3.
// How can higher-order functions be used to create more flexible and reusable code?
// 4.
// What are some common higher-order functions in JavaScript?
// 5.
// How can higher-order functions be used to implement functional programming concepts like map, filter, and reduce?
// 6.
// Can you explain the concept of currying and how it can be used with higher-order functions?
// 7.
// How can higher-order functions be used to implement function composition?


// Here are some examples of higher-order functions and their use cases:

// 1.
// map: This higher-order function takes an array and a mapping function as arguments, and returns a new array with the results of applying the mapping function to each element of the original array.

// Example code snippet:
// const numbers = [1, 2, 3, 4, 5];
// const doubledNumbers = numbers.map(number => number * 2);
// console.log(doubledNumbers); // Output: [2, 4, 6, 8, 10]
// 2.
// filter: This higher-order function takes an array and a filtering function as arguments, and returns a new array containing only the elements that satisfy the filtering condition.

// Example code snippet:
// const numbers = [1, 2, 3, 4, 5];
// const evenNumbers = numbers.filter(number => number % 2 === 0);
// console.log(evenNumbers); // Output: [2, 4]
// 3.
// reduce: This higher-order function takes an array, an initial value, and a reducing function as arguments, and returns a single value by applying the reducing function to each element of the array, cumulatively.

// Example code snippet:
// const numbers = [1, 2, 3, 4, 5];
// const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
// console.log(sum); // Output: 15
// 4.
// setTimeout and setInterval: These functions are higher-order functions because they take a callback function as an argument and return a timer object.

// Example code snippet:
// function sayHello() {
//     console.log('Hello!');
// }

// setTimeout(sayHello, 1000); // Say "Hello!" after 1 second
// setInterval(sayHello, 2000); // Say "Hello!" every 2 seconds
// 5.
// Function composition: This is a technique where you combine multiple functions to create a new function that performs a specific task. Higher-order functions can be used to implement function composition.

// Example code snippet:
// const add = (a, b) => a + b;
// const multiply = (a, b) => a * b;

// const addAndMultiply = (a, b, c) => multiply(add(a, b), c);

// console.log(addAndMultiply(2, 3, 4)); // Output: 20


// These examples demonstrate how higher-order functions can be used to create more flexible and reusable code, and they provide a foundation for understanding functional programming concepts.
