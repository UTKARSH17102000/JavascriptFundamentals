document.querySelector('#category').addEventListener('click', (e) =>{
   console.log('category clicked', e);
   if(e.target.tagName === 'LI'){
    // window.location.href = '/' + e.target.id;
   }
});

// Certainly! I'd be happy to explain event delegation, provide real-life examples, and discuss its pros and cons.

// Event Delegation Definition:
// Event delegation is a technique in JavaScript where you attach a single event listener to a parent element instead of attaching multiple listeners to individual child elements. This approach leverages the event bubbling mechanism, allowing you to handle events for multiple elements with a single handler.

// Real-life Examples:

// 1.
// Dynamic Content Management:
// Managing click events on a large list of items (e.g., todo list, product catalog)
// Handling interactions in a complex table with many rows and columns
// 2.
// Menu Systems:
// Implementing dropdown menus or navigation bars
// 3.
// Form Validation:
// Managing input events for multiple form fields
// 4.
// Chat Applications:
// Handling message interactions (like, delete, edit) in a chat window
// 5.
// Social Media Feeds:
// Managing interactions (like, comment, share) on multiple posts


// Let's look at some code snippets to achieve event delegation:

// 1.
// Basic Event Delegation:


// index.js
// document.querySelector('#category').addEventListener('click', (e) => {
//    if (e.target.tagName === 'LI') {
//        console.log('List item clicked:', e.target.textContent);
//        // Perform action based on the clicked item
//    }
// });

// 2.
// Event Delegation with Data Attributes:


// index.js
// document.querySelector('#product-list').addEventListener('click', (e) => {
//    if (e.target.matches('[data-action="buy"]')) {
//        const productId = e.target.closest('li').dataset.productId;
//        console.log('Buy button clicked for product:', productId);
//        // Perform buy action
//    }
// });

// 3.
// Event Delegation for Dynamic Content:


// index.js
// document.querySelector('#todo-list').addEventListener('click', (e) => {
//    if (e.target.classList.contains('delete-btn')) {
//        const todoItem = e.target.closest('li');
//        console.log('Deleting todo item:', todoItem.textContent);
//        todoItem.remove();
//    } else if (e.target.classList.contains('edit-btn')) {
//        const todoItem = e.target.closest('li');
//        console.log('Editing todo item:', todoItem.textContent);
//        // Implement edit functionality
//    }
// });

// Pros of Event Delegation:

// 1.
// Memory Efficiency: Reduces the number of event listeners, saving memory.
// 2.
// Dynamic Elements: Works with dynamically added elements without needing to attach new listeners.
// 3.
// Less Code: Simplifies code by centralizing event handling.
// 4.
// Performance: Can improve performance, especially with a large number of similar elements.
// 5.
// Easier Maintenance: Simplifies adding or removing elements without updating event listeners.


// Cons of Event Delegation:

// 1.
// Not Suitable for All Events: Some events don't bubble (e.g., focus, blur), making delegation impossible.
// 2.
// Slightly More Complex Logic: Requires additional checks to determine the target element.
// 3.
// Potential for Unintended Triggers: If not implemented carefully, may lead to unexpected event handling.
// 4.
// Slight Performance Overhead: For simple pages with few elements, individual listeners might be faster.
// 5.
// Less Specific: Can make it harder to stop event propagation for specific child elements.


// In your interview, you could explain these concepts and provide examples of how you've used event delegation in your projects. Remember to emphasize its benefits in handling dynamic content and improving performance in large-scale applications.