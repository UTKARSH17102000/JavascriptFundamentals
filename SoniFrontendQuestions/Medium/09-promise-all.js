/**
 * Soni Frontend — Medium — Promise.all polyfill (Salesforce)
 */

function myPromiseAll(taskList) {
  const result = new Array(taskList.length);
  let completed = 0;
  return new Promise((resolve, reject) => {
    if (taskList.length === 0) {
      resolve([]);
      return;
    }
    for (let i = 0; i < taskList.length; i++) {
      Promise.resolve(taskList[i])
        .then((data) => {
          result[i] = data;
          completed++;
          if (completed === taskList.length) {
            resolve(result);
          }
        })
        .catch(reject);
    }
  });
}

const successTasks = [
  new Promise((resolve) => setTimeout(() => resolve("Task 1"), 1000)),
  new Promise((resolve) => setTimeout(() => resolve("Task 2"), 500)),
  new Promise((resolve) => setTimeout(() => resolve("Task 3"), 200)),
  "Test",
  3,
];

myPromiseAll(successTasks)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
