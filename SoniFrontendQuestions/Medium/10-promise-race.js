/**
 * Soni Frontend — Medium — Promise.race polyfill
 */

function myPromiseRace(taskList) {
  return new Promise((resolve, reject) => {
    if (taskList.length === 0) {
      return;
    }
    for (let i = 0; i < taskList.length; i++) {
      Promise.resolve(taskList[i]).then(resolve).catch(reject);
    }
  });
}

const successRaceTasks = [
  new Promise((resolve) => setTimeout(() => resolve("Task 1"), 1000)),
  new Promise((resolve) => setTimeout(() => resolve("Task 2"), 500)),
  new Promise((resolve) => setTimeout(() => resolve("Task 3"), 200)),
];

myPromiseRace(successRaceTasks)
  .then((result) => console.log("race success:", result))
  .catch((error) => console.error(error));

const errorRaceTasks = [
  new Promise((resolve, reject) => setTimeout(() => reject("Error 1"), 500)),
  new Promise((resolve) => setTimeout(() => resolve("Task 2"), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject("Error 2"), 200)),
];

myPromiseRace(errorRaceTasks)
  .then((result) => console.log(result))
  .catch((error) => console.error("race error:", error));
