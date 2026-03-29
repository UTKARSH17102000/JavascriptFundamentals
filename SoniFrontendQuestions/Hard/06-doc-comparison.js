/**
 * Soni Frontend — Hard — Deep JSON diff with from / to (Google)
 */

function compareObjects(obj1, obj2) {
  const difference = {};
  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  const compareKeys = (key, o1, o2, parent) => {
    if (!(key in o1)) {
      parent[key] = { to: o2[key], from: "EMPTY" };
    } else if (!(key in o2)) {
      parent[key] = { from: o1[key], to: "EMPTY" };
    } else if (
      typeof o1[key] === "object" &&
      o1[key] !== null &&
      typeof o2[key] === "object" &&
      o2[key] !== null
    ) {
      parent[key] = compareObjects(o1[key], o2[key]);
    } else if (o1[key] !== o2[key]) {
      parent[key] = { from: o1[key], to: o2[key] };
    }
  };

  keys.forEach((key) => compareKeys(key, obj1, obj2, difference));
  return difference;
}

const doc1 = {
  name: "John",
  age: 12,
  address: {
    city: "Boston",
    zip: "10001",
    country: "USA",
  },
  phone: "987-654-3210",
  friends: {
    friend1: { name: "Alice", age: 30 },
    friend2: { name: "Bob", age: 25 },
  },
  hobbies: ["table tennis"],
};

const doc2 = {
  name: "John",
  age: 14,
  address: {
    city: "New York",
    zip: "10001",
    country: "Canada",
  },
  phone: "123-456-7890",
  friends: {
    friend1: { name: "Alice", age: 30 },
    friend2: { name: "Bob", age: 26 },
  },
  country: "India",
};

const diff = compareObjects(doc1, doc2);
console.log(JSON.stringify(diff, null, 2));
