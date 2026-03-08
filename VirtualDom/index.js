/**
 * REAL DOM vs VIRTUAL DOM vs SHADOW DOM
 *
 * This file is meant as an interview-style study note, not runtime code.
 * Everything is in comments so it does not affect execution if imported.
 */

/**
 * ===========================
 * 1. REAL DOM (Browser DOM)
 * ===========================
 *
 * Definition:
 * - The Real DOM is the live, tree-like in‑memory representation of the HTML document
 *   maintained by the browser. Every element, attribute, and piece of text is a node.
 *
 * Characteristics:
 * - Directly reflects what is on the page (layout, styling, event listeners).
 * - APIs: querySelector, appendChild, removeChild, setAttribute, innerHTML, etc.
 * - Browser reflow/repaint are triggered when you mutate DOM nodes or styles.
 *
 * Cost model:
 * - DOM operations are relatively expensive compared to plain JS object changes because:
 *   - They can cause layout recalculations (reflow).
 *   - They can cause painting and compositing.
 *   - They cross the boundary between JS engine and rendering engine.
 *
 * Pros:
 * - Simple and explicit: you see exactly what you change.
 * - No additional abstraction layer required.
 *
 * Cons (for complex apps):
 * - Hard to reason about minimal updates when UI is a function of large, changing state.
 * - Frequent, fine‑grained updates can cause performance issues if not batched.
 *
 * Example (imperative update with Real DOM):
 *
 *   const counterEl = document.getElementById('counter');
 *   let count = 0;
 *
 *   function increment() {
 *     count++;
 *     // Direct DOM manipulation: cost = 1 DOM write + possible reflow
 *     counterEl.textContent = String(count);
 *   }
 */

/**
 * ===========================
 * 2. VIRTUAL DOM
 * ===========================
 *
 * High‑level idea:
 * - Virtual DOM (VDOM) is a lightweight, in‑memory representation of the UI,
 *   usually as plain JS objects (a "virtual" tree).
 * - Libraries like React, Vue (2.x), Preact, etc. use a VDOM to:
 *   - Recompute a new virtual tree when state changes.
 *   - Diff (compare) the new tree against the previous tree.
 *   - Apply only the minimal set of changes to the Real DOM.
 *
 * Why it exists:
 * - Direct DOM manipulation is imperative and error‑prone in large apps.
 * - VDOM enables a declarative model: UI = f(state).
 * - We can re‑run the "render" function on every state change (conceptually),
 *   without manually deciding what to update in the real DOM.
 *
 * Core steps:
 * 1. Render function generates a VDOM tree from state.
 * 2. Diff algorithm compares old VDOM and new VDOM.
 * 3. Patch phase converts differences into minimal DOM operations.
 * 4. (Often) batch DOM writes to avoid layout thrashing.
 *
 * Example of a simple Virtual DOM node shape:
 *
 *   const vNode = {
 *     type: 'div',
 *     props: { className: 'counter' },
 *     children: [
 *       { type: 'span', props: {}, children: ['Count: '] },
 *       { type: 'strong', props: {}, children: ['0'] }
 *     ]
 *   };
 *
 * Note:
 * - Children can be strings (text nodes) or nested vNodes.
 *
 * Example: extremely simplified render + diff + patch loop.
 * (This is conceptual, not production‑ready.)
 */

// A simple helper to create virtual nodes (like React.createElement)
function h(type, props = {}, ...children) {
  return { type, props, children };
}

// Render a VDOM tree into a real DOM node
function createRealDomFromVdom(vNode) {
  if (typeof vNode === 'string' || typeof vNode === 'number') {
    return document.createTextNode(String(vNode));
  }

  const el = document.createElement(vNode.type);

  // Set props/attributes
  const props = vNode.props || {};
  Object.keys(props).forEach((key) => {
    if (key === 'className') {
      el.className = props[key];
    } else if (key.startsWith('on') && typeof props[key] === 'function') {
      // crude event handling: onClick -> 'click'
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, props[key]);
    } else {
      el.setAttribute(key, props[key]);
    }
  });

  // Append children
  vNode.children.forEach((child) => {
    el.appendChild(createRealDomFromVdom(child));
  });

  return el;
}

