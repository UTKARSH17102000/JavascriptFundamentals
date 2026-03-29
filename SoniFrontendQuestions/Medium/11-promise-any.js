/**
 * Soni Frontend — Medium — Promise.any polyfill
 */

function myPromiseAny(taskList) {
  let rejectionCount = 0;
  const errors = [];
  return new Promise((resolve, reject) => {
    if (taskList.length === 0) {
      reject(new AggregateError([], "All promises were rejected"));
      return;
    }
    for (let i = 0; i < taskList.length; i++) {
      Promise.resolve(taskList[i])
        .then(resolve)
        .catch((error) => {
          errors[i] = error;
          rejectionCount++;
          if (rejectionCount === taskList.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    }
  });
}

const successTasks = [
  new Promise((_, reject) => setTimeout(() => reject("Error Task 1"), 1000)),
  new Promise((resolve) => setTimeout(() => resolve("Task 2"), 500)),
  new Promise((resolve) => setTimeout(() => resolve("Task 3"), 200)),
];

myPromiseAny(successTasks)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

const failureTasks = [
  new Promise((_, reject) => setTimeout(() => reject("Error Task 1"), 1000)),
  new Promise((_, reject) => setTimeout(() => reject("Error Task 2"), 500)),
];

myPromiseAny(failureTasks)
  .then((result) => console.log(result))
  .catch((error) => console.error(error.name, error.message));
