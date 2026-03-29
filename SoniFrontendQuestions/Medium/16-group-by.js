/**
 * Soni Frontend — Medium — _.groupBy (Meesho)
 * Group by iteratee function, property name, or deep path "a.b.c".
 */

function groupBy(collection, property) {
  if (typeof collection !== "string" && !Array.isArray(collection)) {
    return {};
  }

  const getKey = (item) => {
    if (typeof property === "function") {
      return property(item);
    }
    if (typeof property === "string") {
      const keys = property.split(".");
      let value = item;
      for (const key of keys) {
        value = value[key];
      }
      return value;
    }
  };

  const output = {};
  for (const item of collection) {
    const key = getKey(item);
    if (!output[key]) {
      output[key] = [];
    }
    output[key].push(item);
  }
  return output;
}

console.log(groupBy(1));
console.log(groupBy([6.1, 2.4, 2.7, 6.8], Math.floor));
console.log(groupBy(["one", "two", "three"], "length"));
console.log(
  groupBy(
    [{ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } }],
    "a.b.c"
  )
);
