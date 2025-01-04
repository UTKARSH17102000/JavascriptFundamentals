// Async/await is a JavaScript feature that provides a more synchronous and readable way to handle asynchronous operations. It works behind the scenes by using Promises and generators.
// Here's a brief explanation of how async/await works:
// 1.
// Async/await allows you to write asynchronous code as if it were synchronous, using the async keyword before a function declaration.
// 2.
// Inside an async function, you can use the await keyword before a Promise to wait for its resolution.
// 3.
// When the await keyword is used, the execution of the async function is paused until the Promise is fulfilled or rejected.
// 4.
// Once the Promise is resolved, the result is returned and the execution of the async function continues.
// 5.
// If an error occurs in a Promise, it can be caught using a try-catch block inside the async function.
// Here's an example of using async/await:
// async function fetchData() {
//   try {
//     const response = await fetch('https://api.example.com/data');
//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// fetchData();
// In this example, the fetchData function is declared as an async function. Inside the function, the await keyword is used before the fetch call to wait for the response. Once the response is received, the JSON data is extracted using another await keyword. If an error occurs during the fetch or parsing, it is caught using a try-catch block.
// Here are some questions and answers that can be asked in a JavaScript interview related to async/await:
// 1.
// What is the difference between Promises and async/await?
// Promises are used to handle asynchronous operations, while async/await is a more synchronous-looking way to handle them.
// Async/await allows you to write asynchronous code as if it were synchronous, using the async keyword before a function declaration.
// 2.
// How does the await keyword work in async/await?
// The await keyword is used before a Promise to wait for its resolution.
// When the await keyword is used, the execution of the async function is paused until the Promise is fulfilled or rejected.
// Once the Promise is resolved, the result is returned and the execution of the async function continues.
// 3.
// What is the difference between using Promises and async/await for handling asynchronous operations?
// Promises provide a more flexible and powerful way to handle asynchronous operations, allowing you to chain multiple Promises together and handle errors using the then and catch methods.
// Async/await provides a more synchronous-looking way to handle asynchronous operations, making it easier to write and read code.
// 4.
// How can error handling be done in async/await?
// Error handling in async/await can be done using a try-catch block inside the async function.
// If an error occurs during the execution of the async function, it can be caught using a try-catch block.
// The error can then be logged or handled in any way desired.
// 5.
// What is the difference between using Promise.all and Promise.race for handling multiple Promises?
// Promise.all waits for all Promises in the array to resolve and then fulfills the new Promise with an array of results.
// Promise.race waits for the first Promise in the array to resolve or reject and then fulfills the new Promise with the result or error.
// 6.
// How can async/await be used to handle multiple asynchronous operations concurrently?
// Async/await can be used to handle multiple asynchronous operations concurrently by using the await keyword before each Promise.
// This allows you to write code that appears to be synchronous, while still taking advantage of the benefits of asynchronous operations.
// I hope this helps! Let me know if you have any further questions.




// Async Function will always return a Promise