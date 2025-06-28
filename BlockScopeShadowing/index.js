// Certainly! Let's break down the concepts of Block, Scope, and Shadowing in JavaScript, as you might explain them in an interview setting.

// Block
// A block in JavaScript is a section of code enclosed by curly braces {}. Blocks are used to group statements together, and they are commonly found in control structures like if, for, and while loops. Blocks help define the scope of variables declared with let and const.

// Example:
// if (true) {
//     let blockScopedVariable = "I'm inside a block";
//     console.log(blockScopedVariable); // Output: I'm inside a block
// }
// // console.log(blockScopedVariable); // ReferenceError: blockScopedVariable is not defined

// In this example, blockScopedVariable is only accessible within the if block. Trying to access it outside the block results in a ReferenceError.

// Scope
// Scope refers to the accessibility of variables and functions in different parts of the code. JavaScript has several types of scope:

// 1.
// Global Scope: Variables declared outside any function or block are in the global scope and can be accessed from anywhere in the code.
// 2.
// Function Scope: Variables declared with var inside a function are function-scoped, meaning they are accessible only within that function.
// 3.
// Block Scope: Variables declared with let or const are block-scoped, meaning they are accessible only within the block they are defined in.


// Example:
// var globalVar = "I'm global";

// function functionScopeExample() {
//     var functionScopedVar = "I'm function-scoped";
//     console.log(globalVar); // Output: I'm global
//     console.log(functionScopedVar); // Output: I'm function-scoped
// }

// functionScopeExample();
// // console.log(functionScopedVar); // ReferenceError: functionScopedVar is not defined

// if (true) {
//     let blockScopedVar = "I'm block-scoped";
//     console.log(blockScopedVar); // Output: I'm block-scoped
// }
// // console.log(blockScopedVar); // ReferenceError: blockScopedVar is not defined

// Shadowing
// Shadowing occurs when a variable declared within a certain scope (e.g., a block or function) has the same name as a variable in an outer scope. The inner variable "shadows" the outer one, meaning the inner variable takes precedence within its scope.

// Example:
// let name = "Outer";

// function shadowingExample() {
//     let name = "Inner";
//     console.log(name); // Output: Inner
// }

// shadowingExample();
// console.log(name); // Output: Outer

// In this example, the name variable inside the shadowingExample function shadows the name variable in the global scope. Inside the function, the inner name variable is used, while outside the function, the outer name variable is used.

// Interview Explanation
// In an interview, you might explain these concepts as follows:

// Block: A block is a set of statements enclosed in curly braces {}. It defines a scope for variables declared with let and const, limiting their accessibility to within the block.
// Scope: Scope determines where variables and functions are accessible in the code. JavaScript has global, function, and block scopes. var is function-scoped, while let and const are block-scoped.
// Shadowing: Shadowing occurs when a variable in a certain scope has the same name as a variable in an outer scope. The inner variable takes precedence within its scope, effectively "hiding" the outer variable.


// Understanding these concepts is crucial for writing predictable and bug-free JavaScript code, especially when dealing with complex applications and nested structures.





Function.prototype.myBind = function myBind(...args) {
 let context = args[0];
 let params = args.slice(1);

 return function(...outerArgs) {
    return this.apply(context, [...params,...outerArgs])
 }
}