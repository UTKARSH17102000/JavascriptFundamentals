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




// Webhooks are server-to-server. The client never receives the webhook directly. The flow is:
// External service → Your server (webhook) → Your server → Client (via a channel the client already has)
// That “channel” is usually one of: Server-Sent Events (SSE), WebSockets, or client polling. Here’s a concise flow and snippet for SSE (one-way server → client).
// Flow
// Client opens a long-lived connection to your server (e.g. SSE or WebSocket).
// External service sends a webhook POST to your server.
// Your server handles the webhook, then pushes the same (or derived) data to all connected clients over that connection.
// So: webhook delivers to server → server relays to client.

// Code snippet: Webhook → server → client (SSE)
// 1. Client (browser) – subscribes to updates from your server:


// // Client: open SSE connection to OUR server
// const eventSource = new EventSource('/api/events');

// eventSource.onmessage = (event) => {
//   const data = JSON.parse(event.data);
//   console.log('Update from server:', data);
//   // e.g. { type: 'payment.succeeded', orderId: 123 }
//   // Update UI, show notification, etc.
// };

// eventSource.onerror = () => {
//   console.log('Connection lost, may reconnect');
// };

// 2. Server (Node/Express) – receives webhook, then pushes to clients:

// 

// So:
// Webhook hits POST /webhooks/stripe → server handles it and responds to the external service.
// Same server sends the event to every open SSE response in clients with client.write(...).
// Client gets it in eventSource.onmessage and can update the UI.
// Same idea with WebSockets
// If you use WebSockets instead of SSE, the flow is identical; only the “relay” part changes:
// Client: new WebSocket('wss://yourserver/ws') and ws.onmessage = (e) => { ... }.
// Server: keep a set of WebSocket clients; in the webhook handler, do for (const ws of clients) ws.send(payload).
// So in both cases: information from the external service reaches your server via webhook, and your server relays it to the client over SSE or WebSocket. If you want, we can next write the exact WebSocket version (client + server) in one block.