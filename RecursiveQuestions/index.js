let users = {
    name: 'John',
    address: {
        personal : {
            street: '123 Main St',
            city: 'New York'
        },
        work : {
            street: '456 Elm St',
            city: 'Los Angeles',
            area: {
              landMark: '123 Main St'
            }
        }
    }

}

let Output = {
    users_name: 'John',
    users_address_personal_street: '123 Main St',
    users_address_personal_city: 'New York',
    users_address_work_street: '456 Elm St',
    users_address_work_city: 'Los Angeles',
    users_address_work_area_landmark: '123 Main St'
}

const flatternedOutput  ={}
const flattern = (input, parent) =>{
  for (let key in input) {
    if (input.hasOwnProperty(key)){
        flattern(input[key], parent? parent + '_' + key : key)
    }else  {
        flatternedOutput[parent? parent + '_' + key : key] = input[key]
    }
  }
}

const result = flattern(input, 'users')



// Let's review the flatten method and discuss potential improvements, edge cases, and follow-up questions.

// First, let's correct and optimize the flatten function:

// index.js
// const flattenObject = (obj, prefix = '') => {
//   let result = {};
//   for (const [key, value] of Object.entries(obj)) {
//     const newKey = prefix ? `${prefix}_${key}` : key;
//     if (value && typeof value === 'object' && !Array.isArray(value)) {
//       Object.assign(result, flattenObject(value, newKey));
//     } else {
//       result[newKey] = value;
//     }
//   }
//   return result;
// };

// const users = {
//   name: 'John',
//   address: {
//     personal: {
//       street: '123 Main St',
//       city: 'New York'
//     },
//     work: {
//       street: '456 Elm St',
//       city: 'Los Angeles',
//       area: {
//         landMark: '123 Main St'
//       }
//     }
//   }
// };

// const flattened = flattenObject(users, 'users');
// console.log(flattened);

// This improved version:
// 1.
// Uses a more descriptive function name flattenObject.
// 2.
// Returns the flattened object instead of modifying a global variable.
// 3.
// Uses Object.entries() for better performance and readability.
// 4.
// Handles nested objects correctly.


// Now, let's address some edge cases and potential follow-up questions:

// 1.
// Handling undefined, null, and array values:


// index.js
// const flattenObject = (obj, prefix = '') => {
//   let result = {};
//   for (const [key, value] of Object.entries(obj)) {
//     const newKey = prefix ? `${prefix}_${key}` : key;
//     if (value === null) {
//       result[newKey] = null;
//     } else if (Array.isArray(value)) {
//       result[newKey] = JSON.stringify(value);
//     } else if (typeof value === 'object') {
//       Object.assign(result, flattenObject(value, newKey));
//     } else {
//       result[newKey] = value;
//     }
//   }
//   return result;
// };

// // Test with edge cases
// const testObj = {
//   a: undefined,
//   b: null,
//   c: [1, 2, 3],
//   d: { e: 'f' }
// };

// console.log(flattenObject(testObj));

// 2.
// Q: How would you handle circular references in the object?
// A: We can add a Set to keep track of processed objects:


// index.js
// const flattenObject = (obj, prefix = '', seen = new Set()) => {
//   let result = {};
//   for (const [key, value] of Object.entries(obj)) {
//     const newKey = prefix ? `${prefix}_${key}` : key;
//     if (value === null) {
//       result[newKey] = null;
//     } else if (Array.isArray(value)) {
//       result[newKey] = JSON.stringify(value);
//     } else if (typeof value === 'object') {
//       if (seen.has(value)) {
//         result[newKey] = '[Circular]';
//       } else {
//         seen.add(value);
//         Object.assign(result, flattenObject(value, newKey, seen));
//       }
//     } else {
//       result[newKey] = value;
//     }
//   }
//   return result;
// };

// 3.
// Q: How would you implement a function to unflatten an object?
// A: Here's an implementation:


// index.js
// const unflattenObject = (obj) => {
//   const result = {};
//   for (const [key, value] of Object.entries(obj)) {
//     const keys = key.split('_');
//     let current = result;
//     for (let i = 0; i < keys.length; i++) {
//       if (i === keys.length - 1) {
//         current[keys[i]] = value;
//       } else {
//         current[keys[i]] = current[keys[i]] || {};
//         current = current[keys[i]];
//       }
//     }
//   }
//   return result;
// };

// // Test
// const flattened = flattenObject(users, 'users');
// console.log(unflattenObject(flattened));

// 4.
// Q: How would you handle very deep nested objects to avoid stack overflow?
// A: We could implement an iterative version using a stack:


// index.js
// const flattenObjectIterative = (obj, prefix = '') => {
//   const result = {};
//   const stack = [[obj, prefix]];
//   while (stack.length > 0) {
//     const [currentObj, currentPrefix] = stack.pop();
//     for (const [key, value] of Object.entries(currentObj)) {
//       const newKey = currentPrefix ? `${currentPrefix}_${key}` : key;
//       if (value === null) {
//         result[newKey] = null;
//       } else if (Array.isArray(value)) {
//         result[newKey] = JSON.stringify(value);
//       } else if (typeof value === 'object') {
//         stack.push([value, newKey]);
//       } else {
//         result[newKey] = value;
//       }
//     }
//   }
//   return result;
// };

