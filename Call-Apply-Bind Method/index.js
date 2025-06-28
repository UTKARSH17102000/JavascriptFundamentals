// JavaScript Call method Implementation

let name = {
    firstName : "Utkarsh",
    lastName: "Goswami",
}

let printFullName = function (homeTown, state) {
    console.log(this.firstName + " " + this.lastName + " from " + homeTown + " " + state)

}

printFullName.call(name, "Chandigarh", "Punjab");

// Changing the context of 'this' using call method Function Borrowing Context
let name2 = {
    firstName : "Sachin",
    lastName: "Tendulkar",
}

printFullName.call(name2, "Mumbai", "Maharashtra") 
// ... existing code

// The call() method in JavaScript
// Purpose: Allows you to call a function with a specified 'this' value and arguments provided individually
// Syntax: functionName.call(thisArg, arg1, arg2, ...)
//
// Arguments:
// 1. thisArg: The value to be used as 'this' when the function is called
// 2. arg1, arg2, ...: Arguments for the function (optional)
//
// Usage:
// 1. Function borrowing: Borrow methods from other objects
// 2. Invoking functions with a specific context
// 3. Pseudo-method calls: Call a method on an object that doesn't have that method
//
// Real-life examples:
// 1. Customer support system: Applying a generic 'logCall' function to different customer objects
//    logCall.call(customer1, "2023-06-01", "Billing inquiry")
//
// 2. Multi-store inventory system: Using a shared 'checkStock' function across different store objects
//    checkStock.call(storeA, "ProductX")
//
// 3. Event handling in web applications: Setting the context for event handlers
//    element.addEventListener("click", function(e) {
//        handleClick.call(this, e);
//    });
//
// Benefits:
// 1. Code reusability: Share methods across objects without duplicating code
// 2. Flexibility: Dynamically set the 'this' context at runtime
// 3. Explicit context setting: Clearly specify the execution context, enhancing code readability
// 4. Functional programming: Supports composition and higher-order functions
//
// In this specific example, we're borrowing the printFullName function and applying it to name2 object:
printFullName.call(name2, "Mumbai") //



// JavaScript Apply method Implementation

// in JavaScript Apply method the arguments are passed in arraylist. rest it is same as call method of javascript.

console.log("===============APPLY METHOD=================");

printFullName.apply(name2, ["Chandigarh", "Punjab"]);

// ... existing code

// The apply() method in JavaScript
// Purpose: Allows you to call a function with a specified 'this' value and arguments provided as an array
// Syntax: functionName.apply(thisArg, [argsArray])
//
// Arguments:
// 1. thisArg: The value to be used as 'this' when the function is called
// 2. argsArray: An array or array-like object containing arguments for the function (optional)
//
// Usage:
// 1. Function borrowing: Borrow methods from other objects
// 2. Invoking functions with a specific context and dynamic argument lists
// 3. Spreading arrays as function arguments
//
// Real-life examples:
// 1. Math operations: Applying Math.max() or Math.min() to an array of numbers
//    let maxValue = Math.max.apply(null, [1, 2, 3, 4, 5]);
//
// 2. Function composition: Merging multiple arrays
//    let mergedArray = Array.prototype.push.apply(array1, array2);
//
// 3. Dynamic form submission: Sending form data with varying fields
//    submitForm.apply(formContext, formDataArray);
//
// Benefits:
// 1. Flexibility with arguments: Pass arguments as an array, allowing for dynamic argument lists
// 2. Array manipulation: Easily use array methods on array-like objects
// 3. Code reusability: Share methods across objects without duplicating code
// 4. Functional programming: Supports techniques like partial application and currying
//
// Differences from call():
// 1. Argument passing: apply() takes arguments as an array, while call() takes them individually
// 2. Dynamic argument lists: apply() is more suitable when the number of arguments is unknown or variable
// 3. Array spreading: apply() can be used to spread an array as arguments (though spread syntax is now preferred)
//
// In this specific example, we're using apply() to pass arguments as an array to the printFullName function:
printFullName.apply(name2, ["Chandigarh", "Punjab"]);


