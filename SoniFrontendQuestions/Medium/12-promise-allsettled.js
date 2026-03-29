/**
 * Soni Frontend — Medium — Promise.allSettled polyfill
 */

function myPromiseAllSettled(taskList) {
  const result = new Array(taskList.length);
  let completed = 0;
  return new Promise((resolve) => {
    if (taskList.length === 0) {
      resolve([]);
      return;
    }
    for (let i = 0; i < taskList.length; i++) {
      Promise.resolve(taskList[i])
        .then((value) => {
          result[i] = { status: "fulfilled", value };
        })
        .catch((reason) => {
          result[i] = { status: "rejected", reason };
        })
        .finally(() => {
          completed++;
          if (completed === taskList.length) {
            resolve(result);
          }
        });
    }
  });
}

const mixedTasks = [
  new Promise((resolve) => setTimeout(() => resolve("Task 1"), 1000)),
  new Promise((_, reject) => setTimeout(() => reject("Error Task 2"), 500)),
  "Immediate Value",
  new Promise((resolve) => setTimeout(() => resolve("Task 3"), 200)),
];

myPromiseAllSettled(mixedTasks).then((result) => console.log(result));
