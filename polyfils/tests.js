const tests = [];
// const { describe, it, expect, runTests } = require('./tests.js'); // Error: circular
require('./index.js'); // Load the polyfills

async function main() {
    describe('Array.prototype.myMap', () => {
        it('should map values', () => {
            const input = [1, 2, 3];
            const output = input.myMap(x => x * 2);
            expect(output).toEqual([2, 4, 6]);
        });
        it('should handle index and array args', () => {
            const input = [1];
            input.myMap((val, i, arr) => {
                expect(val).toBe(1);
                expect(i).toBe(0);
                expect(arr).toBe(input);
            });
        });
        it('should handle sparse arrays', () => {
            const input = [1, , 3];
            const output = input.myMap(x => x * 2);
            // Expected: [2, <empty>, 6]
            // Arrays with empty slots are tricky to strictly equal in simplistic framework without checking keys
            // But JSON.stringify usually handles it as null or similar, let's just check specific indices
            expect(output[0]).toBe(2);
            expect(2 in output).toBe(true);
            expect(1 in output).toBe(false); // Sparse
        });
        it('should handle thisArg', () => {
            const context = { multiplier: 3 };
            const input = [10];
            const output = input.myMap(function (x) { return x * this.multiplier; }, context);
            expect(output).toEqual([30]);
        });
    });

    describe('Array.prototype.myFilter', () => {
        it('should filter values', () => {
            const input = [1, 2, 3, 4];
            const output = input.myFilter(x => x % 2 === 0);
            expect(output).toEqual([2, 4]);
        });
        it('should handle sparse arrays (skip empty)', () => {
            const input = [1, , 3]; // index 1 is empty
            const output = input.myFilter(x => true);
            expect(output).toEqual([1, 3]); // Filter skips sparse slots
        });
        it('should handle thisArg', () => {
            const context = { min: 2 };
            const input = [1, 2, 3];
            const output = input.myFilter(function (val) { return val > this.min; }, context);
            expect(output).toEqual([3]);
        });
    });

    describe('Array.prototype.myReduce', () => {
        it('should reduce values', () => {
            const input = [1, 2, 3];
            const output = input.myReduce((acc, x) => acc + x, 0);
            expect(output).toBe(6);
        });
        it('should work without initial value', () => {
            const input = [1, 2, 3];
            const output = input.myReduce((acc, x) => acc + x);
            expect(output).toBe(6);
        });
        it('should throw on empty array no initial', () => {
            expect(() => [].myReduce(x => x)).toThrow();
        });
        it('should handle sparse arrays', () => {
            // [1, , 3] -> reduce with + -> 1+3=4
            const input = [1, , 3];
            const output = input.myReduce((acc, x) => acc + x, 0);
            expect(output).toBe(4);
        });
    });

    describe('Function.prototype.myBind', () => {
        it('should bind context', () => {
            const obj = { x: 42 };
            function getX() { return this.x; }
            const bound = getX.myBind(obj);
            expect(bound()).toBe(42);
        });
        it('should bind args', () => {
            function add(a, b) { return a + b; }
            const add5 = add.myBind(null, 5);
            expect(add5(10)).toBe(15);
        });
        it('should be newable', () => {
            function Person(name) { this.name = name; }
            const BoundPerson = Person.myBind(null); // Context ignored with new
            const p = new BoundPerson('Alice');
            expect(p.name).toBe('Alice');
            expect(p instanceof Person).toBe(true);
            expect(p instanceof BoundPerson).toBe(true);
        });
    });


    describe('Array.prototype.myFlat', () => {
        it('should flat default depth 1', () => {
            expect([1, [2], 3].myFlat()).toEqual([1, 2, 3]);
        });
        it('should flat depth 2', () => {
            expect([1, [2, [3]]].myFlat(2)).toEqual([1, 2, 3]);
        });
        it('should handle nested holes', () => {
            // [1, <empty>, [2, <empty>]] -> flat -> [1, 2] ignoring holes
            const arr = [1, , [2,]];
            const flattened = arr.myFlat();
            expect(flattened).toEqual([1, 2]);
        });
    });

    describe('Array.prototype.myFlatMap', () => {
        it('should map and flat', () => {
            const arr = [1, 2, 3];
            const result = arr.myFlatMap(x => [x, x * 2]);
            expect(result).toEqual([1, 2, 2, 4, 3, 6]);
        });
    });

    describe('Promise.myAll', () => {
        it('should resolve when all resolve', async () => {
            const p1 = Promise.resolve(1);
            const p2 = 2; // value
            const p3 = new Promise((res) => setTimeout(() => res(3), 10));
            const result = await Promise.myAll([p1, p2, p3]);
            expect(result).toEqual([1, 2, 3]);
        });
        it('should reject if one rejects', async () => {
            const p1 = Promise.resolve(1);
            const p2 = Promise.reject('error');
            try {
                await Promise.myAll([p1, p2]);
                throw new Error('Should have rejected');
            } catch (e) {
                expect(e).toBe('error');
            }
        });
        it('should resolve empty array immediately', async () => {
            const res = await Promise.myAll([]);
            expect(res).toEqual([]);
        });
    });

    describe('Function.prototype.myCall', () => {
        it('should change context', () => {
            const obj = { id: 'obj' };
            function getId() { return this.id; }
            expect(getId.myCall(obj)).toBe('obj');
        });
        it('should pass args', () => {
            function add(a, b) { return a + b + (this.base || 0); }
            expect(add.myCall({ base: 10 }, 1, 2)).toBe(13);
        });
    });


    describe('Promise.myRace', () => {
        it('should race resolve', async () => {
            const p1 = new Promise(r => setTimeout(() => r(1), 10));
            const p2 = new Promise(r => setTimeout(() => r(2), 20)); // slower
            const res = await Promise.myRace([p1, p2]);
            expect(res).toBe(1);
        });
        it('should race reject', async () => {
            const p1 = new Promise((_, r) => setTimeout(() => r('fail'), 10));
            const p2 = new Promise(r => setTimeout(() => r(2), 20));
            try {
                await Promise.myRace([p1, p2]);
                throw new Error('should fail');
            } catch (e) {
                expect(e).toBe('fail');
            }
        });
    });

    describe('Function.prototype.myApply', () => {
        it('should work like call but with array', () => {
            function sum(a, b) { return a + b; }
            expect(sum.myApply(null, [1, 2])).toBe(3);
        });
    });

    describe('Promise.myAllSettled', () => {
        it('should settle all', async () => {
            const p1 = Promise.resolve(1);
            const p2 = Promise.reject('err');
            const res = await Promise.myAllSettled([p1, p2]);
            expect(res.length).toBe(2);
            expect(res[0].status).toBe('fulfilled');
            expect(res[0].value).toBe(1);
            expect(res[1].status).toBe('rejected');
            expect(res[1].reason).toBe('err');
        });
    });

    describe('Promise.myAny', () => {
        it('should resolve with first success', async () => {
            const p1 = Promise.reject('e1');
            const p2 = Promise.resolve('success');
            const res = await Promise.myAny([p1, p2]);
            expect(res).toBe('success');
        });
        it('should throw AggregateError if all fail', async () => {
            const p1 = Promise.reject('e1');
            const p2 = Promise.reject('e2');
            try {
                await Promise.myAny([p1, p2]);
                throw new Error('should throw');
            } catch (e) {
                expect(e.name).toBe('AggregateError');
                expect(e.errors.length).toBe(2);
            }
        });
    });

    describe('Deep Clone', () => {
        it('should clone primitives', () => {
            expect(Object.myDeepClone(5)).toBe(5);
        });
        it('should clone nested objects', () => {
            const obj = { a: { b: 2 } };
            const clone = Object.myDeepClone(obj);
            expect(clone).toEqual(obj);
            expect(clone).not.toBe(obj); // check reference integrity
            expect(clone.a).not.toBe(obj.a);
        });
        it('should handle circular refs', () => {
            const obj = { a: 1 };
            obj.self = obj;
            const clone = Object.myDeepClone(obj);
            expect(clone.a).toBe(1);
            expect(clone.self).toBe(clone); // Points to new clone, not old obj
            expect(clone.self).not.toBe(obj);
        });
        it('should handle Date', () => {
            const d = new Date('2023-01-01');
            const clone = Object.myDeepClone(d);
            expect(clone.getTime()).toBe(d.getTime());
            expect(clone).not.toBe(d);
        });
        it('should handle Arrays', () => {
            const arr = [1, { a: 2 }];
            const clone = Object.myDeepClone(arr);
            expect(clone[0]).toBe(1);
            expect(clone[1].a).toBe(2);
            expect(clone).not.toBe(arr);
        });
    });

    await runTests();
}