// Patch the real DOM based on differences between old and new VDOM
function patch(parent, oldNode, newNode, index = 0) {
  const existing = parent.childNodes[index];

  // Case 1: old node does not exist -> append new DOM node
  if (!oldNode && newNode) {
    parent.appendChild(createRealDomFromVdom(newNode));
    return;
  }

  // Case 2: new node does not exist -> remove DOM node
  if (oldNode && !newNode) {
    parent.removeChild(existing);
    return;
  }

  // Case 3: both are strings (text nodes)
  if (
    (typeof oldNode === 'string' || typeof oldNode === 'number') &&
    (typeof newNode === 'string' || typeof newNode === 'number')
  ) {
    if (oldNode !== newNode) {
      existing.textContent = String(newNode);
    }
    return;
  }

  // Case 4: different types -> full replace
  if (oldNode.type !== newNode.type) {
    parent.replaceChild(createRealDomFromVdom(newNode), existing);
    return;
  }

  // Case 5: same type -> update props & recurse children
  // Update props (very naive)
  const oldProps = oldNode.props || {};
  const newProps = newNode.props || {};

  Object.keys({ ...oldProps, ...newProps }).forEach((key) => {
    const oldValue = oldProps[key];
    const newValue = newProps[key];

    if (oldValue === newValue) return;

    if (key === 'className') {
      existing.className = newValue || '';
    } else if (key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase();
      if (oldValue) {
        existing.removeEventListener(eventName, oldValue);
      }
      if (typeof newValue === 'function') {
        existing.addEventListener(eventName, newValue);
      }
    } else if (newValue == null || newValue === false) {
      existing.removeAttribute(key);
    } else {
      existing.setAttribute(key, newValue);
    }
  });

  // Recurse children (naive index‑by‑index diff)
  const oldChildren = oldNode.children || [];
  const newChildren = newNode.children || [];
  const max = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < max; i++) {
    patch(existing, oldChildren[i], newChildren[i], i);
  }
}

/**
 * Interview‑style discussion points for Virtual DOM:
 *
 * - **Is Virtual DOM always faster than Real DOM?**
 *   No. VDOM adds overhead (diffing, allocations). For trivial pages or
 *   highly optimized imperative code, VDOM can be slower. Its main benefit
 *   is not raw speed but predictable, maintainable updates at scale.
 *
 * - **How does VDOM help with performance?**
 *   - It batches DOM writes.
 *   - It performs minimal DOM operations after a diff.
 *   - It avoids layout thrashing by controlling when DOM is touched.
 *
 * - **Why is VDOM a good fit with a declarative model?**
 *   - You describe the final UI for a given state.
 *   - The framework reconciles differences with the existing DOM.
 *   - Mental model: "re-render everything" without actually touching everything.
 */

/**
 * ===========================
 * 3. SHADOW DOM
 * ===========================
 *
 * Definition:
 * - Shadow DOM is a browser standard (part of Web Components) that allows you
 *   to attach a "shadow tree" to an element. This tree is:
 *   - Encapsulated (scoped DOM subtree).
 *   - Has its own scoped styles.
 *   - Not directly accessible to document‑level CSS selectors.
 *
 * Purpose:
 * - Encapsulation of markup, style, and behavior for reusable components.
 * - Prevents style leakage:
 *   - Outside styles do not accidentally affect the component internals.
 *   - Internal styles do not leak out and affect the rest of the app.
 *
 * Key concepts:
 * - Shadow host: The ordinary DOM element that "hosts" a shadow root.
 * - Shadow root: The root of the shadow DOM tree attached to the host.
 * - Mode: 'open' or 'closed':
 *   - open: accessible via element.shadowRoot
 *   - closed: not accessible from JS (shadowRoot is null)
 *
 * APIs:
 *
 *   const host = document.querySelector('#my-component');
 *   const shadowRoot = host.attachShadow({ mode: 'open' });
 *   shadowRoot.innerHTML = `
 *     <style>
 *       .button { color: red; }
 *     </style>
 *     <button class="button">Click</button>
 *   `;
 *
 * Relationship to Virtual DOM:
 * - Shadow DOM is a browser feature for DOM and style encapsulation.
 * - Virtual DOM is a user‑land abstraction for diffing UI state -> real DOM.
 * - They are orthogonal:
 *   - You can use Virtual DOM inside a Shadow DOM root.
 *   - You can use Shadow DOM with no Virtual DOM at all (pure Web Components).
 *
 * Interview‑style clarification:
 * - **Is Shadow DOM a different "type" of DOM like Real vs Virtual?**
 *   - No. Shadow DOM is still "real DOM" managed by the browser; it is just
 *     a separate, encapsulated subtree with special scoping rules.
 */

