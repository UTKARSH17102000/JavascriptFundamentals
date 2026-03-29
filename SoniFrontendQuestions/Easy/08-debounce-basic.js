/**
 * Soni Frontend — Easy — Basic debouncing (Flipkart, Intuit)
 */

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

const fn = debounce((message) => {
  console.log(message);
}, 300);

fn("Hello");
fn("Hello, World!");
fn("Debounced!");

setTimeout(() => {
  fn("Debounced twice");
}, 400);
