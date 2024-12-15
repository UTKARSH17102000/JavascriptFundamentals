// // Event Bubbling Events
document.querySelector("#grandparent").addEventListener("click",() =>{
  console.log("grandparent clicked");
});
document.querySelector("#parent").addEventListener("click",() =>{
    console.log("parent clicked");
});
document.querySelector("#child").addEventListener("click",() =>{
    console.log("child clicked");
});

// Event Capturing Events

document.querySelector("#grandparent").addEventListener("click",() =>{
    console.log("grandparent clicked");
}, true);
  
  document.querySelector("#parent").addEventListener("click",() =>{
      console.log("parent clicked");
}, true);
  
  document.querySelector("#child").addEventListener("click",() =>{
      console.log("child clicked");
}, true);



// stop Propagation 
document.querySelector("#grandparent").addEventListener("click",() =>{
    console.log("grandparent clicked");
});
  
  
document.querySelector("#parent").addEventListener("click",() =>{
      console.log("parent clicked");
});
  
document.querySelector("#child").addEventListener("click",(e) =>{
      console.log("child clicked");
      e.stopPropagation();
});


// Certainly! I'll review the code for event capturing, bubbling, and stop propagation, and provide definitions and potential interview questions for each concept.

// 1.
// Event Bubbling:


// Definition: Event bubbling is a mechanism in which an event triggered on a nested element "bubbles up" through its parent elements in the DOM tree, triggering event handlers on each ancestor element.

// Code example:
// File: d:\GithubRepos\Dev\JavascriptFundamentals\EventBubblingAndCapturing\index.js
// document.querySelector("#grandparent").addEventListener("click",() =>{
//   console.log("grandparent clicked");
// });
// document.querySelector("#parent").addEventListener("click",() =>{
//     console.log("parent clicked");
// });
// document.querySelector("#child").addEventListener("click",() =>{
//     console.log("child clicked");
// });

// In this example, clicking on the child element will trigger the event handlers in the order: child, parent, grandparent.

// 2.
// Event Capturing:


// Definition: Event capturing is the opposite of bubbling. The event starts from the outermost element and propagates inward to the target element.

// Code example:
// File: d:\GithubRepos\Dev\JavascriptFundamentals\EventBubblingAndCapturing\index.js
// document.querySelector("#grandparent").addEventListener("click",() =>{
//     console.log("grandparent clicked");
// }, true);
  
// document.querySelector("#parent").addEventListener("click",() =>{
//     console.log("parent clicked");
// }, true);
  
// document.querySelector("#child").addEventListener("click",() =>{
//     console.log("child clicked");
// }, true);

// In this example, clicking on the child element will trigger the event handlers in the order: grandparent, parent, child. The third parameter true enables the capturing phase.

// 3.
// Stop Propagation:


// Definition: stopPropagation() is a method that prevents the event from bubbling up the DOM tree, stopping parent handlers from being notified of the event.

// Code example:
// File: d:\GithubRepos\Dev\JavascriptFundamentals\EventBubblingAndCapturing\index.js
// document.querySelector("#child").addEventListener("click",(e) =>{
//     console.log("child clicked");
//     e.stopPropagation();
// });

// In this example, the event will not bubble up to parent elements after the child is clicked.

// Potential Interview Questions and Solutions:

// 1.
// What is the difference between event bubbling and event capturing?
// Solution: Event bubbling is when an event starts from the target element and propagates up to the root, triggering event handlers on each ancestor. Event capturing is the opposite, where the event starts from the root and propagates down to the target element.

// 2.
// How can you add an event listener that uses the capturing phase instead of the bubbling phase?
// Solution: You can add an event listener that uses the capturing phase by passing `true` as the third argument to `addEventListener`. For example:
// element.addEventListener('click', handler, true);

// 3.
// What is the purpose of e.stopPropagation(), and when might you use it?
// Solution: `e.stopPropagation()` is used to stop the event from propagating further in the capturing and bubbling phases. You might use it when you want to prevent parent elements from receiving the event after it has been handled by a child element.

// 4.
// Can you explain the order of event execution when both capturing and bubbling are used?
// Solution: When both capturing and bubbling are used, the event first propagates from the root to the target element in the capturing phase, and then from the target element back up to the root in the bubbling phase. Event handlers registered for capturing are executed before those registered for bubbling.

// 5.
// How would you prevent default behavior of an event while still allowing it to propagate?
// Solution: You can prevent the default behavior of an event by using `e.preventDefault()`. This method stops the default action associated with the event but does not stop the event from propagating. For example:
// element.addEventListener('click', (e) => {
//   e.preventDefault();
// });

// 6.
// What is event delegation, and how does it relate to bubbling?
// Solution: Event delegation is a technique where a single event listener is added to a parent element to manage events for multiple child elements. It relies on event bubbling, as the event bubbles up from the child to the parent, allowing the parent to handle the event for all its children.

// 7.
// How can you remove an event listener?
// Solution: You can remove an event listener using the `removeEventListener` method, passing the same event type, handler function, and options (such as capturing) that were used to add it. For example:
// element.removeEventListener('click', handler, true);

// 8.
// What is the difference between e.stopPropagation() and e.preventDefault()?
// Solution: `e.stopPropagation()` stops the event from propagating to parent elements, while `e.preventDefault()` prevents the default action associated with the event from occurring. They can be used independently or together, depending on the desired behavior.

// 9.
// How does the this keyword behave in event handlers?
// Solution: In event handlers, the `this` keyword refers to the element to which the event handler is attached. If you need to refer to the event target, you should use `e.target` instead.

// 10.
// Can you explain the concept of the event object? What properties and methods does it have?
// Solution: The event object is passed to event handlers and contains information about the event. It has properties like `type` (the event type), `target` (the element that triggered the event), and methods like `stopPropagation()` and `preventDefault()`. It provides context and control over the event's behavior.

// These concepts are fundamental to understanding how events work in JavaScript and the DOM, and they're often asked about in interviews to assess a candidate's knowledge of front-end development and DOM manipulation.