// 5.
// Q: How would you modify the function to allow custom separators instead of underscores?
// A: We can add a separator parameter:


// index.js
// const flattenObject = (obj, prefix = '', separator = '_') => {
//   let result = {};
//   for (const [key, value] of Object.entries(obj)) {
//     const newKey = prefix ? `${prefix}${separator}${key}` : key;
//     if (value === null) {
//       result[newKey] = null;
//     } else if (Array.isArray(value)) {
//       result[newKey] = JSON.stringify(value);
//     } else if (typeof value === 'object') {
//       Object.assign(result, flattenObject(value, newKey, separator));
//     } else {
//       result[newKey] = value;
//     }
//   }
//   return result;
// };

// console.log(flattenObject(users, 'users', '.'));

// These improvements and follow-up questions demonstrate a deeper understanding of object manipulation, recursion, and handling edge cases in JavaScript. They also showcase the ability to optimize for performance and handle more complex scenarios.





// Certainly! Let's dive deeper into handling circular references in objects when flattening them, with a proper example and use case.

// Circular references occur when an object contains a reference to itself, either directly or indirectly through a chain of references. These can cause infinite loops in recursive functions like our flatten function. Here's an example and explanation:

// index.js
// // Function to handle circular references
// const flattenObject = (obj, prefix = '', seen = new Set()) => {
//   let result = {};
//   for (const [key, value] of Object.entries(obj)) {
//     const newKey = prefix ? `${prefix}_${key}` : key;
//     if (value === null) {
//       result[newKey] = null;
//     } else if (Array.isArray(value)) {
//       result[newKey] = JSON.stringify(value);
//     } else if (typeof value === 'object') {
//       if (seen.has(value)) {
//         result[newKey] = '[Circular]';
//       } else {
//         seen.add(value);
//         Object.assign(result, flattenObject(value, newKey, seen));
//       }
//     } else {
//       result[newKey] = value;
//     }
//   }
//   return result;
// };

// // Example with circular reference
// const circularObj = {
//   name: 'John',
//   age: 30,
//   details: {
//     job: 'Developer',
//     company: 'Tech Co'
//   }
// };
// circularObj.self = circularObj;  // Creating a circular reference
// circularObj.details.owner = circularObj;  // Another circular reference

// console.log(flattenObject(circularObj));

// Explanation:

// 1.
// We use a Set called seen to keep track of objects we've already processed.
// 2.
// Before processing an object, we check if it's already in the seen set:
// If it is, we've encountered a circular reference, so we replace it with the string '[Circular]'.
// If it's not, we add it to the seen set and continue processing.
// 3.
// We pass the seen set through recursive calls to maintain the list of processed objects.


// Output:
// index.js
// {
//   name: 'John',
//   age: 30,
//   details_job: 'Developer',
//   details_company: 'Tech Co',
//   self: '[Circular]',
//   details_owner: '[Circular]'
// }

// Use Case:
// Handling circular references is crucial when working with complex data structures, especially in scenarios like:

// 1.
// Serialization: When you need to convert an object to a string (e.g., for sending over a network or storing in a database), circular references can cause issues. By handling them, you can safely serialize even complex objects.
// 2.
// Deep cloning: When creating a deep copy of an object, circular references can lead to infinite recursion. This approach allows for safe cloning.
// 3.
// Data processing: In data analysis or transformation tasks, you might encounter objects with circular references. This method allows you to flatten and process such data without errors.
// 4.
// Debugging: When logging complex objects, circular references can make the output unreadable. By flattening with circular reference handling, you get a more useful representation of the object structure.


// Real-world example:
// Imagine you're working with a company's organizational structure:

// index.js
// const company = {
//   name: 'Tech Innovators',
//   CEO: {
//     name: 'Alice Johnson',
//     role: 'Chief Executive Officer'
//   },
//   departments: {
//     engineering: {
//       name: 'Engineering',
//       head: {
//         name: 'Bob Smith',
//         role: 'CTO'
//       }
//     },
//     marketing: {
//       name: 'Marketing',
//       head: {
//         name: 'Carol White',
//         role: 'CMO'
//       }
//     }
//   }
// };

// // Creating circular references
// company.CEO.company = company;
// company.departments.engineering.company = company;
// company.departments.marketing.company = company;

// console.log(flattenObject(company));

// In this scenario, each department and the CEO have a reference back to the company, creating circular references. Our flattening function can handle this complex structure without getting stuck in an infinite loop, producing a flat representation of the company structure that's easy to process or store.

// This approach is particularly useful when dealing with complex, interconnected data structures in real-world applications, ensuring robust and error-free data processing.