/**
 * ===========================
 * 4. COMPARISON SUMMARY
 * ===========================
 *
 * - **Real DOM**
 *   - What it is: The actual browser DOM tree.
 *   - Who owns it: The browser.
 *   - Used for: Rendering the page, layout, events.
 *
 * - **Virtual DOM**
 *   - What it is: An in‑memory representation of UI (JS objects).
 *   - Who owns it: Your framework/library (React, Vue 2, etc.).
 *   - Used for: Diffing state‑driven UI and producing minimal DOM updates.
 *
 * - **Shadow DOM**
 *   - What it is: Encapsulated DOM subtree with scoped styles per component.
 *   - Who owns it: The browser (Web Components standard).
 *   - Used for: Encapsulation and reusability of custom elements.
 *
 * Analogy (for interviews):
 * - Real DOM: The actual HTML page on screen.
 * - Virtual DOM: A blueprint of the page that can be recalculated cheaply.
 * - Shadow DOM: A private, mini‑page hidden inside a component, with its own styles.
 */

// Exporting minimal API so this file can be imported in demos if desired.
export { h, createRealDomFromVdom, patch };







// High‑level answer
// Real DOM:

// There is no diffing algorithm at the platform level.
// You (or a framework) call imperative APIs like appendChild, textContent = ..., removeChild, etc.
// The browser then runs its internal style recalculation, layout, paint, and compositing algorithms (flow layout, flexbox, grid, etc.), but there’s no named “update algorithm” like in Virtual DOM; it’s just direct tree mutation + rendering pipeline.
// Virtual DOM (React/Vue‑style)

// Uses a tree diff / reconciliation algorithm to compute the minimal set of real DOM operations.
// Conceptually:
// Compare old VDOM tree vs new VDOM tree.
// If node types differ, replace subtree; if same type, update props and then recurse into children.
// Children are diffed mostly linearly (O(n)) using heuristics:
// Siblings are compared in order.
// key props are used to match nodes when lists reorder.
// Many implementations use Longest Increasing Subsequence (LIS) on keyed children to minimize actual DOM moves.
// In React specifically:
// The reconciliation algorithm (sometimes loosely called the “Virtual DOM diffing algorithm”) is built on top of Fiber, which is a scheduling/coordination architecture rather than a different diff algorithm; but the essence is still:
// Compare previous and next fibers (VDOM nodes).
// Generate a list of insert/update/delete effects.
// Commit them in a separate phase to the Real DOM.
// Shadow DOM

// Shadow DOM is still Real DOM, just in an encapsulated subtree.
// Updates are done with the same DOM APIs and therefore the same underlying browser layout/paint algorithms as the light DOM:
// If you set shadowRoot.innerHTML = ... or manipulate shadowRoot.appendChild(...), the browser updates that subtree exactly like any other DOM.
// What’s different is scoping and composition, not the update algorithm:
// The browser runs a shadow tree “slotting” / composition algorithm to build the composed tree (what actually renders, considering <slot> elements).
// A style scoping algorithm determines which styles apply inside the shadow root and how ::slotted/::part work.
// But there is no separate diffing algorithm for Shadow DOM; it’s updated like normal DOM nodes, just with extra rules around encapsulation.
// Interview-ready summary
// Real DOM: Updated via direct mutations (DOM APIs). Browser then runs internal style/layout/paint algorithms; there is no diffing algorithm at the platform level.
// Virtual DOM: Updated via a reconciliation (diff) algorithm that compares old vs new VDOM trees (typically O(n) with heuristics and keyed children, often using LIS for optimal list moves) and emits the minimal set of Real DOM operations.
// Shadow DOM: Uses the same update pipeline as Real DOM; the difference is encapsulation (shadow tree, slotting, scoped styling), not a different update algorithm.