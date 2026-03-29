/**
 * Soni Frontend — Medium — Dispatch callback on Array.prototype.push (PharmEasy)
 */

const originalPush = Array.prototype.push;

Array.prototype.push = function (...args) {
  const result = originalPush.apply(this, args);
  if (this.onPush) {
    this.onPush(args);
  }
  return result;
};

Array.prototype.setPushCb = function (callback) {
  if (typeof callback === "function") {
    this.onPush = callback;
  } else {
    throw new TypeError("Callback must be a function");
  }
};

const arr = [];
arr.setPushCb((items) => {
  console.log("Items pushed:", items);
});
arr.push(1);
arr.push(2, 3);
