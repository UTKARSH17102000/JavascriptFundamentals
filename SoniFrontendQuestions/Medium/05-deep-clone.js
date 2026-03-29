/**
 * Soni Frontend — Medium — Deep clone (Myntra, IBM)
 * Handles Date, RegExp, nested objects/arrays, circular references (WeakMap).
 */

function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (seen.has(obj)) {
    return seen.get(obj);
  }
  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value instanceof Date) {
        clone[key] = new Date(value);
      } else if (value instanceof RegExp) {
        clone[key] = new RegExp(value.source, value.flags);
      } else if (typeof value === "object" && value !== null) {
        clone[key] = deepClone(value, seen);
      } else {
        clone[key] = value;
      }
    }
  }
  return clone;
}

const original = {
  name: "Alice",
  age: 30,
  address: {
    city: "Wonderland",
    country: "Fantasy",
  },
  hobbies: ["reading", "biking"],
  birthDate: new Date(1994, 5, 24),
  regexTest: /abc/i,
};

original.circularRef = original;

const cloned = deepClone(original);
console.log(cloned.circularRef === cloned);
console.log(cloned.circularRef !== original.circularRef);
console.log(cloned.address !== original.address);
console.log(cloned.hobbies !== original.hobbies);
console.log(cloned.birthDate !== original.birthDate);
console.log(cloned.regexTest !== original.regexTest);
console.log(cloned.address.city === original.address.city);
