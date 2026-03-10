HTML & CSS Parsing – Senior-Level Interview Notes

This file is meant as a study / reference sheet.
It focuses on how modern browsers parse HTML & CSS, build internal
representations, and eventually render the page.

---------------------------------------------------------
1) HIGH-LEVEL PIPELINE (FROM URL TO PIXELS)
---------------------------------------------------------

 Request → Response(HTML) →
   HTML Parsing
     → DOM Tree
     + (script/style discovery & loading)
   CSS Parsing
     → CSSOM Tree
   DOM + CSSOM
     → Render Tree
     → Layout (Reflow)
     → Paint
     → Compositing

We will focus here mainly on:
 - HTML parsing → DOM
 - CSS parsing → CSSOM
And how they interact with JavaScript.

---------------------------------------------------------
2) HTML PARSING – STEP BY STEP
---------------------------------------------------------

 (a) Input Handling & Tokenization
   - The browser receives HTML as a byte stream over the network.
   - It decodes it using a character encoding (typically UTF‑8).
   - The HTML parser feeds characters into a tokenizer.
   - The tokenizer is a state machine defined by the HTML spec:
       - Data state
       - Tag open state
       - Tag name state
       - Attribute name/value states
       - Comment, DOCTYPE, CDATA states, etc.
   - As it reads characters, it produces tokens:
       - Start tag tokens (e.g. <div>)
       - End tag tokens (e.g. </div>)
       - Comment tokens
       - DOCTYPE tokens
       - Character tokens (text nodes)

 (b) Tree Construction (DOM Building)
   - The tree-construction stage consumes tokens and builds the DOM.
   - It also is a state machine with insertion modes:
       - "initial"
       - "before html"
       - "before head"
       - "in head"
       - "after head"
       - "in body"
       - "after body"
       - etc.
   - It maintains:
       - A stack of open elements.
       - A list of active formatting elements.
       - Flags (e.g. frameset-ok flag).
   - For each token, depending on the current insertion mode, the parser:
       - Adjusts the stack of open elements.
       - Creates nodes (elements, text, comments).
       - Inserts nodes into the DOM tree.

 (c) Error Handling / HTML's Resilience
   - HTML is designed to be fault-tolerant.
   - The parser will try to auto-correct invalid markup:
       - Missing end tags → inferred end tags.
       - Mismatched nesting → elements may be reparented or closed early.
       - Omitted tags like <html>, <head>, <body> will be auto-inserted.
   - This behavior is fully specified in the HTML standard.

 (d) Incremental Parsing & Streaming
   - Parsing is not a single "after-download" step.
   - As soon as the browser receives partial HTML, it starts parsing.
   - DOM is built incrementally; this allows progressive rendering.
   - Network, HTML parser, CSS parser, JS engine, and layout engine
     are all pipelined and overlapping in time.

---------------------------------------------------------
3) INTERACTION WITH JAVASCRIPT DURING HTML PARSING
---------------------------------------------------------

 (a) Script Tags Are Parsing Barriers (by default)
   - When the HTML parser encounters:
       <script src="..."></script>
     or:
       <script>inline JS</script>
     it generally:
       - Pauses the HTML parsing pipeline.
       - Ensures any earlier DOM is built up to this point.
       - Executes the script (after fetching if external).
       - Resumes parsing after script finishes.
   - Why pause?
       - Because scripts can call `document.write`, mutate the DOM,
         or query the DOM (e.g. `getElementById`) in a way that
         depends on the current parse position.

 (b) Async & Defer
   - <script src="x.js" async>
       - Download: in parallel with HTML parsing.
       - Execution: as soon as it downloads (not guaranteed order
         relative to other async scripts).
       - Parsing: continues while downloading; when executed, it
         temporarily pauses the parser.

   - <script src="x.js" defer>
       - Download: in parallel with HTML parsing.
       - Execution: after HTML parsing is fully done, before
         DOMContentLoaded.
       - Execution order: preserved in document order among defer scripts.
       - Parsing: not blocked by defer scripts.

 (c) document.write
   - `document.write` can inject HTML during parsing.
   - If used while the parser is running:
       - Its content is inserted at the parser's current insertion point.
   - If used after parsing is complete:
       - In many browsers, it can implicitly call `document.open` and
         replace the entire document.
   - Due to complexity and performance issues, modern best practices
     avoid `document.write`.

