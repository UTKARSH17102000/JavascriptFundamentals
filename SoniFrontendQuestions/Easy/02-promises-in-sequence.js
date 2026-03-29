/**
 * Soni Frontend — Easy — Promises in sequence (Sumologic, Forward Network)
 * Run async tasks one after another; collect resolved values and rejections.
 */

const createAsyncTask = () => {
  const randomVal = Math.floor(Math.random() * 10);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomVal > 5) {
        resolve(randomVal);
      } else {
        reject(randomVal);
      }
    }, randomVal * 100);
  });
};

const tasks = [
  createAsyncTask,
  createAsyncTask,
  createAsyncTask,
  createAsyncTask,
  createAsyncTask,
];

const taskRunnerIterative = async (tasks, cb) => {
  const result = [];
  const error = [];
  for (const task of tasks) {
    try {
      const successTask = await task();
      result.push(successTask);
    } catch (e) {
      error.push(e);
    }
  }
  cb(result, error);
};

const taskRunnerRecursion = (tasks, cb) => {
  const result = [];
  const error = [];

  const helper = (ptr = 0) => {
    if (ptr === tasks.length) {
      cb(result, error);
      return;
    }
    tasks[ptr]()
      .then((num) => {
        result.push(num);
      })
      .catch((num) => {
        error.push(num);
      })
      .finally(() => {
        helper(++ptr);
      });
  };

  helper();
};

taskRunnerIterative(tasks, (result, err) =>
  console.log("iterative:", result, err)
);
taskRunnerRecursion(tasks, (result, err) =>
  console.log("recursive:", result, err)
);
