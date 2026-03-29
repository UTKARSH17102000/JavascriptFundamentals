/**
 * Soni Frontend — Medium — JSON.stringify polyfill (Thoughtspot, Multiplier)
 * Omits undefined and functions; null and circular refs handled per spec notes.
 */

class CircularReferenceError extends Error {
  constructor() {
    super("Circular reference detected");
    this.name = "CircularReferenceError";
  }
}

function myStringify(value, seen = new WeakSet()) {
  if (value === null || value === undefined || typeof value === "symbol") {
    return "null";
  }
  if (typeof value === "string") {
    return `"${value}"`;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return `${value}`;
  }
  if (typeof value === "function") {
    return undefined;
  }
  if (Array.isArray(value)) {
    const arrayResult = value
      .map((item) => {
        const s = myStringify(item, seen);
        return s === undefined ? "null" : s;
      })
      .join(",");
    return `[${arrayResult}]`;
  }
  if (typeof value === "object") {
    if (seen.has(value)) {
      throw new CircularReferenceError();
    }
    seen.add(value);
    const objResult = Object.entries(value)
      .filter(([key, val]) => typeof val !== "function" && val !== undefined)
      .map(([key, val]) => `"${key}":${myStringify(val, seen)}`)
      .join(",");
    return `{${objResult}}`;
  }
  throw new Error(`Unsupported data type: ${typeof value}`);
}

const obj = {
  name: "John",
  age: 30,
  city: "New York",
  addr: ["chandpol", "avv"],
  myUndefined: undefined,
  myNull: null,
  circularRef: null,
  nested: {
    name: "Nested",
    valid: true,
  },
  fn: () => {},
};

console.log(myStringify(obj));

obj.circularRef = obj;
try {
  console.log(myStringify(obj));
} catch (error) {
  console.error(error.message);
}
