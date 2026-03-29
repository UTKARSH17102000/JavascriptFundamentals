/**
 * Soni Frontend — Medium — clearAllTimeout polyfill (Dream11)
 * Tracks timeout IDs from patched setTimeout and clears all via clearAllTimeout().
 */

(function () {
  let timeouts = [];
  const originalSetTimeout = global.setTimeout;
  global.setTimeout = function (callback, delay, ...args) {
    const timeoutId = originalSetTimeout(callback, delay, ...args);
    timeouts.push(timeoutId);
    return timeoutId;
  };
  global.clearAllTimeout = function () {
    timeouts.forEach((id) => global.clearTimeout(id));
    timeouts = [];
  };
})();

const timeout1 = setTimeout(() => console.log("Timeout 1"), 10000);
const timeout2 = setTimeout(() => console.log("Timeout 2"), 3000);
const timeout3 = setTimeout(() => console.log("Timeout 3"), 4000);
setTimeout(() => {
  console.log("Clearing all timeouts...");
  clearAllTimeout();
}, 5000);
