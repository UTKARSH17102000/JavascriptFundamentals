/**
 * Soni Frontend — Easy — Flatten array (recursive, iterative, depth)
 */

const flattenRecursive = (arr) => {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }
  const result = [];
  for (const ele of arr) {
    if (Array.isArray(ele)) {
      result.push(...flattenRecursive(ele));
    } else {
      result.push(ele);
    }
  }
  return result;
};

const flattenIterative = (arr) => {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const ele = stack.pop();
    if (Array.isArray(ele)) {
      stack.push(...ele);
    } else {
      result.push(ele);
    }
  }
  return result.reverse();
};

const flattenRecursiveWithDepth = (arr, depth) => {
  if (!Array.isArray(arr)) {
    throw new TypeError("The first argument must be an array.");
  }
  const result = [];
  if (depth === 0) return arr;
  for (const ele of arr) {
    if (Array.isArray(ele) && depth > 0) {
      result.push(...flattenRecursiveWithDepth(ele, depth - 1));
    } else {
      result.push(ele);
    }
  }
  return result;
};

const nested = [
  [[[[0]]], [[1]], [[[2]]], [[3]]],
  [[4]],
  [5],
];
console.log("recursive", flattenRecursive(nested));
console.log("iterative", flattenIterative(nested));
console.log(
  "with depth 1",
  flattenRecursiveWithDepth(
    [[[[[0]]], [1], [[[2]]], [3]], [[4]], [5]],
    1
  )
);
