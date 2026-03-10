/**
 * DOM vs BOM – Senior-Level Deep Dive
 * -----------------------------------------------------------
 * This file is meant as a study / revision sheet for
 * advanced JavaScript interviews. It contains:
 * - In‑depth explanation of DOM and BOM
 * - How the browser loads a page (step‑by‑step flow)
 * - How DOM & BOM interact with JavaScript
 * - Subtle implementation details and performance concerns
 * - A bank of senior‑level interview questions
 *
 * NOTE: Everything is in comments so that this file can be
 * safely imported or opened without affecting runtime.
 */

// ===========================================================
// 1. What is the DOM?
// ===========================================================
//
// DOM = Document Object Model
// - A language‑agnostic, in‑memory, tree‑like representation
//   of a document (usually HTML, sometimes XML).
// - Standardized primarily by WHATWG/HTML and W3C specs.
//
// Conceptually:
// - The HTML source is parsed into tokens.
// - The parser builds a tree of nodes (Document, Element,
//   Text, Comment, etc.).
// - JavaScript can read and mutate this tree at runtime.
//
// Key characteristics:
// - Tree structure:
//   document
//     └── <html>
//         ├── <head>
//         │   └── <title>...</title>
//         └── <body>
//             ├── <div>...</div>
//             └── <script>...</script>
//
// - Live representation:
//   Changing the DOM (e.g., element.appendChild, style
//   changes) can trigger layout / paint, updating what the
//   user sees.
//
// - API Surface (examples):
//   - document.getElementById, querySelector, querySelectorAll
//   - document.createElement, createTextNode
//   - node.appendChild, insertBefore, remove, replaceChild
//   - element.classList, attributes, dataset
//   - events: addEventListener, removeEventListener
//
// Node types (simplified):
// - Document: root of the DOM.
// - Element: HTML tags (<div>, <span>...).
// - Text: textual content inside elements.
// - Comment: <!-- ... -->.
// - DocumentFragment: lightweight container for batching DOM
//   operations for performance.
//
// DOM levels:
// - DOM Level 1/2/3 are historical specs; modern browsers
//   implement the WHATWG living standard. Interviewers often
//   only care that you understand the tree, mutability, and
//   event model.


// ===========================================================
// 2. What is the BOM?
// ===========================================================
//
// BOM = Browser Object Model
// - The set of objects exposed by the browser that represent
//   the browser environment / host, NOT the document itself.
// - Not as strictly standardized historically as DOM; a lot
//   of it evolved from vendor APIs and later converged.
//
// At the top of the BOM: the `window` object.
// - Global object for browser JavaScript.
// - Represents the browser window / tab.
//
// Core BOM components (commonly discussed):
// - window:
//   - Global namespace & main entry for BOM.
//   - setTimeout, setInterval, clearTimeout, clearInterval
//   - alert, confirm, prompt (UI dialogs)
//   - requestAnimationFrame, cancelAnimationFrame
//   - open, close, focus, blur
//   - window.innerWidth / innerHeight, scrollX / scrollY
//
// - location:
//   - window.location.href, protocol, host, pathname, search, hash
//   - Methods: assign(), replace(), reload()
//   - Used for navigation and URL inspection.
//
// - history:
//   - history.back(), forward(), go()
//   - history.pushState(), replaceState() (SPA routing)
//
// - navigator:
//   - Information about the user agent (browser), platform,
//     permissions, userAgent string, online status, etc.
//
// - screen:
//   - Information about the physical screen (width, height,
//     colorDepth, etc.). Less commonly used in modern apps.
//
// - console:
//   - console.log, warn, error, time, group, etc. (debugging).
//
// Many modern Web APIs are also exposed via `window`:
// - Fetch API, WebSockets, Web Storage (localStorage /
//   sessionStorage), IndexedDB, Service Workers, etc.
//
// BOM vs DOM:
// - DOM is about the document model; BOM is about the
//   browser environment.
// - DOM is standardized as part of the HTML spec; BOM APIs
//   are a broader set of "Web Platform APIs".


