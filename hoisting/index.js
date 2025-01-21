var x;
getName();
console.log(x);


function getName() {
    var name = "John Doe";
    console.log(name);
}

// Certainly! I'll provide you with a comprehensive definition of hoisting in JavaScript, along with code snippets and real-life examples.

// Hoisting is a behavior in JavaScript where variable and function declarations are moved to the top of their respective scopes during the compilation phase, before the code is executed. This means that regardless of where variables and functions are declared in the code, they are treated as if they are declared at the beginning of their scope. However, it's important to note that only the declarations are hoisted, not the initializations.

// Let's look at some code snippets to illustrate hoisting:

// index.js
// console.log(x); // Output: undefined
// var x = 5;
// console.log(x); // Output: 5

// // The above code is interpreted as:
// // var x;
// // console.log(x);
// // x = 5;
// // console.log(x);

// // Function hoisting
// sayHello(); // Output: "Hello!"

// function sayHello() {
//     console.log("Hello!");
// }

// // Function expressions are not hoisted
// // tryMe(); // This would throw an error

// var tryMe = function() {
//     console.log("Try me!");
// };

// // let and const are hoisted but not initialized (Temporal Dead Zone)
// console.log(y); // Throws ReferenceError
// let y = 10;

// Real-life examples and implications of hoisting:

// 1.
// Unexpected behavior in loops:


// index.js
// for (var i = 0; i < 5; i++) {
//     setTimeout(function() {
//         console.log(i);
//     }, 1000);
// }
// // Output: 5 5 5 5 5 (not 0 1 2 3 4 as you might expect)

// // To fix this, you can use let instead of var:
// for (let i = 0; i < 5; i++) {
//     setTimeout(function() {
//         console.log(i);
//     }, 1000);
// }
// // Output: 0 1 2 3 4

// 2.
// Unintended global variables:


// index.js
// function createCounter() {
//     count = 0; // Oops! Forgot to declare with var, let, or const
//     return function() {
//         count++;
//         return count;
//     }
// }

// var counter = createCounter();
// console.log(counter()); // 1
// console.log(counter()); // 2
// console.log(count); // 2 (count is now a global variable!)

// 3.
// Function declaration overriding:


// index.js
// foo(); // Output: "I'm foo 2"

// function foo() {
//     console.log("I'm foo 1");
// }

// function foo() {
//     console.log("I'm foo 2");
// }

// 4.
// Temporal Dead Zone (TDZ) with let and const:


// index.js
// console.log(x); // Throws ReferenceError
// let x = 5;

// // This is different from var:
// console.log(y); // Output: undefined
// var y = 5;

// Understanding hoisting is crucial for writing predictable JavaScript code and avoiding common pitfalls. It's particularly important in scenarios where you're dealing with variable scoping, function declarations, and temporal dead zones. In modern JavaScript development, using let and const instead of var can help mitigate some of the confusing aspects of hoisting, as they have block scope and are not initialized during hoisting (they remain in the TDZ until their declaration is reached).







// Certainly! I'll explain the "Unexpected behavior in loops" example as if it were asked in an interview, providing a detailed explanation and the reasoning behind it.

// Interview Question:
// Consider the following code snippet:

// index.js
// for (var i = 0; i < 5; i++) {
//     setTimeout(function() {
//         console.log(i);
//     }, 1000);
// }

// What will be the output of this code? Why does it behave this way, and how can we fix it to get the expected output?

// Answer:
// The output of this code will be:
// index.js
// 5
// 5
// 5
// 5
// 5

// This behavior might seem unexpected at first, as many developers would expect it to print 0, 1, 2, 3, 4. Let's break down why this happens:

// 1.
// Variable Scope:
// The variable i is declared using var, which has function scope (or global scope if not inside a function). This means there's only one i variable for the entire loop.
// 2.
// Closure and Asynchronous Execution:
// The setTimeout function creates a closure, capturing the environment in which it's defined. However, it doesn't execute immediately; it's scheduled to run after 1000 milliseconds.
// 3.
// Loop Completion:
// By the time the setTimeout callbacks actually execute, the loop has already completed, and the value of i has reached 5 (the condition that terminates the loop).
// 4.
// Shared Reference:
// All five setTimeout callbacks are referring to the same i variable, which by the time they execute, has the value 5.


