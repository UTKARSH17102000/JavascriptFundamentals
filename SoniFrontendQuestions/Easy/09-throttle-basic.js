/**
 * Soni Frontend — Easy — Basic throttling (Sumo Logic, Hotstar)
 */

const throttleFnTimeBased = (fn, delay) => {
  let lastExecuted = null;
  let timerId = null;
  return function (...args) {
    if (!lastExecuted) {
      fn.apply(this, args);
      lastExecuted = Date.now();
    } else {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        if (Date.now() - lastExecuted >= delay) {
          fn.apply(this, args);
          lastExecuted = Date.now();
        }
      }, delay - (Date.now() - lastExecuted));
    }
  };
};

const throttledFunction = throttleFnTimeBased((msg) => {
  console.log(msg, Date.now());
}, 2000);

throttledFunction("Call 1");
throttledFunction("Call 2");
throttledFunction("Call 3");
setTimeout(() => throttledFunction("Call 4"), 1100);
setTimeout(() => throttledFunction("Call 5"), 900);
setTimeout(() => throttledFunction("Call 6"), 2100);
