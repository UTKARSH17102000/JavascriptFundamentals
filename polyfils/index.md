Easy Polyfills
1. Array.prototype.map
2. Array.prototype.filter
3. Array.prototype.reduce
4. Function.prototype.bind
 

--- 1. Map ---

```javascript
Array.prototype.myMap = function (callback, thisArg) {
    if (this == null) throw new TypeError('this is null or not defined');
    if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

    const O = Object(this);
    const len = O.length >>> 0;
    const A = new Array(len);

    for (let k = 0; k < len; k++) {
        if (k in O) {
            const kValue = O[k];
            const mappedValue = callback.call(thisArg, kValue, k, O);
            A[k] = mappedValue;
        }
    }
    return A;
};

```

--- 2. Filter ---

```javascript
Array.prototype.myFilter = function (callback, thisArg) {
    if (this == null) throw new TypeError('this is null or not defined');
    if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

    const O = Object(this);
    const len = O.length >>> 0;
    const res = [];

    for (let k = 0; k < len; k++) {
        if (k in O) {
            const val = O[k];
            if (callback.call(thisArg, val, k, O)) {
                res.push(val);
            }
        }
    }
    return res;
};

```

--- 3. Reduce ---

```javascript
Array.prototype.myReduce = function (callback, initialValue) {
    if (this == null) throw new TypeError('this is null or not defined');
    if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

    const O = Object(this);
    const len = O.length >>> 0;
    let k = 0;
    let value;

    if (arguments.length >= 2) {
        value = initialValue;
    } else {
        while (k < len && !(k in O)) {
            k++;
        }
        if (k >= len) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        value = O[k++];
    }

    while (k < len) {
        if (k in O) {
            value = callback(value, O[k], k, O);
        }
        k++;
    }
    return value;
};

```

--- 4. Bind ---

```javascript
Function.prototype.myBind = function (thisArg, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    const self = this;
    const fBound = function (...args2) {
```

If called as a constructor (new fBound()), 'this' will be an instance of fBound
In that case, we ignore thsArg and pass the new instance.
Otherwise, we use thisArg.

```javascript
        const isNew = this instanceof fBound;
        return self.apply(
            isNew ? this : thisArg,
            args.concat(args2)
        );
    };

```

Maintain prototype chain for instanceof checks

```javascript
    if (this.prototype) {
        fBound.prototype = Object.create(this.prototype);
    }

    return fBound;
};

```

--- 5. Flat ---

```javascript
Array.prototype.myFlat = function (depth = 1) {
    if (this == null) throw new TypeError('this is null or not defined');
    const O = Object(this);
    const len = O.length >>> 0;

```

Recursive helper

```javascript
    function flatten(arr, d) {
        let res = [];
        for (let item of arr) {
            if (Array.isArray(item) && d > 0) {
                res.push(...flatten(item, d - 1));
            } else {
                res.push(item);
            }
        }
        return res;
    }

```

Note: The spec says it ignores empty slots if they are flattened,
but preserving them if they are at the top level and not flattened is tricky.
The simple iterative approach with push works well for basic valid arrays.
For a strict polyfill, we need to iterate 0..len and check 'in O'.

```javascript
    let res = [];
    for (let i = 0; i < len; i++) {
        if (i in O) {
            const val = O[i];
            if (Array.isArray(val) && depth > 0) {
                res.push(...val.myFlat(depth - 1));
            } else {
                res.push(val);
            }
        }
    }
    return res;
};

```

--- 6. FlatMap ---

```javascript
Array.prototype.myFlatMap = function (callback, thisArg) {
```

flatMap is map followed by flat(1)

```javascript
    return this.myMap(callback, thisArg).myFlat(1);
};

```

--- 7. Promise.all ---

```javascript
Promise.myAll = function (promises) {
    return new Promise((resolve, reject) => {
```

Handle non-iterable

```javascript
        if (promises == null || typeof promises[Symbol.iterator] !== 'function') {
            reject(new TypeError('Promise.myAll accepts an iterable'));
            return;
        }

        const args = Array.from(promises);
        if (args.length === 0) {
            resolve([]);
            return;
        }

        const result = new Array(args.length);
        let completed = 0;

        args.forEach((p, i) => {
```

Use Promise.resolve to handle non-promise values

```javascript
            Promise.resolve(p).then(val => {
                result[i] = val;
                completed++;
                if (completed === args.length) {
                    resolve(result);
                }
            }, err => {
                reject(err);
            });
        });
    });
};

```

--- 8. Promise.race ---

```javascript
Promise.myRace = function (promises) {
    return new Promise((resolve, reject) => {
        if (promises == null || typeof promises[Symbol.iterator] !== 'function') {
            reject(new TypeError('Promise.myRace accepts an iterable'));
            return;
        }

        const args = Array.from(promises);
```

If args is empty, it stays pending forever (spec behavior)

```javascript
        for (let i = 0; i < args.length; i++) {
            Promise.resolve(args[i]).then(resolve, reject);
        }
    });
};

```