---------------------------------------------------------
4) CSS PARSING – STEP BY STEP
---------------------------------------------------------

 (a) Discovery of CSS Resources
   - As the HTML parser encounters:
       <link rel="stylesheet" href="styles.css">
       <style>...css...</style>
     it:
       - Schedules external stylesheets for download.
       - Feeds inline CSS to the CSS parser.
   - CSS is render‑blocking for the initial render in most cases:
       - The browser typically waits for CSSOM to be ready
         before painting, because JavaScript and layout depend
         on computed styles.

 (b) CSS Tokenization & Parsing
   - Similar to HTML, the CSS parser:
       - Converts the raw text into tokens:
           - Identifiers, numbers, strings, delimiters, functions, etc.
       - Builds an Abstract Syntax Tree (AST) for CSS rules:
           - Rule lists (style rules, @rules)
           - Selectors list
           - Declarations list (property: value; pairs)
   - From that AST, the browser builds the CSSOM (CSS Object Model).

 (c) CSSOM Tree
   - CSSOM is a structured representation of all style rules:
       - `CSSStyleSheet` objects for each stylesheet.
       - `CSSRule` objects for each rule.
       - `CSSStyleRule`, `CSSMediaRule`, `CSSKeyframesRule`, etc.
   - It can be accessed and modified via JS:
       - `document.styleSheets`
       - `sheet.cssRules`
       - `rule.style.setProperty(...)`
   - Any modification to CSSOM can trigger style recalculation
     and potentially layout/paint.

 (d) Cascade, Inheritance, and Specificity
   - Once CSSOM exists, the browser resolves which rules apply
     to which DOM elements:
       - Matching selectors against the DOM tree.
       - Computing specificity for conflicting rules.
       - Applying the cascade and inheritance rules.
   - Outputs computed styles per element (style resolution phase).

---------------------------------------------------------
5) INTEGRATION: DOM + CSSOM → RENDER TREE
---------------------------------------------------------

 (a) Render Tree Construction
   - Starts from the DOM tree.
   - Filters out non-visual nodes:
       - `<head>`, `<script>`, etc.
       - Nodes with `display: none` (not just `visibility: hidden`).
   - For each visible DOM node:
       - Creates a corresponding render object / box.
       - Associates computed style from CSSOM.

 (b) Layout (Reflow)
   - Calculates geometry:
       - position
       - width/height
       - margins, borders, padding
   - Depends heavily on:
       - Box model
       - Display type (block, inline, flex, grid, table, etc.)
       - Writing modes, transforms, etc.

 (c) Paint & Compositing
   - Painting:
       - Draws text, backgrounds, borders, shadows, images, etc.
       - May be done into multiple layers (like Photoshop layers).
   - Compositing:
       - GPU (where possible) combines layers into final bitmap.
   - Modern browsers have advanced compositing pipelines to
     minimize repaints and leverage GPU acceleration.

---------------------------------------------------------
6) PERFORMANCE & OPTIMIZATION ANGLES (INTERVIEW-LEVEL)
---------------------------------------------------------

 (a) Render-Blocking vs Non-Blocking Resources
   - HTML parsing: blocked by synchronous scripts.
   - CSS: typically render-blocking for first paint.
   - Strategies:
       - `defer` and `async` for scripts.
       - Critical CSS in `<style>` for above-the-fold content.
       - `media` attributes on `<link>` to load conditionally.
       - Preload/preconnect hints.

 (b) Minimizing Reflows / Layout Thrashing
   - Frequent DOM writes + reads (e.g. changing style, then reading
     `offsetWidth` in a loop) can cause layout thrashing.
   - Best practices:
       - Batch DOM reads and writes.
       - Use `requestAnimationFrame` for visual updates.
       - Avoid deeply nested layout changes in tight loops.

 (c) Avoiding Heavy Synchronous JavaScript During Parse
   - Long-running JS blocks the main thread:
       - Delays parsing, style, layout, paint, user input.
   - Techniques:
       - Split work into smaller tasks.
       - Use Web Workers where possible for non‑DOM work.

