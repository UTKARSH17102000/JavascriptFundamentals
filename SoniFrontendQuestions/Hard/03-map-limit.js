/**
 * Soni Frontend — Hard — mapLimit (Uber, Rippling)
 * Async map with concurrency cap; preserves output order.
 */

function getNameById(id, callback) {
  const randomRequestTime = Math.floor(Math.random() * 100) + 2000;
  console.log("randomRequestTime", randomRequestTime, id);
  setTimeout(() => {
    callback("User" + id);
  }, randomRequestTime);
}

function mapLimit(inputs, maxLimit, iterateeFn, callback) {
  const results = new Array(inputs.length);
  let nextIndex = 0;
  let running = 0;
  let completed = 0;

  function processNext() {
    if (completed === inputs.length) {
      callback(results);
      return;
    }
    while (running < maxLimit && nextIndex < inputs.length) {
      const idx = nextIndex++;
      running++;
      iterateeFn(inputs[idx], (output) => {
        results[idx] = output;
        running--;
        completed++;
        processNext();
      });
    }
  }

  if (inputs.length === 0) {
    callback([]);
    return;
  }
  processNext();
}

mapLimit([1, 2, 3, 4, 5], 3, getNameById, (allResults) => {
  console.log("output:", allResults);
});