main();


function describe(name, fn) {
    console.log(`\n📦 ${name}`);
    fn();
}

function it(name, fn) {
    tests.push({ name, fn });
}

function expect(actual) {
    const matchers = (isNot = false) => ({
        toBe: (expected) => {
            if (!isNot && actual === expected) return;
            if (isNot && actual !== expected) return;
            throw new Error(`Expected ${actual} ${isNot ? 'not ' : ''}to be ${expected}`);
        },
        toEqual: (expected) => {
            const actualStr = JSON.stringify(actual);
            const expectedStr = JSON.stringify(expected);
            if (!isNot && actualStr === expectedStr) return;
            if (isNot && actualStr !== expectedStr) return;
            throw new Error(`Expected ${actualStr} ${isNot ? 'not ' : ''}to equal ${expectedStr}`);
        },
        toThrow: () => {
            let threw = false;
            try { actual(); } catch (e) { threw = true; }
            if (!isNot && threw) return;
            if (isNot && !threw) return;
            throw new Error(`Expected function ${isNot ? 'not ' : ''}to throw`);
        }
    });

    const base = matchers(false);
    base.not = matchers(true);
    return base;
}

async function runTests() {
    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            await test.fn();
            console.log(`  ✅ ${test.name}`);
            passed++;
        } catch (e) {
            console.log(`  ❌ ${test.name}`);
            console.error(`     ${e.message}`);
            failed++;
        }
    }

    console.log(`\nResults: ${passed} passed, ${failed} failed.`);
}

// Export checks
module.exports = { describe, it, expect, runTests };

// --- Polyfill Imports (Will be uncommented as we implement) ---
// require('./index.js');