// Bind method Implementation 

// Gives the copy of the same method which can be used latter.

let printMyName = printFullName.bind(name2, ["myName", "ByMind"]);
console.log(printMyName);
printMyName();


// The bind() method in JavaScript
// Purpose: Creates a new function with a fixed 'this' value and optionally pre-set initial arguments
// Syntax: functionName.bind(thisArg[, arg1[, arg2[, ...]]])
//
// Arguments:
// 1. thisArg: The value to be used as 'this' when the function is called
// 2. arg1, arg2, ...: Arguments to be partially applied to the function (optional)
//
// Usage:
// 1. Creating methods with a fixed context
// 2. Partial function application
// 3. Event handlers with a specific context
// 4. Borrowing methods while preserving context
//
// Real-life examples:
// 1. UI Components: Binding event handlers to maintain component context
//    class Button {
//      constructor(label) {
//        this.label = label;
//        this.click = this.click.bind(this);
//      }
//      click() {
//        console.log(`${this.label} clicked`);
//      }
//    }
//
// 2. Partial application in functional programming:
//    const multiply = (x, y) => x * y;
//    const double = multiply.bind(null, 2);
//    console.log(double(4)); // Output: 8
//
// 3. Debouncing function calls:
//    const debounce = (func, delay) => {
//      let timeoutId;
//      return function(...args) {
//        clearTimeout(timeoutId);
//        timeoutId = setTimeout(() => func.apply(this, args), delay);
//      }.bind(this);
//    };
//
// Benefits:
// 1. Predictable 'this' context: Ensures the function always has the correct 'this' value
// 2. Reusability: Create specialized versions of functions with pre-set contexts or arguments
// 3. Cleaner code: Avoid repetitive use of closures or arrow functions to preserve context
// 4. Functional programming: Supports techniques like currying and partial application
//
// Differences from call() and apply():
// 1. Execution timing: bind() returns a new function without executing it, while call() and apply() execute immediately
// 2. Argument binding: bind() can partially apply arguments, creating a new function with some arguments pre-set
// 3. Reusability: The function returned by bind() can be called multiple times with the bound context and arguments
// 4. Flexibility: bind() is useful for scenarios where you need to pass a function as a callback while controlling its context
//
// In this specific example, we're using bind() to create a new function with a fixed context and pre-set arguments:

// let printMyName = printFullName.bind(name2, "myName", "ByMind");
// console.log(printMyName);
// printMyName()


// Bind Polyfill functions

Function.prototype.myBind = function myBind (...args){
    let caller = this;
    let context = args[0];
    let params = args.slice(1);
    return function(...outerArgs){
       return caller.apply(context,[...params,...outerArgs]);      
    }
}

let myBind  = printFullName.myBind(name2, "myName", "ByMind");
console.log("myBind", myBind());

// Prototype
// Function prototype is a fundamental concept in JavaScript that allows you to add properties and methods to all instances of a particular function (which includes objects created using that function as a constructor). Here's a detailed explanation:

// 1.
// What is Function.prototype?


// Function.prototype is an object that is automatically created for every function in JavaScript. It serves as the prototype for all instances created from that function when used as a constructor.

// 2.
// Why is it used?


// Function.prototype is used for several reasons:

// a) Inheritance: It allows you to implement inheritance in JavaScript.
// b) Method Sharing: It enables efficient memory usage by sharing methods across all instances of a function.
// c) Extending Functionality: It allows you to add new methods or properties to all instances of a function, even after they've been created.

// 3.
// Best use cases for Function.prototype:


// a) Adding methods to built-in objects:
//    You can extend the functionality of built-in JavaScript objects.
// Array.prototype.sum = function() {
//   return this.reduce((a, b) => a + b, 0);
// };