--- 9. Function.prototype.apply / call ---
Logic: Assign function to the context object as a property, call it, then delete it.

```javascript
Function.prototype.myCall = function (thisArg, ...args) {
```

1. Handle primitive or null/undefined thisArg

```javascript
    let context = thisArg;
    if (context === null || context === undefined) {
        context = global; // or look for window/globalThis shim
    } else {
        context = Object(context); // Wrap primitives e.g. 5 -> Number(5)
    }

```

2. Create unique property

```javascript
    const fnSymbol = Symbol('fn');
    context[fnSymbol] = this;

```

3. Execute

```javascript
    const result = context[fnSymbol](...args);

```

4. Cleanup

```javascript
    delete context[fnSymbol];

```

5. Return

```javascript
    return result;
};

Function.prototype.myApply = function (thisArg, argsArray) {
    let context = thisArg;
    if (context === null || context === undefined) {
        context = global;
    } else {
        context = Object(context);
    }

    if (argsArray != null && !Array.isArray(argsArray) && typeof argsArray !== 'object') {
        throw new TypeError('CreateListFromArrayLike called on non-object');
    }

    const fnSymbol = Symbol('fn');
    context[fnSymbol] = this;

    let result;
    if (!argsArray) {
        result = context[fnSymbol]();
    } else {
```

We can use spread here because we are in ES6+ env usually for these exercises.
If ES5 strictly, we'd need to use eval (yuck) which is how original polyfills worked.

```javascript
        result = context[fnSymbol](...argsArray);
    }

    delete context[fnSymbol];
    return result;
};

```

--- 10. Promise.allSettled ---

```javascript
Promise.myAllSettled = function (promises) {
    return new Promise((resolve, reject) => {
        if (promises == null || typeof promises[Symbol.iterator] !== 'function') {
            reject(new TypeError('Promise.myAllSettled accepts an iterable'));
            return;
        }

        const args = Array.from(promises);
        if (args.length === 0) {
            resolve([]);
            return;
        }

        const result = new Array(args.length);
        let completed = 0;

        args.forEach((p, i) => {
            Promise.resolve(p).then(
                value => {
                    result[i] = { status: 'fulfilled', value };
                    completed++;
                    if (completed === args.length) resolve(result);
                },
                reason => {
                    result[i] = { status: 'rejected', reason };
                    completed++;
                    if (completed === args.length) resolve(result);
                }
            );
        });
    });
};

```

--- 11. Promise.any ---

```javascript
Promise.myAny = function (promises) {
    return new Promise((resolve, reject) => {
        if (promises == null || typeof promises[Symbol.iterator] !== 'function') {
            reject(new TypeError('Promise.myAny accepts an iterable'));
            return;
        }

        const args = Array.from(promises);
        if (args.length === 0) {
            reject(new AggregateError([], 'All promises were rejected'));
            return;
        }

        const errors = new Array(args.length);
        let rejectedCount = 0;

        args.forEach((p, i) => {
            Promise.resolve(p).then(
                resolve, // Resolve as soon as one fulfills
                err => {
                    errors[i] = err;
                    rejectedCount++;
                    if (rejectedCount === args.length) {
                        reject(new AggregateError(errors, 'All promises were rejected'));
                    }
                }
            );
        });
    });
};

```

--- 12. Deep Clone ---
Handles: Primitives, Objects, Arrays, Date, RegExp, Map, Set, Circular References

```javascript
function myDeepClone(obj, hash = new WeakMap()) {
```

1. Primitives and Null

```javascript
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

```

2. Circular Reference Check

```javascript
    if (hash.has(obj)) {
        return hash.get(obj);
    }

```

3. Handle Special Types
Date

```javascript
    if (obj instanceof Date) {
        return new Date(obj);
    }
```

RegExp

```javascript
    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }

```

4. Handle Map and Set

```javascript
    if (obj instanceof Map) {
        const result = new Map();
        hash.set(obj, result);
        obj.forEach((value, key) => {
```

Note: Keys in Map can be objects too, so ideally deep clone keys? 
Usually keys are primitives or refs we want to keep, but strictly deep clone means deep clone keys too.

```javascript
            result.set(myDeepClone(key, hash), myDeepClone(value, hash));
        });
        return result;
    }
    if (obj instanceof Set) {
        const result = new Set();
        hash.set(obj, result);
        obj.forEach(value => {
            result.add(myDeepClone(value, hash));
        });
        return result;
    }

```

5. Handle Array and Generic Objects
Using constructor ensures we keep the prototype chain (mostly) and Array vs Object

```javascript
    const result = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));

    hash.set(obj, result);

```

Reflect.ownKeys gets symbol properties too

```javascript
    Reflect.ownKeys(obj).forEach(key => {
        result[key] = myDeepClone(obj[key], hash);
    });

    return result;
}
```

Attach to Object for convenience in tests (not standard)

```javascript
Object.myDeepClone = myDeepClone;

```

Export for testing if needed

```javascript
module.exports = { myDeepClone };

```
