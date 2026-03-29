/**
 * Soni Frontend — Medium — Flatten nested object (Fractal)
 * Keys use path with underscores; handles arrays (indexed), nested objects, null.
 */

const flattenObject = (obj, prefix = "", result = {}) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}_${key}` : key;
      if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index) => {
          flattenObject(item, `${newKey}_${index}`, result);
        });
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
};

const user = {
  name: "Vishal",
  age: null,
  address: {
    primary: {
      house: "109",
      street: {
        main: "21",
        cross: null,
      },
    },
    secondary: null,
  },
  phones: [
    { type: "home", number: "1234567890" },
    { type: "work", number: null },
  ],
  preferences: null,
};

console.log(flattenObject({ user }));