// [1, 2, 3].sum(); // Returns 6

// b) Creating custom data types:
//    When creating custom objects, you can define shared methods on the prototype.
// function Person(name) {
//   this.name = name;
// }

// Person.prototype.sayHello = function() {
//   console.log(`Hello, I'm ${this.name}`);
// };

// let person = new Person("Alice");
// person.sayHello(); // Outputs: Hello, I'm Alice

// c) Implementing inheritance:
//    You can use prototypes to create inheritance chains.
// function Animal(name) {
//   this.name = name;
// }

// Animal.prototype.makeSound = function() {
//   console.log("Some generic sound");
// };

// function Dog(name) {
//   Animal.call(this, name);
// }

// Dog.prototype = Object.create(Animal.prototype);
// Dog.prototype.constructor = Dog;

// Dog.prototype.bark = function() {
//   console.log("Woof!");
// };

// let dog = new Dog("Buddy");
// dog.makeSound(); // Inherited from Animal
// dog.bark(); // Specific to Dog

// d) Polyfills:
//    As shown in your code, you can use Function.prototype to add methods that might not be available in all JavaScript environments.
// Function.prototype.myBind = function myBind (...args){
//     // Implementation here
// };

// It's important to note that while Function.prototype is powerful, it should be used judiciously. Modifying built-in prototypes can lead to naming conflicts and unexpected behavior in code that relies on the standard behavior of these objects. It's generally safer to extend prototypes of your own custom objects rather than built-in ones.

// In modern JavaScript development, many developers prefer to use classes (introduced in ES6) for creating object-oriented structures, which provide a more familiar syntax for those coming from class-based languages. However, under the hood, classes in JavaScript still use prototypal inheritance.









// Polyfills are JavaScript code snippets that provide implementations for features that are not supported in all browsers. In this case, you want to create polyfills for the call(), apply(), and bind() methods.
// Here's a polyfill for each method:
// 1.
// call() Polyfill:
// Function.prototype.myCall = function(context, ...args) {
//   if (typeof context !== 'object' || context === null) {
//     context = window;
//   }

//   context.fn = this;
//   const result = context.fn(...args);
//   delete context.fn;
//   return result;
// };
// Explanation:
// The myCall method is added to the Function.prototype object.
// It takes the context (the object to be used as this) and any additional arguments to be passed to the function.
// If the context is not an object or is null, it defaults to the global window object.
// The function is assigned to a property of the context object (fn).
// The function is called with the context object as this and the provided arguments.
// The result of the function call is returned.
// The temporary property fn is deleted from the context object.
// 2.
// apply() Polyfill:
// Function.prototype.myApply = function(context, args) {
//   if (typeof context !== 'object' || context === null) {
//     context = window;
//   }

//   context.fn = this;
//   const result = context.fn(...args);
//   delete context.fn;
//   return result;
// };
// Explanation:
// The myApply method is added to the Function.prototype object.
// It takes the context (the object to be used as this) and an array of arguments to be passed to the function (args).
// If the context is not an object or is null, it defaults to the global window object.
// The function is assigned to a property of the context object (fn).
// The function is called with the context object as this and the provided arguments.
// The result of the function call is returned.
// The temporary property fn is deleted from the context object.
// 3.
// bind() Polyfill:
// Function.prototype.myBind = function(context, ...args) {
//   const caller = this;
//   return function(...outerArgs) {
//     return caller.apply(context, [...args, ...outerArgs]);
//   };
// };
// Explanation:
// The myBind method is added to the Function.prototype object.
// It takes the context (the object to be used as this) and any additional arguments to be partially applied to the function (args).
// A new function is returned, which when called, will call the original function (caller) with the provided context and arguments.
// The apply() method is used to call the original function with the specified context and arguments.
// The result of the function call is returned.
// These polyfills provide the same functionality as the native call(), apply(), and bind() methods, but they can be used in environments that do not support these methods.