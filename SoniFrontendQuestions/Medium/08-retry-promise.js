/**
 * Soni Frontend — Medium — Retry promise N times (Agoda, Tekion)
 */

function retryPromise(fn, retries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      fn()
        .then(resolve)
        .catch((error) => {
          if (n <= 1) {
            reject(error);
          } else {
            setTimeout(() => {
              attempt(n - 1);
            }, delay);
          }
        });
    };
    attempt(retries);
  });
}

const fetchData = () => {
  return new Promise((resolve, reject) => {
    const success = Math.random() > 0.5;
    console.log(success, "success");
    if (success) {
      resolve("Data fetched successfully!");
    } else {
      reject(new Error("Failed to fetch data"));
    }
  });
};

retryPromise(fetchData, 3, 1000)
  .then((result) => console.log(result))
  .catch((error) => console.log(error.message));