---------------------------------------------------------
7) COMMON SENIOR-LEVEL INTERVIEW QUESTIONS
---------------------------------------------------------

 Q1: Walk me through what happens from the moment the browser
     receives HTML until the first pixel is painted.
     - Expectation:
       - Mention: HTML parsing → DOM, CSS parsing → CSSOM,
         blocking behavior of scripts & CSS, render tree,
         layout, paint, compositing, progressive rendering.

 Q2: How do `<script>`, `async`, and `defer` affect HTML parsing
     and page load performance?
     - Expectation:
       - Deeper understanding of blocking vs non-blocking,
         DOM readiness, execution order, and typical use-cases.

 Q3: How does the browser handle invalid or malformed HTML?
     - Expectation:
       - Mention HTML's error-tolerant grammar, implied tags,
         stack-of-open-elements, and that behavior is specified
         (not arbitrary per browser).

 Q4: Explain DOM vs CSSOM vs Render Tree.
     - Expectation:
       - DOM: structure/content.
       - CSSOM: styles/rules.
       - Render tree: visual representation of only visible nodes
         with computed styles.

 Q5: How can dynamic changes to CSS or DOM impact performance?
     - Expectation:
       - Talk about style recalculation, layout and paint costs,
         layout thrashing, batching changes, and using transforms
         (e.g., translate/opacity) to leverage compositing.

 Q6: In what situations might you see "flash of unstyled content"
     (FOUC) or "flash of invisible text" (FOIT) and how are they
     related to parsing and rendering?

 Q7: How does the browser decide when to reflow vs repaint vs
     re-composite only?

 Q8: How do you measure and diagnose parsing / style / layout
     bottlenecks in a real application?
     - Expectation:
       - Mention DevTools: Performance tab, timeline, layout and
         paint profilers, coverage, etc.

---------------------------------------------------------
8) MINI SUMMARY / CHEAT SHEET
---------------------------------------------------------

 - HTML Parsing:
     - Streamed, tokenized, converted to DOM via tree-construction.
     - Tolerant to errors; insertion modes & stack of open elements.
     - Synchronous scripts normally block parsing; `async` / `defer`
       change that behavior.

 - CSS Parsing:
     - Text → tokens → AST → CSSOM.
     - CSS is generally render-blocking until CSSOM is ready.
     - Cascade, specificity, inheritance → computed styles.

 - Rendering:
     - DOM + CSSOM → Render tree → Layout → Paint → Compositing.
     - Any DOM or CSSOM mutations may trigger style, layout, paint.

 - Performance:
     - Minimize main-thread blocking.
     - Reduce unnecessary reflows.
     - Use async/defer, critical CSS, and batching DOM changes.
 

This file intentionally contains only documentation comments for study.

How cascade resolution happens in CSS
When multiple rules can apply to the same element/property, the browser uses the cascade algorithm to decide which value wins. In order, it considers:

Origin & importance (highest-level filter)
CSS has different “origins” and importance levels:

User agent styles: browser defaults.
User styles: user-defined (e.g., accessibility stylesheet).
Author styles: your CSS in the page.
Each of those can have:
Normal declarations.
!important declarations.
Order of precedence (for a given property):
User !important
Author !important
Author normal
User normal
User agent (browser defaults)
Cascade layers (@layer)
If you use @layer, for rules at the same origin/importance:

Later-declared layers override earlier ones.
Inside a single @layer, normal cascade rules (specificity, source order) still apply.
Specificity (within same origin, importance, and layer)
Among declarations that survive the first filters, the browser compares selector specificity:

Specificity is a 4-part tuple ((a, b, c, d)):
a: inline styles (style="") → (1,0,0,0)
b: ID selectors (#id) count.
c: class selectors, attribute selectors ([attr]), and pseudo-classes (:hover, :not(), etc.).
d: type selectors (div, h1) and pseudo-elements (::before).
Rough rule of thumb:
Inline style > ID > class/attr/pseudo-class > type/pseudo-element.
Example:
#id → (0,1,0,0)
.btn.primary:hover → (0,0,3,0)
button → (0,0,0,1)
The declaration with the highest specificity tuple wins.
Source order (last declaration wins)
If two declarations have the same origin, importance, layer, and specificity:

The later one in the CSS (closest to the element in terms of appearance order in stylesheets) wins.
This includes:
Order of <style> and <link> elements.
Order inside a single stylesheet (later rule overrides earlier rule with same specificity).
Animation & transitions (special cases)

CSS animations and transitions can override computed values at certain times:
Animations apply after normal cascade, but before transitions complete.
The “animated value” temporarily becomes the computed value until the animation ends.
These are treated as higher-priority layers during their active period.
Initial/inherit/unset/revert keywords

initial: use the property’s spec-defined initial value.
inherit: take the computed value from the parent.
unset: inherit for inherited properties, otherwise initial.
revert / revert-layer: roll back to the value from a previous origin/layer, ignoring later overrides.
A concise mental model
Step 1: Filter declarations by origin and !important.
Step 2: Within that, order by cascade layer (@layer), if used.
Step 3: Among remaining, pick the one with highest specificity.
Step 4: If still tied, the last declaration in source order wins.
Everything else (inheritance, initial, animations, etc.) slots into this core process.
