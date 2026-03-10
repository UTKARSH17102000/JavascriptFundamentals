/**
 * CSS POSITIONING — Senior Interview Deep Dive
 * ===========================================
 *
 * This file is written as “interview notes + runnable snippets”.
 * Treat it like a mini-handbook you can revise quickly.
 *
 * -----------------------------------------------------------------------------
 * 0) What “positioning” really means
 * -----------------------------------------------------------------------------
 * The `position` property answers two questions:
 * - **How does the element participate in layout flow?**
 * - **If it’s offset, what box is it offset relative to?** (its “containing block”)
 *
 * Values:
 * - `static`   (default)
 * - `relative`
 * - `absolute`
 * - `fixed`
 * - `sticky`
 *
 * Offsetting properties:
 * - `top | right | bottom | left` (physical)
 * - `inset | inset-block | inset-inline` (logical; modern)
 *
 * -----------------------------------------------------------------------------
 * 1) `position: static`
 * -----------------------------------------------------------------------------
 * - **Normal document flow**.
 * - `top/right/bottom/left` do nothing.
 * - `z-index` doesn’t apply unless a stacking context is formed by other means.
 *
 * Interview probe:
 * - “Why isn’t my `top: 10px` working?” → because the element is `static`.
 *
 * -----------------------------------------------------------------------------
 * 2) `position: relative`
 * -----------------------------------------------------------------------------
 * - Element stays in **normal flow** (it still occupies its original space).
 * - Offsets move the element visually relative to its original position.
 * - Frequently used to:
 *   - Nudge things without affecting neighbors’ layout
 *   - Establish a **containing block** for absolutely positioned descendants
 *
 * Key mental model:
 * - **Layout space** remains where it would be if it were not offset.
 *
 * Example: relative “nudge” (space stays put)
 *
 * ```html
 * <div class="row">
 *   <span class="tag">Normal</span>
 *   <span class="tag tag--nudge">Nudged</span>
 *   <span class="tag">Normal</span>
 * </div>
 * ```
 *
 * ```css
 * .tag { display: inline-block; padding: 6px 10px; background: #eee; }
 * .tag--nudge { position: relative; top: 6px; left: 10px; background: #cfe8ff; }
 * ```
 *
 * Common pitfall:
 * - Developers expect neighbors to reflow around the moved element. They won’t.
 *
 * -----------------------------------------------------------------------------
 * 3) `position: absolute`
 * -----------------------------------------------------------------------------
 * - Element is **removed from normal flow** (it takes no space).
 * - It is positioned relative to its **containing block**.
 *
 * 3.1) Containing block (the big interview topic)
 * For `position: absolute`, the containing block is typically:
 * - The nearest ancestor that is **positioned** (i.e., `position` is not `static`)
 *   - most commonly: `relative` on the parent
 * - If none exists: it falls back to the **initial containing block** (effectively the viewport/page)
 *
 * Practical rule of thumb:
 * - If an absolute element is “escaping” its container, ensure the intended ancestor has
 *   `position: relative` (or `absolute/fixed/sticky`) and is the nearest such ancestor.
 *
 * Example: badge inside a card
 *
 * ```html
 * <article class="card">
 *   <span class="badge">NEW</span>
 *   <h3>Card title</h3>
 *   <p>Some content...</p>
 * </article>
 * ```
 *
 * ```css
 * .card {
 *   position: relative;      // containing block for .badge
 *   border: 1px solid #ddd;
 *   border-radius: 12px;
 *   padding: 16px;
 * }
 * .badge {
 *   position: absolute;
 *   top: 10px;
 *   right: 10px;
 *   padding: 4px 8px;
 *   border-radius: 999px;
 *   background: #111;
 *   color: white;
 *   font: 12px/1 system-ui;
 * }
 * ```
 *
 * 3.2) Sizing behavior with absolute positioning
 * - If you set both `left` and `right` (or logical `inset-inline`), width can become “stretch-to-fit”.
 * - If `width` is auto and both sides are specified, the browser resolves size from available space.
 *
 * Example: full-bleed overlay inside a container
 *
 * ```css
 * .overlay {
 *   position: absolute;
 *   inset: 0;            // shorthand for top/right/bottom/left: 0
 *   background: rgba(0,0,0,.4);
 * }
 * ```
 *
 * -----------------------------------------------------------------------------
 * 4) `position: fixed`
 * -----------------------------------------------------------------------------
 * - Removed from normal flow.
 * - Positioned relative to the **viewport** (classic behavior).
 * - Stays put when scrolling.
 *
 * 4.1) The “fixed isn’t fixed” caveat
 * A `fixed` element can become fixed relative to an ancestor instead of the viewport if an ancestor
 * creates a new containing block for fixed-position descendants (commonly via `transform`,
 * `filter`, `perspective`, or `contain: paint`/`will-change: transform` depending on the browser).
 *
 * Interview-worthy example:
 * - A modal is inside a transformed parent → the “fixed” modal scrolls with that parent.
 *
 * Example: fixed header
 *
 * ```css
 * .header {
 *   position: fixed;
 *   top: 0;
 *   left: 0;
 *   right: 0;
 *   height: 56px;
 *   background: white;
 *   border-bottom: 1px solid #eee;
 * }
 * main { padding-top: 56px; }  // prevent content from hiding behind
 * ```
 *
 * -----------------------------------------------------------------------------
 * 5) `position: sticky`
 * -----------------------------------------------------------------------------
 * Sticky is a hybrid:
 * - Behaves like `relative` in normal flow until a scroll threshold is crossed,
 *   then behaves like `fixed` *within its scroll container*.
 *
 * Requirements & common gotchas:
 * - Needs an offset: e.g. `top: 0` (or `inset-block-start: 0`)
 * - Sticks within the boundaries of its nearest scrolling ancestor.
 * - Sticky won’t work as expected if:
 *   - An ancestor has `overflow: hidden/auto/scroll` (that becomes the scroll container)
 *   - The sticky element’s container isn’t tall enough
 *
 * Example: sticky section headers
 *
 * ```html
 * <div class="list">
 *   <h4 class="sectionTitle">A</h4>
 *   ...
 *   <h4 class="sectionTitle">B</h4>
 *   ...
 * </div>
 * ```
 *
 * ```css
 * .list { height: 320px; overflow: auto; border: 1px solid #ddd; }
 * .sectionTitle {
 *   position: sticky;
 *   top: 0;
 *   background: white;
 *   margin: 0;
 *   padding: 8px 12px;
 *   border-bottom: 1px solid #eee;
 *   z-index: 1; // often needed so it paints above rows
 * }
 * ```
 *
 * -----------------------------------------------------------------------------
 * 6) Paint order, stacking contexts, and `z-index` (senior-level core)
 * -----------------------------------------------------------------------------
 * Understanding “why is it on top?” requires two models:
 * - **Stacking context**: a self-contained z-index universe.
 * - **Painting order**: the order within that context.
 *
 * 6.1) `z-index` basics
 * - `z-index` only applies to:
 *   - positioned elements (`relative/absolute/fixed/sticky`) OR
 *   - elements that form stacking contexts by other properties
 * - Higher `z-index` does not guarantee “on top” if the element is trapped in a lower stacking
 *   context than a sibling context.
 *
 * 6.2) Common stacking context creators (memorize a few)
 * - Root element (`html`)
 * - Positioned element with `z-index` not `auto`
 * - `opacity < 1`
 * - `transform` not `none`
 * - `filter` not `none`
 * - `perspective` not `none`
 * - `isolation: isolate`
 * - `contain: paint` (and some contain values)
 *
 * Interview story:
 * - “I set `z-index: 9999` but it still goes behind.”
 * - Root cause: the element is inside a stacking context that’s behind another context.
 *
 * Example: z-index trapped in a stacking context
 *
 * ```html
 * <div class="A">
 *   <div class="A__popup">Popup (z: 9999)</div>
 * </div>
 * <div class="B">B above A</div>
 * ```
 *
 * ```css
 * .A { position: relative; z-index: 1; transform: translateZ(0); } // creates stacking context
 * .A__popup { position: absolute; z-index: 9999; top: 0; left: 0; }
 * .B { position: relative; z-index: 2; background: #ffe7e7; }
 * ```
 *
 * Even with 9999, `.A__popup` cannot escape `.A`’s stacking context and beat `.B`’s context.
 *
 * -----------------------------------------------------------------------------
 * 7) How offsets resolve (top/right/bottom/left vs logical inset)
 * -----------------------------------------------------------------------------
 * - Offsets (e.g. `top`) refer to edges of the element’s margin box and containing block.
 * - Prefer `inset-*` logical properties in internationalized layouts:
 *   - `inset-block-start` instead of `top`
 *   - `inset-inline-start` instead of `left`
 *
 * Example:
 *
 * ```css
 * .toast {
 *   position: fixed;
 *   inset-block-end: 16px;   // bottom
 *   inset-inline-end: 16px;  // right
 * }
 * ```
 *
 * -----------------------------------------------------------------------------
 * 8) Layout alternatives often better than positioning
 * -----------------------------------------------------------------------------
 * Senior engineers avoid positioning for “layout” when modern layout tools are better:
 * - Use **Flexbox** for 1D alignment/distribution.
 * - Use **Grid** for 2D placement.
 * - Use **gap**, **margin**, **padding** for spacing.
 * - Use positioning for overlays, badges, tooltips, sticky headers, and escape hatches.
 *
 * Great interview answer:
 * - “I’ll reach for `position` when something should not affect document flow (overlay),
 *   but for typical page layout I prefer flex/grid.”
 *
 * -----------------------------------------------------------------------------
 * 9) Practical patterns (with examples)
 * -----------------------------------------------------------------------------
 *
 * 9.1) Center an absolute element (modal) inside viewport
 *
 * ```html
 * <div class="backdrop">
 *   <div class="modal">Hello</div>
 * </div>
 * ```
 *
 * ```css
 * .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); }
 * .modal {
 *   position: absolute;
 *   top: 50%;
 *   left: 50%;
 *   transform: translate(-50%, -50%);
 *   width: min(560px, calc(100vw - 32px));
 *   background: white;
 *   border-radius: 14px;
 *   padding: 16px;
 * }
 * ```
 *
 * Senior nuance:
 * - `transform` creates a stacking context and can affect descendants’ `position: fixed`.
 *
 * 9.2) Tooltip anchored to an icon (simple)
 *
 * ```html
 * <button class="iconBtn" aria-label="Info">
 *   i
 *   <span class="tip" role="tooltip">Extra info</span>
 * </button>
 * ```
 *
 * ```css
 * .iconBtn { position: relative; }
 * .tip {
 *   position: absolute;
 *   top: calc(100% + 8px);
 *   left: 50%;
 *   transform: translateX(-50%);
 *   white-space: nowrap;
 *   padding: 6px 10px;
 *   border-radius: 10px;
 *   background: #111;
 *   color: #fff;
 *   opacity: 0;
 *   pointer-events: none;
 *   transition: opacity .15s ease;
 * }
 * .iconBtn:hover .tip { opacity: 1; }
 * ```
 *
 * Senior nuance:
 * - For real apps, tooltips should be collision-aware; you may use Popper/Floating UI.
 *
 * 9.3) “Pin to bottom” inside a card, without breaking flow
 * Often better with flexbox instead of absolute:
 *
 * ```css
 * .card { display: flex; flex-direction: column; }
 * .card__content { flex: 1; }
 * .card__actions { margin-top: auto; }
 * ```
 *
 * -----------------------------------------------------------------------------
 * 10) Debug checklist (what seniors do quickly)
 * -----------------------------------------------------------------------------
 * When positioning behaves unexpectedly:
 * - **Check computed `position`** (is it really relative/absolute/etc?)
 * - **Find the containing block**:
 *   - which ancestor is positioned?
 *   - which ancestor is the scroll container (overflow)?
 *   - any `transform/filter/perspective` ancestors affecting fixed?
 * - **Inspect stacking contexts** (why z-index isn’t working)
 * - **Check if the element is clipped** by `overflow: hidden`
 * - **Confirm offsets are set** (`top: 0` for sticky)
 *
 * -----------------------------------------------------------------------------
 * 11) Senior interview Q&A bank (high value)
 * -----------------------------------------------------------------------------
 * Use these as “related questions” and drill them:
 *
 * - **Containing block**
 *   - What is a containing block, and how is it determined for `absolute`?
 *   - Why does adding `position: relative` to a parent affect a child’s absolute position?
 *
 * - **Flow vs out-of-flow**
 *   - Compare `relative` vs `absolute` in terms of document flow.
 *   - What problems do you create when you overuse `absolute` for layout?
 *
 * - **Sticky**
 *   - How does `position: sticky` differ from `fixed`?
 *   - Why does sticky stop working inside an `overflow: hidden` container?
 *
 * - **Fixed caveats**
 *   - When can `position: fixed` become relative to something other than the viewport?
 *   - How do transforms impact a fixed child?
 *
 * - **z-index & stacking contexts**
 *   - Why doesn’t `z-index: 9999` guarantee being on top?
 *   - Name 4 properties that create a stacking context.
 *   - Explain stacking context vs DOM order vs paint order.
 *
 * - **Practical design**
 *   - How would you implement: header fixed + content not hidden?
 *   - How would you implement: tooltip / dropdown / modal?
 *   - How would you keep an element within container bounds when absolutely positioned?
 *
 * - **Modern CSS**
 *   - When would you use `inset-*` logical properties instead of `top/left`?
 *   - When should you prefer flexbox/grid over positioning?
 *
 * -----------------------------------------------------------------------------
 * 12) Mini “explain like I’m in an interview” summaries
 * -----------------------------------------------------------------------------
 * - **relative**: “Stays in flow; I can offset it visually without moving other elements.”
 * - **absolute**: “Removed from flow; positioned relative to nearest positioned ancestor.”
 * - **fixed**: “Removed from flow; positioned relative to viewport—unless an ancestor creates a
 *   containing block (e.g., transform), in which case it’s fixed within that context.”
 * - **sticky**: “In flow until scrolling reaches a threshold; then it sticks within its scroll
 *   container’s bounds.”
 */

// Optional: quick reference objects for memorization drills
export const CSSPositioningCheatSheet = Object.freeze({
  static: {
    inFlow: true,
    offsetsWork: false,
    typicalUse: "Default layout participation (no positioning)",
  },
  relative: {
    inFlow: true,
    offsetsWork: true,
    typicalUse: "Nudge element; anchor absolute children",
  },
  absolute: {
    inFlow: false,
    offsetsWork: true,
    typicalUse: "Overlays/badges inside a positioned ancestor",
  },
  fixed: {
    inFlow: false,
    offsetsWork: true,
    typicalUse: "Sticky UI like headers/toasts; viewport anchored",
  },
  sticky: {
    inFlow: true,
    offsetsWork: true,
    typicalUse: "Section headers within scroll containers",
  },
});

 