// To fix this and get the expected output (0, 1, 2, 3, 4), we can use one of these approaches:

// 1.
// Use let instead of var:


// index.js
// for (let i = 0; i < 5; i++) {
//     setTimeout(function() {
//         console.log(i);
//     }, 1000);
// }

// This works because let has block scope, creating a new i for each iteration of the loop.

// 2.
// Use an IIFE (Immediately Invoked Function Expression) to create a new scope:


// index.js
// for (var i = 0; i < 5; i++) {
//     (function(j) {
//         setTimeout(function() {
//             console.log(j);
//         }, 1000);
//     })(i);
// }

// This creates a new scope for each iteration, capturing the current value of i.

// 3.
// Use setTimeout with an additional parameter:


// index.js
// for (var i = 0; i < 5; i++) {
//     setTimeout(function(j) {
//         console.log(j);
//     }, 1000, i);
// }

// This passes the current value of i directly to the setTimeout callback.

// These solutions demonstrate the importance of understanding variable scope, closures, and the asynchronous nature of JavaScript. In modern JavaScript development, using let for loop variables is generally the cleanest and most straightforward solution to this problem.














// Certainly! I'll explain the Temporal Dead Zone (TDZ) with let and const as if it were asked in an interview.

// Interview Question:
// What is the Temporal Dead Zone (TDZ) in JavaScript? How does it relate to let and const declarations, and why is it important to understand?

// Answer:
// The Temporal Dead Zone (TDZ) is a behavior in JavaScript that occurs with variables declared using let and const. It refers to the period between the start of a block scope and the point where the variable is declared. During this period, the variable exists but cannot be accessed or assigned to.

// Key points about TDZ:

// 1.
// Hoisting Behavior:
// While let and const declarations are hoisted, they are not initialized. This is different from var, which is initialized with undefined.
// 2.
// ReferenceError:
// Attempting to access a variable in its TDZ will result in a ReferenceError.
// 3.
// Block Scope:
// TDZ is closely tied to block scoping, which is a feature of let and const.


// Let's look at some examples to illustrate TDZ:

// index.js
// console.log(x); // Throws ReferenceError: Cannot access 'x' before initialization
// let x = 5;

// // Compared to var:
// console.log(y); // Outputs: undefined
// var y = 5;

// // TDZ in a block scope
// {
//     // TDZ for 'z' starts here
//     console.log(z); // ReferenceError
//     let z = 10; // TDZ ends here
// }

// // Function example
// function example() {
//     console.log(a); // ReferenceError
//     let a = 20;
// }

// Why is understanding TDZ important?

// 1.
// Prevents Variable Use Before Declaration:
// It helps catch potential bugs by throwing errors when you try to use variables before they're properly declared.
// 2.
// Encourages Better Coding Practices:
// It promotes declaring variables before using them, leading to cleaner and more predictable code.
// 3.
// Block Scoping Understanding:
// TDZ reinforces the concept of block scoping, which is crucial for writing more maintainable code.
// 4.
// Differentiates from var Behavior:
// Understanding TDZ helps developers transition from var to let and const, as the behavior is significantly different.
// 5.
// Debugging:
// Knowing about TDZ can help quickly identify and fix certain types of errors in JavaScript code.


// Real-world implications:

// index.js
// function getUserData(userId) {
//     if (userId > 0) {
//         const userData = fetchUserData(userId); // Assume this is an async operation
//         let userRole = 'guest';
        
//         if (userData.role) {
//             let userRole = userData.role; // This creates a new variable in this block
//             console.log(userRole); // Works as expected
//         }
        
//         console.log(userRole); // Still 'guest', not affected by the inner block
//     }
    
//     console.log(userData); // ReferenceError: userData is not defined
// }

// In this example, understanding TDZ and block scoping helps prevent unintended variable shadowing and ensures that variables are only accessed within their proper scope.

// To conclude, the Temporal Dead Zone is a crucial concept in modern JavaScript that enhances code safety and predictability. It's an important aspect of how let and const work, and understanding it is key to writing robust JavaScript code.



let a; 
console.log(a);