// ===========================================================
// 3. Relationship between DOM, BOM, and `window`
// ===========================================================
//
// - `window` is the global object representing the browser
//   window/tab. It is part of the BOM.
// - `document` is a property of `window`:
//       window.document === document  // true in browsers
//
// Stack:
// - BOM (window, history, location, navigator, etc.)
//   - DOM (document and its node tree)
//
// The global scope:
// - In browsers, top-level `var` declarations (not `let`/`const`)
//   become properties on `window`.
// - Many global functions are just window methods:
//     alert === window.alert
//     setTimeout === window.setTimeout
//
// Security boundaries:
// - Same-origin policy applies strongly to BOM interactions
//   (e.g., `window.open` cross-domain communication, iframes).
// - DOM access is also restricted by origin (you cannot read
//   DOM of another origin’s iframe from your page code).


// ===========================================================
// 4. High-Level Browser Flow: From URL to Rendered Page
// ===========================================================
//
// Step 0: Navigation
// - User enters URL, clicks a link, submits a form, or uses
//   history navigation.
// - Browser consults cache, performs DNS, establishes
//   connection (TCP/TLS), sends HTTP request.
//
// Step 1: Receive HTTP Response
// - Response headers & body arrive (typically HTML first).
// - BOM’s `location` and `history` are updated accordingly.
//
// Step 2: Parsing HTML → Building DOM
// - The browser’s HTML parser converts bytes → characters →
//   tokens → nodes.
// - Incremental parsing:
//   - DOM is built as the HTML streams in; it's not "all at
//     once" for large documents.
//   - `document.readyState` transitions:
//       "loading"  → parsing in progress
//       "interactive" → DOM constructed but sub-resources may
//                       still be loading
//       "complete" → all resources loaded
//
// - Script blocking:
//   - When parser hits a `<script>` without `async` or `defer`,
//     it:
//       1. Pauses HTML parsing,
//       2. Fetches and executes the script,
//       3. Resumes parsing.
//   - That script can read/modify the DOM built so far.
//
// Step 3: Parsing CSS → Building CSSOM
// - CSS files are requested and parsed in parallel.
// - CSSOM (CSS Object Model) is constructed as a separate
//   tree representing styles, rules, cascades, etc.
//
// Step 4: Render Tree = DOM + CSSOM
// - DOM tree + CSSOM → Render Tree (only visible nodes +
//   computed styles).
//
// Step 5: Layout
// - Browser computes geometry: position & size for each box.
// - This step can be expensive. DOM mutations or style changes
//   that affect layout can trigger reflow (layout).
//
// Step 6: Paint & Composite
// - The render tree is painted into layers (borders, text,
//   backgrounds, etc.).
// - Modern engines use compositing: layers are combined (often
//   GPU-accelerated).
//
// Step 7: Interactivity
// - Event listeners (attached via DOM APIs) fire in response
//   to user input.
// - JS can interact with DOM and BOM to update UI or navigate.
//
// Loop:
// - JS changes DOM/BOM → may trigger style recalculation,
//   layout, paint, compositing → updated pixels.


// ===========================================================
// 5. DOM Manipulation Patterns & Performance Considerations
// ===========================================================
//
// Expensive operations:
// - Layout thrashing:
//   Repeatedly reading layout properties (offsetWidth, clientHeight,
//   getBoundingClientRect) interleaved with DOM writes forces the
//   browser to reflow multiple times.
//
// - Large DOM trees:
//   - Many nodes increase layout/paint cost.
//   - Deep nesting can hurt performance.
//
// - Synchronous reflows:
//   - Accessing computed style or layout after mutations can
//     cause forced reflow.
//
// Best practices:
// - Batch DOM changes:
//   - Use DocumentFragment for bulk insertions.
//   - Apply classes instead of touching many individual styles.
//
// - Avoid layout thrashing:
//   - Read all required layout properties first, then write.
//
// - Use requestAnimationFrame for visual updates:
//   - Ensures DOM writes sync with the browser’s paint cycle.
//
// - Use modern APIs:
//   - classList, dataset, MutationObserver, IntersectionObserver.
//
// Example pattern (conceptual only, not executed here):
//
//   const fragment = document.createDocumentFragment();
//   for (let i = 0; i < 1000; i++) {
//     const li = document.createElement('li');
//     li.textContent = `Item ${i}`;
//     fragment.appendChild(li);
//   }
//   list.appendChild(fragment); // single reflow/paint vs 1000.


