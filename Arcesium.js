
// Second greatest Frequency
// array = [4,5,6,2,1,3,3,5,3,7,3,9,2,2]
// Output : 2 ( most occurring is '3' count is 4 and second most occurring is '2' count is 3)




// Garbage Collector.
// what is the use call, bind and apply. Why we need them.



// Garbage Collection in JavaScript
// What is it?
// JavaScript automatically manages memory. You don't malloc/free like in C/C++. The Garbage Collector (GC) is the engine component that automatically frees memory that is no longer reachable/used.

// The Core Algorithm: Mark-and-Sweep
// Modern JavaScript engines (V8, SpiderMonkey) use Mark-and-Sweep as the primary GC algorithm.

// How it works — step by step:

// ┌─────────────────────────────────────────────────────┐
// │                    MEMORY HEAP                       │
// │                                                      │
// │  [ROOTS] ──► obj1 ──► obj2 ──► obj3 (REACHABLE ✅)  │
// │                │                                     │
// │                └────► obj4 (REACHABLE ✅)            │
// │                                                      │
// │  obj5 ──► obj6  (No path from roots = UNREACHABLE ❌)│
// └─────────────────────────────────────────────────────┘

// Phase 1 — MARK: GC starts from "roots" (global variables, call stack, closures) and traverses every reachable object, marking them as "alive".

// Phase 2 — SWEEP: Everything NOT marked is dead. GC frees that memory.

// What are "Roots"?
// Global variables (window, globalThis)
// Currently executing function's local variables
// Variables in the call stack
// Variables referenced by closures

// Memory Lifecycle
// // 1. ALLOCATE — memory is allocated
// let user = { name: "Alice", age: 30 };

// // 2. USE — memory is read/written
// console.log(user.name);

// // 3. RELEASE — reference is dropped, GC can now collect
// user = null; // Object { name: "Alice" } is now unreachable ❌




// Key Concept: Reachability

// // Example 1: Simple reference removal
// let obj = { data: "hello" };
// obj = null;          // ✅ GC can collect { data: "hello" }

// // Example 2: Interlinked objects — GC still handles it!
// function createLink() {
//     let a = {};
//     let b = {};
//     a.ref = b;       // a → b
//     b.ref = a;       // b → a (circular!)
//     return null;     // both a and b are now unreachable from roots
// }
// createLink();
// // ✅ GC collects BOTH a and b despite the circular reference
// // Old "reference counting" algorithm FAILED here, but Mark-and-Sweep handles it!


// 🔑 Key insight: It's not about "how many things point to an object" (reference counting) — it's about whether the object is reachable from a root. This is why modern GC handles circular references correctly.


//⚠️ Common Memory Leaks (GC can't help if YOU hold the reference)


// // ❌ LEAK 1: Forgotten global variable
// function oops() {
//     leakedVar = "I'm global!"; // No `let/const/var` → attached to window!
// }

// // ❌ LEAK 2: Detached DOM nodes
// let btn = document.getElementById('btn');
// document.body.removeChild(btn); // Removed from DOM...
// // ...but `btn` variable still holds a reference! GC cannot collect it.
// btn = null; // ✅ Now GC can collect it

// // ❌ LEAK 3: Event listeners not removed
// const el = document.getElementById('el');
// el.addEventListener('click', handleClick);
// document.body.removeChild(el);
// // el is detached but handleClick closure may still hold references!
// el.removeEventListener('click', handleClick); // ✅ Clean up

// // ❌ LEAK 4: Closures holding large objects
// function createClosure() {
//     const HUGE_DATA = new Array(1_000_000).fill('x'); // 1M items

//     return function() {
//         // Even if you only use `message`, the closure captures HUGE_DATA too!
//         const message = "hello";
//         console.log(message);
//     };
// }
// const fn = createClosure(); // HUGE_DATA stays alive as long as `fn` exists!

// // ❌ LEAK 5: setInterval not cleared
// const id = setInterval(() => {
//     // This keeps running AND holds references to everything in its closure
// }, 1000);
// clearInterval(id); // ✅ Always clear when done


// V8 GC Optimizations (Generational GC)
// V8 (Chrome/Node.js) splits the heap into two generations:


// ┌────────────────────────────────────────────────┐
// │                  V8 HEAP                        │
// │                                                  │
// │  ┌──────────────┐      ┌──────────────────────┐ │
// │  │  YOUNG GEN   │      │      OLD GEN          │ │
// │  │  (New Space) │ ───► │  (Old Space)          │ │
// │  │              │      │                       │ │
// │  │  Most objects│      │  Objects that survived│ │
// │  │  die here    │      │  multiple minor GCs   │ │
// │  │  (~1-8MB)    │      │  (can be 100s of MB)  │ │
// │  └──────────────┘      └──────────────────────┘ │
// │    Minor GC (fast)         Major GC (slow)       │
// └────────────────────────────────────────────────┘



// Minor GC (Scavenger): Runs very frequently, very fast. Cleans up short-lived objects.
// Major GC (Full Mark-and-Sweep): Runs less often. Handles long-lived objects.
// 📌 This is why avoiding long-lived closures holding huge data is important — it moves data to Old Gen where cleanup is expensive.