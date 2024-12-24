// Constructor functions in JavaScript are a way to create objects with shared properties and methods. They serve as a blueprint for creating multiple instances of similar objects. Constructor functions are typically named with a capital letter to distinguish them from regular functions.

// Let me provide you with two examples: a counter using constructor functions and a real-life example of a Person constructor.

// 1.
// Counter using Constructor Function:


// Here's an example of creating a counter using a constructor function:

// counter.js
// function Counter() {
//   // Private variable
//   let count = 0;

//   // Public methods
//   this.increment = function() {
//     count++;
//     return count;
//   };

//   this.decrement = function() {
//     count--;
//     return count;
//   };

//   this.getCount = function() {
//     return count;
//   };
// }

// // Usage
// const counter1 = new Counter();
// console.log(counter1.increment()); // 1
// console.log(counter1.increment()); // 2
// console.log(counter1.decrement()); // 1
// console.log(counter1.getCount()); // 1

// const counter2 = new Counter();
// console.log(counter2.getCount()); // 0 (separate instance)

// In this example, Counter is a constructor function that creates counter objects. Each counter has its own private count variable and public methods to manipulate and retrieve the count.

// 2.
// Real-life Example: Person Constructor


// Here's a more practical example of a Person constructor:

// person.js
// function Person(firstName, lastName, age) {
//   this.firstName = firstName;
//   this.lastName = lastName;
//   this.age = age;

//   this.fullName = function() {
//     return `${this.firstName} ${this.lastName}`;
//   };

//   this.isAdult = function() {
//     return this.age >= 18;
//   };
// }

// // Adding a method to the prototype
// Person.prototype.introduce = function() {
//   return `Hi, I'm ${this.fullName()} and I'm ${this.age} years old.`;
// };

// // Usage
// const person1 = new Person("John", "Doe", 30);
// const person2 = new Person("Jane", "Smith", 17);

// console.log(person1.fullName()); // "John Doe"
// console.log(person1.isAdult()); // true
// console.log(person1.introduce()); // "Hi, I'm John Doe and I'm 30 years old."

// console.log(person2.fullName()); // "Jane Smith"
// console.log(person2.isAdult()); // false
// console.log(person2.introduce()); // "Hi, I'm Jane Smith and I'm 17 years old."

// In this example, Person is a constructor function that creates person objects with properties like firstName, lastName, and age. It also includes methods like fullName() and isAdult(). 

// We've also added a method introduce() to the Person.prototype, which means all instances of Person will share this method, saving memory.

// These examples demonstrate how constructor functions can be used to create objects with shared properties and methods, allowing for the creation of multiple instances with their own unique data.