// ===========================================================
// 6. BOM Usage Patterns & Pitfalls
// ===========================================================
//
// Timers:
// - setTimeout(fn, delay) and setInterval(fn, delay)
// - Inactive tabs can throttle timers.
// - Prefer requestAnimationFrame for animations.
//
// Single Page Applications (SPAs) and History API:
// - history.pushState(state, title, url)
// - history.replaceState(state, title, url)
// - window.onpopstate (or addEventListener('popstate', ...))
// - Allows URL changes without full page reload.
//
// Location:
// - location.assign(url) → navigates; keeps history entry.
// - location.replace(url) → navigates; replaces current
//   history entry (no back navigation to old page).
// - location.reload() → reloads the page (can be forced from
//   server if needed).
//
// Navigator:
// - navigator.userAgent is unreliable for feature detection.
// - Prefer feature detection (e.g., 'serviceWorker' in navigator).
//
// Cross-window communication:
// - window.open returns a reference to the new window.
// - Cross-origin access is limited; use postMessage for
//   cross-origin messaging.
//
// Storage APIs (also exposed via `window` in most browsers):
// - localStorage: persistent key/value per origin.
// - sessionStorage: per-tab lifetime.
// - NOTE: Synchronous APIs; large writes in performance-critical
//   code paths can be problematic.


// ===========================================================
// 7. Event Model & Propagation (DOM-centric but BOM-adjacent)
// ===========================================================
//
// Capture → Target → Bubble:
// - Events travel from window → document → root element →
//   down to target (capturing).
// - Then from target → back up to window (bubbling).
//
// - addEventListener(type, handler, options)
//   options.capture (or third arg true) → listen in capture.
//   options.once → auto-remove listener after first call.
//   options.passive → promise that handler will not call
//   preventDefault (allows scrolling optimization).
//
// Stopping propagation:
// - event.stopPropagation() → stops further bubbling/capture.
// - event.stopImmediatePropagation() → also prevents other
//   handlers on the same target from running.
//
// Delegation:
// - Attach one listener high in the DOM and use event.target /
//   event.currentTarget to handle many child elements. This
//   reduces memory and registration cost.


// ===========================================================
// 8. Typical Senior-Level Interview Angles
// ===========================================================
//
// Interviewers often move past “What is DOM/BOM?” and focus on:
// - Deep understanding of the rendering pipeline.
// - Performance characteristics of DOM operations.
// - Subtle browser behaviors (event loop, microtasks vs macrotasks).
// - Security implications (XSS, CSP, same-origin policy).
// - How SPAs manage navigation without full reloads.
//
// Even if the question is simply "Explain DOM vs BOM", you can:
// - Give clear definitions.
// - Connect them to rendering, events, and performance.
// - Bring in a concrete flow of how a page is loaded and
//   manipulated.


// ===========================================================
// 9. Step-by-Step Flow: From JS Code to Visual Change
// ===========================================================
//
// Example conceptual flow for "change text when button is clicked":
//
// 1) Browser finished initial load:
//    - DOM built, CSSOM built, render tree laid out and painted.
//    - Event listeners registered (e.g., on a button).
//
// 2) User clicks button:
//    - Browser’s native input subsystem detects the click.
//    - An event object is created and queued for dispatch.
//
// 3) Event dispatch:
//    - Event travels: window → document → ... → button
//      (capture), then back up (bubble).
//    - Your handler (attached via DOM APIs) runs.
//
// 4) Handler modifies DOM:
//    - e.g., button.textContent = "Clicked!";
//    - This mutates the DOM tree’s Text node.
//
// 5) Browser schedules visual update:
//    - Style recalculation if styles may have changed.
//    - Layout if geometry changed.
//    - Paint & composite.
//
// 6) User sees the updated text:
//    - Pixels on screen reflect the new DOM state.
//
// At any step, your code may also use BOM APIs:
// - e.g., history.pushState after click, location changes,
//   localStorage writes, etc.


