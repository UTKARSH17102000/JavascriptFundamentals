// Certainly! I'd be happy to explain Scope and Lexical Scope in JavaScript as if it were asked in an interview. I'll provide explanations, examples, use cases, and some output questions.

// Scope in JavaScript:

// Scope refers to the visibility and accessibility of variables in different parts of your code. It determines where variables can be accessed or modified. JavaScript has three types of scope:

// 1.
// Global Scope
// 2.
// Function Scope
// 3.
// Block Scope (introduced with ES6)


// Example of Scope:

// scope.js
// let globalVar = "I'm global";

// function exampleFunction() {
//   let functionVar = "I'm function-scoped";
  
//   if (true) {
//     let blockVar = "I'm block-scoped";
//     var functionScopedVar = "I'm function-scoped too";
//     console.log(globalVar);  // Accessible
//     console.log(functionVar);  // Accessible
//     console.log(blockVar);  // Accessible
//   }
  
//   console.log(functionScopedVar);  // Accessible
//   console.log(blockVar);  // ReferenceError: blockVar is not defined
// }

// exampleFunction();
// console.log(globalVar);  // Accessible
// console.log(functionVar);  // ReferenceError: functionVar is not defined

// Lexical Scope:

// Lexical Scope, also known as Static Scope, refers to the scope of a variable determined by its position in the source code. In JavaScript, inner functions have access to variables in their outer (enclosing) functions.

// Example of Lexical Scope:

// lexical_scope.js
// function outerFunction() {
//   let outerVar = "I'm from outer function";
  
//   function innerFunction() {
//     let innerVar = "I'm from inner function";
//     console.log(outerVar);  // Accessible due to lexical scope
//     console.log(innerVar);  // Accessible
//   }
  
//   innerFunction();
//   console.log(innerVar);  // ReferenceError: innerVar is not defined
// }

// outerFunction();

// Use Cases:

// 1.
// Data Privacy: Lexical scope allows for creating private variables and methods in JavaScript.


// data_privacy.js
// function createCounter() {
//   let count = 0;  // Private variable
  
//   return {
//     increment: function() {
//       count++;
//       return count;
//     },
//     decrement: function() {
//       count--;
//       return count;
//     },
//     getCount: function() {
//       return count;
//     }
//   };
// }

// const counter = createCounter();
// console.log(counter.getCount());  // 0
// console.log(counter.increment());  // 1
// console.log(counter.increment());  // 2
// console.log(counter.decrement());  // 1
// console.log(counter.count);  // undefined (count is not directly accessible)

// 2.
// Module Pattern: Lexical scope is crucial for implementing the module pattern in JavaScript.


// module_pattern.js
// const myModule = (function() {
//   let privateVar = "I'm private";
  
//   function privateFunction() {
//     console.log("This is a private function");
//   }
  
//   return {
//     publicMethod: function() {
//       console.log(privateVar);
//       privateFunction();
//     }
//   };
// })();

// myModule.publicMethod();  // Outputs: "I'm private" and "This is a private function"
// console.log(myModule.privateVar);  // undefined
// myModule.privateFunction();  // TypeError: myModule.privateFunction is not a function

// Output Questions:

// 1.
// What will be the output of the following code?


// question1.js
// let x = 10;

// function foo() {
//   console.log(x);
//   let x = 20;
// }

// foo();

// 2.
// What will be the output of the following code?


// question2.js
// for (var i = 0; i < 3; i++) {
//   setTimeout(() => console.log(i), 1000);
// }

// 3.
// How would you modify the previous example to log 0, 1, 2 instead?


// These questions test understanding of hoisting, closure, and the difference between let and var in terms of scope.

// Answers:

// 1.
// The output will be a ReferenceError. This is due to the temporal dead zone created by the let declaration inside the function.
// 2.
// The output will be:
// 3
// 3
// 3
// This is because var is function-scoped, and by the time the timeouts execute, the loop has completed and i is 3.
// 3.
// To log 0, 1, 2, you can use let instead of var, or create a closure:


// question3_solution.js
// for (let i = 0; i < 3; i++) {
//   setTimeout(() => console.log(i), 1000);
// }

// // Or using closure with var:
// for (var i = 0; i < 3; i++) {
//   (function(i) {
//     setTimeout(() => console.log(i), 1000);
//   })(i);
// }

// Understanding scope and lexical scope is crucial for writing clean, efficient, and bug-free JavaScript code, especially when dealing with closures, modules, and complex applications.