// ===========================================================
// 10. Frequently Asked / Important Related Questions
// ===========================================================
//
// Q1: Differentiate DOM, BOM, and JavaScript.
// - **DOM**: In-memory representation of the document structure.
// - **BOM**: Browser environment (window, history, location, etc.).
// - **JavaScript**: The programming language that manipulates both
//   via provided APIs.
//
// Q2: Is the DOM part of JavaScript?
// - No. DOM is provided by the browser as host objects. The
//   language spec (ECMAScript) does not define document, window,
//   or related APIs. Node.js, for example, has JS without a DOM.
//
// Q3: How does `document.readyState` differ from `load` event?
// - `DOMContentLoaded` (often used via document.addEventListener):
//   fires when DOM is fully parsed, before images/stylesheets
//   are necessarily loaded.
// - `load` (on window) fires when all resources are fully loaded.
//
// Q4: What is the impact of synchronous `<script>` tags on DOM
//     construction?
// - They block parsing. The browser must fetch and execute them
//   before it can resume building DOM, which can delay first
//   render. `defer` and `async` are strategies to mitigate this.
//
// Q5: Explain `async` vs `defer` for scripts.
// - `async`:
//   - Script loads in parallel with parsing.
//   - Executes as soon as it’s ready, potentially before DOM is
//     fully parsed.
//   - Execution order is not guaranteed relative to other async
//     scripts.
// - `defer`:
//   - Loads in parallel but executes after DOM parsing, before
//     `DOMContentLoaded`.
//   - Execution order is preserved relative to document order.
//
// Q6: How do SPAs use the BOM to avoid full page reloads?
// - They intercept navigation events (e.g., link clicks) and use
//   `history.pushState` / `replaceState` and `popstate` events to
//   update URL and UI, while staying on the same document. The DOM
//   is updated via client-side routing logic.
//
// Q7: How would you optimize heavy DOM updates?
// - Strategies:
//   - Minimize layout thrashing (group reads and writes).
//   - Use DocumentFragment for bulk insertions.
//   - Avoid unnecessary reflows (batch style changes).
//   - Use virtual DOM libraries or templating for large dynamic UIs.
//   - Use requestAnimationFrame for animation loops.
//
// Q8: How does the event loop relate to DOM/BOM?
// - The event loop pulls tasks (e.g., timers, user input, network
//   callbacks) and executes JS. Many of these tasks are triggered
//   by BOM APIs (setTimeout, DOM events). After each task, the
//   browser may render updates based on DOM changes.
//
// Q9: Are BOM APIs always available in all JS environments?
// - No. For example, Node.js has no window, document, or DOM by
//   default. Those are browser-specific host objects.
//
// Q10: Security considerations with DOM/BOM?
// - DOM-based XSS: inserting unsanitized user input into DOM
//   dangerously (innerHTML).
// - Open redirects via location changes.
// - Clickjacking via iframes. Mitigated via headers/CSP.
// - Cross-window access restrictions via same-origin policy.
//
// Q11: Difference between `window.onload` and
//      `document.addEventListener('DOMContentLoaded', ...)`?
// - `DOMContentLoaded` fires once DOM is parsed, without waiting
//   for images/stylesheets. Preferred for initializing UI logic
//   that does not require all assets.
// - `window.onload` fires when everything (including images) has
//   loaded; it can be significantly later.
//
// Q12: What is a reflow vs repaint?
// - Reflow (layout): recalculating element positions/sizes.
// - Repaint: drawing elements whose appearance changed but not
//   their layout (e.g., color change).
// - Some DOM operations trigger only repaint; others trigger both.
//
// Q13: How do iframes fit into DOM and BOM?
// - In DOM, <iframe> is an element with its own nested browsing
//   context; it has its own window, document, history, etc.
// - Cross-origin iframes are heavily sandboxed; DOM/BOM access to
//   them is restricted to protect security.
//
// Q14: Can you explain how `window.open` and `postMessage` interact?
// - `window.open` creates/invokes another browsing context and
//   returns a handle (a window object reference) when same-origin.
// - For cross-origin communication, `postMessage` is used:
//   otherWindow.postMessage(message, targetOrigin).
// - Receiver uses `window.addEventListener('message', handler)`.
//
// Q15: How would you explain DOM and BOM to a non-technical PM?
// - DOM is "the structured model of the page that we can
//   programmatically change."
// - BOM is "everything the browser exposes about the environment:
//   URL, history, screen, storage, etc."
// - JavaScript is "the language we use to manipulate both."
//
// -----------------------------------------------------------
// End of DOM vs BOM deep-dive notes.
// -----------------------------------------------------------

