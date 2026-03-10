SPA vs MPA - Senior-Level Interview Preparation

Single Page Application (SPA) vs Multi-Page Application (MPA)

This file is meant as interview-style study material, not application logic.
Everything is in comments and exports; code examples are illustrative.
 

=============================================================================
PART 1: CORE DEFINITIONS & ARCHITECTURE
============================================================================= 

===========================
1.1 SINGLE PAGE APPLICATION (SPA)
===========================

Definition:
- An SPA is a web application that loads a single HTML document and dynamically
  updates the page content via JavaScript without full page reloads.
- Navigation between "pages" is handled client-side through the History API
  or hash-based routing; the server typically serves the same index.html for
  all routes.

Architecture:
- One initial HTML load → one or more JS bundles (often code-split).
- Subsequent "navigation" = JS re-renders different UI within the same DOM.
- Data fetching is typically via XHR/fetch to REST or GraphQL APIs.

Key characteristics:
- Client-side routing: history.pushState / replaceState, or hash (#/path).
- Virtual DOM (React, Vue, etc.) or similar diff-based UI updates.
- State lives in memory; page refresh loses client state unless persisted.
- Server is often "dumb" — static assets + API only.

Examples: Gmail, Google Maps, Trello, most React/Vue/Angular apps.
 

===========================
1.2 MULTI-PAGE APPLICATION (MPA)
===========================

Definition:
- An MPA is a traditional web app where each page is a full HTML document
  fetched from the server. Every navigation triggers a new HTTP request
  and a full page load.

Architecture:
- User clicks link → GET /products → server renders HTML → browser replaces
  entire document.
- Each page can be server-rendered (PHP, JSP, Rails, Django, etc.).
- Minimal client JS, or progressive enhancement with JS.

Key characteristics:
- Server-side routing: URL maps to server handler that returns full HTML.
- Full document replacement on navigation.
- State is request-scoped; server can use sessions, cookies.
- SEO-friendly by default: crawlers get complete HTML.

Examples: Classic e-commerce sites, WordPress, many marketing/landing sites.
 

===========================
1.3 COMPARISON MATRIX (Senior-Level)
===========================

| Aspect              | SPA                            | MPA                             |
|---------------------|--------------------------------|---------------------------------|
| Page loads          | 1 initial; then client-side    | Full reload per navigation      |
| Server role         | API + static assets            | Renders full HTML per request   |
| Routing             | Client (History/hash)          | Server (URL → handler)           |
| SEO                 | Requires SSR/pre-render       | Native, crawler gets HTML       |
| First Contentful... | Slower (JS parse + exec)       | Faster (streaming HTML)          |
| Time to Interactive | Later (bundle + hydration)     | Earlier (HTML ready)             |
| Subsequent nav      | Fast (no full reload)          | Slower (full round-trip)        |
| Offline             | Easier (service worker, cache) | Harder (full pages to cache)     |
| State management    | In-memory (Redux, Zustand)     | Server sessions, cookies         |
| Bundle size         | Larger initial JS payload      | Minimal JS per page             |
 

=============================================================================
PART 2: TECHNICAL DEEP-DIVES
============================================================================= 

===========================
2.1 ROUTING: SPA vs MPA
===========================

SPA Routing (Client-Side):
- Uses History API (pushState, replaceState) or hash (#/path).
- Router library (React Router, Vue Router) listens to popstate / hashchange.
- Route config maps path → component; no server round-trip.

  // Conceptual SPA routing
  window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    render(routeMap[path] || NotFound);
  });

- Caveat: Direct URL access or refresh requires server to serve index.html
  for all routes (fallback) so client router can take over.

MPA Routing (Server-Side):
- URL maps to server handler; server returns full HTML.
- No client router; links are <a href="/page"> causing full navigation.
 

===========================
2.2 SEO: WHY SPAs STRUGGLE & SOLUTIONS
===========================

Problem:
- Crawlers historically execute JS, but timing and completeness vary.
- SPA initially serves empty <div id="root"></div>; content appears after
  JS runs. Googlebot runs JS, but others may not; even Google has limits.

Solutions:
1. Server-Side Rendering (SSR)
   - Pre-render React/Vue on server; send full HTML. Hydrate on client.
2. Static Site Generation (SSG)
   - Build-time generation of HTML for each route.
3. Pre-rendering / Prerender.io
   - Service that runs headless browser, caches HTML for crawlers.
4. Hybrid: SSR for critical routes, SPA for app-shell.
 

===========================
2.3 PERFORMANCE: FIRST LOAD vs SUBSEQUENT
===========================

SPA First Load (Critical Path):
1. HTML (minimal) → 2. JS bundle(s) → 3. Parse & execute → 4. Fetch data →
   5. Render → 6. Hydrate (if SSR). TTI can be high.

SPA Subsequent Navigation:
- No full reload; router swaps components; fetch new data if needed.
- Perceived as instant if data is cached or quick.

MPA First Load:
- HTML streamed from server; browser can render progressively.
- FCP/LCP often faster than SPA for content-heavy pages.

MPA Subsequent Navigation:
- Full document load; re-download HTML, CSS, possibly repeat resources.
- Can be optimized with HTTP/2, caching, partial page updates (turbo).
 

===========================
2.4 HYDRATION (SSR + SPA)
===========================

Definition:
- Hydration = attaching client-side JS (event handlers, interactive behavior)
  to server-rendered HTML so it becomes interactive without re-rendering.

Process:
1. Server sends HTML (already rendered by React/Vue).
2. Browser displays it (fast FCP).
3. JS loads; framework "hydrates" — walks DOM, attaches listeners, reconciles
   virtual tree to existing DOM instead of replacing it.

Hydration mismatches:
- If server and client produce different HTML (e.g., Date.now(), random ids),
  hydration can fail or produce incorrect UI.
- Use suppressHydrationWarning sparingly; fix root cause when possible.

Selective/partial hydration:
- Only hydrate above-the-fold or interactive parts; defer rest (Islands Arch).
 

=============================================================================
PART 3: HYBRID APPROACHES (SSR, SSG, ISR)
============================================================================= 

===========================
3.1 SERVER-SIDE RENDERING (SSR)
===========================

- Each request triggers server render of the app.
- Full HTML sent to client; JS hydrates.
- Use when: dynamic, user-specific, or frequently changing content.
- Frameworks: Next.js (getServerSideProps), Nuxt, Remix.

Trade-offs:
- TTFB increases (server compute per request).
- Need Node (or edge) runtime; scaling considerations.
 

===========================
3.2 STATIC SITE GENERATION (SSG)
===========================

- HTML generated at build time for each route.
- Served as static files; no server render at request time.
- Use when: content is known at build (blogs, docs, marketing).

Trade-offs:
- Rebuild required for content changes (unless ISR).
- No personalization per request.
 

===========================
3.3 INCREMENTAL STATIC REGENERATION (ISR)
===========================

- SSG + on-demand revalidation. First request after stale period triggers
  background rebuild; subsequent requests get fresh HTML.
- Best of SSG (speed) and dynamic content (eventual freshness).
- Next.js: revalidate in getStaticProps.
 

=============================================================================
PART 4: CODE EXAMPLES (Conceptual)
============================================================================= 

Simple SPA routing simulation (history-based)
 

```javascript
function createSPARouter(routes) {
  const fallback = routes['*'] || routes['/404'] || (() => {});

  function handleRoute() {
    const path = window.location.pathname || '/';
    const Component = routes[path] || fallback;
    if (typeof Component === 'function') Component();
  }

  window.addEventListener('popstate', handleRoute);

  return {
    navigate: (path) => {
      window.history.pushState({}, '', path);
      handleRoute();
    },
    init: handleRoute,
  };
}

```

MPA-style: Server would return full HTML per path.
Client just uses normal links; no client router.

<a href="/about">About</a>  →  GET /about  →  Full HTML document
 

=============================================================================
MODERN MPA ENHANCEMENTS: Turbo & HTMX
=============================================================================

Turbo (Hotwire / Rails):
- Intercepts link clicks and form submissions.
- Fetches new page via fetch, replaces only <body> (or target) instead of
  full reload. Feels like SPA nav but remains server-rendered MPA.
- "HTML over the wire" — no JSON API, just HTML fragments.

HTMX:
- Attributes like hx-get, hx-post, hx-swap on elements.
- Fetches HTML fragments, swaps into DOM. No heavy JS framework.
- Enables dynamic behavior with minimal client JS; server does the work.

Both: Bring SPA-like smoothness to MPA without full client rendering.
 

=============================================================================
MICRO-FRONTENDS & ARCHITECTURE
=============================================================================

Micro-frontends: Splitting UI into independently deployable "apps."

- Can mix SPA and MPA: different teams own different routes/apps.
- Module Federation (Webpack 5): load remote chunks at runtime.
- iframe isolation: simple but heavyweight.
- Web Components: framework-agnostic boundaries.

SPA vs MPA in micro-frontends:
- Each "micro-app" can be SPA (React) or MPA (server-rendered).
- Shell/orchestrator loads them; routing can be unified or federated.
 

=============================================================================
PART 5: RELATED SENIOR INTERVIEW QUESTIONS & ANSWERS
============================================================================= 

Q1: "When would you choose SPA over MPA, and vice versa?"

SPA when:
- App-like experience: dashboards, tools, internal apps.
- Heavy interactivity post-load; rich client state.
- Offline or PWA requirements.
- Team expertise in React/Vue/Angular; shared component model.
- API-first architecture (same backend for web + mobile).

MPA when:
- SEO is critical and you want minimal complexity (marketing, content).
- Fast FCP/LCP is paramount for content-heavy pages.
- Simple forms + server processing (no need for client framework).
- Limited JS; progressive enhancement preferred.
- No Node/edge runtime available (static hosting only).
 

Q2: "How would you make an SPA SEO-friendly?"

- Use SSR (Next.js, Nuxt, Remix) for public, crawlable routes.
- Or SSG for static content; pre-render at build.
- Ensure meta tags, Open Graph, structured data are server-rendered.
- Use canonical URLs, proper sitemap.
- Avoid relying on JS-only content for critical SEO signals.
- Pre-rendering services (Prerender.io) as fallback for legacy crawlers.
 

Q3: "Explain the trade-offs of hydration. Why can it be slow?"

- Hydration must walk entire server-rendered DOM, attach listeners, and
  reconcile framework state. For large trees, this blocks main thread.
- Double data: server sent HTML, client must "replay" render to match.
- Solutions: selective hydration, streaming SSR, islands architecture
  (Astro, Fresh) — hydrate only interactive islands.
 

Q4: "What is the difference between CSR, SSR, and SSG?"

- CSR (Client-Side Rendering): Browser gets empty shell; JS fetches data
  and renders. SPA default. Slower FCP, faster subsequent nav.

- SSR (Server-Side Rendering): Server runs app, sends HTML. Client hydrates.
  Faster FCP, better SEO; higher server cost.

- SSG (Static Site Generation): HTML generated at build. Served as static.
  Fastest, no runtime server render; content must be known at build.
 

Q5: "How does code-splitting affect SPA performance?"

- Split by route: load only the JS needed for current view.
- Split by feature: admin panel, heavy charts — load on demand.
- Reduces initial bundle; improves TTI.
- Trade-off: more chunks = more requests (HTTP/2 mitigates); ensure
  critical path is minimal.
 

Q6: "What is the 'app shell' model?"

- Minimal HTML + JS that provides layout, nav, and shell.
- Content loads dynamically (API + render).
- Enables offline: cache shell; fetch/cache content.
- Common in PWA + SPA architecture.
 

Q7: "How would you migrate from MPA to SPA (or vice versa)?"

MPA → SPA:
- Identify boundaries: which routes become client routes.
- Introduce framework incrementally (e.g., React in specific pages).
- Implement client router; configure server fallback for SPA routes.
- Move data to API; adopt state management.

SPA → MPA (or hybrid):
- Add SSR/SSG for critical routes (Next.js, etc.).
- Or split: marketing = MPA/SSG, app = SPA.
 

Q8: "What are the security implications of SPA vs MPA?"

SPA:
- Tokens in memory (XSS risk); use httpOnly cookies for refresh when possible.
- More exposed client logic; ensure no secrets in bundles.
- CORS and API design critical.

MPA:
- Cookies, sessions; CSRF tokens in forms.
- Less client logic; server-authoritative.
- Both: HTTPS, CSP, input validation, auth design.
 

Q9: "Explain Progressive Enhancement vs SPA."

- Progressive enhancement: base experience works without JS (HTML + forms).
  JS enhances interactivity. Aligns with MPA.

- SPA: often requires JS for core functionality. Fails if JS disabled or
  blocked. Can combine: SSR provides no-JS fallback; hydration adds
  interactivity.
 

Q10: "How do you measure and compare SPA vs MPA performance?"

Metrics:
- FCP, LCP, TTI, TBT, CLS (Core Web Vitals).
- TTFB (time to first byte) — MPA/SSR can have higher.
- Route change performance: SPA should be near-instant.

Tools: Lighthouse, WebPageTest, RUM (Real User Monitoring).
Compare: first load vs subsequent; slow 3G vs 4G.
 

Q11: "What is Streaming SSR and how does it help?"

- Instead of waiting for full HTML, server streams chunks as they're ready.
- Browser can render early (progressive HTML); Suspense boundaries flush
  when their async work completes.
- Reduces TTFB to first chunk; improves LCP.
- React 18: renderToPipeableStream; Next.js App Router uses streaming.
 

Q12: "Explain the Islands Architecture (Astro, Fresh)."

- Page is mostly static HTML; "islands" of interactivity are small JS widgets.
- Only hydrate the components that need JS (dropdowns, forms, etc.).
- Rest stays as HTML — no framework overhead for static content.
- Best of both: fast static delivery + targeted interactivity.
 

Q13: "How do you handle deep-linking and 404 in SPAs?"

- Deep-linking: Server must serve index.html for all routes (fallback).
  Client router reads path, renders correct view.
- 404: Router has catch-all route; render 404 component. Optionally
  set 404 HTTP status via server (needs server-side logic per route).
 

Q14: "What are the caching implications for SPA vs MPA?"

SPA:
- index.html: short cache or no-cache (contains asset references).
- JS/CSS bundles: long cache (content-hash in filename).
- API: vary by auth, short cache or no-store for user data.

MPA:
- HTML pages: can be cached if not user-specific (CDN, stale-while-revalidate).
- User-specific pages: no-cache or short max-age.
 

Q15: "Describe a scenario where a hybrid (SPA + SSR) is ideal."

- E-commerce: product/category pages = SSR for SEO and fast FCP.
  Cart, checkout, account = SPA for smooth interactions.
- Content + app: blog/docs = SSG; admin/dashboard = SPA.
- Next.js: pages can be static, server-rendered, or client-only.
 

=============================================================================
PART 6: SUMMARY CHEAT SHEET
=============================================================================

SPA:
  - One HTML, client routing, JS-heavy, good for app-like UIs.
  - SEO: needs SSR/SSG/prerender. Performance: optimize bundle, code-split.

MPA:
  - Full page per route, server-rendered, SEO-friendly, simpler stack.
  - Performance: optimize TTFB, caching, HTTP/2.

Hybrid:
  - SSR for dynamic + SEO; SSG for static; SPA shell for app routes.
  - Next.js, Nuxt, Remix, Astro — pick based on content type and needs.

Senior answer tip: "It depends on requirements: SEO, interactivity,
team skills, hosting constraints. I'd choose SPA for [X], MPA for [Y],
and a hybrid framework when we need both."
 

=============================================================================
QUICK REFERENCE: FRAMEWORKS BY APPROACH
=============================================================================

SPA-focused:     Create React App, Vite + React/Vue, Angular CLI
SSR/SSG/Hybrid: Next.js, Nuxt, Remix, SvelteKit, Astro
MPA-enhanced:   Rails + Turbo, Laravel + Inertia, HTMX
 

Printable doc for quick review (like Minification.js)
 

```javascript
export const SPA_VS_MPA_DOC = `
SPA vs MPA - Senior Interview Cheat Sheet
=========================================

SPA: One HTML load, client routing, JS renders. Fast subsequent nav, slow first load, SEO needs work.
MPA: Full page per route, server renders. Fast FCP, native SEO, slower nav.

Key Decisions:
- SEO critical? → SSR, SSG, or MPA
- App-like UX? → SPA or hybrid
- Simple content site? → MPA or SSG
- Offline/PWA? → SPA + service worker

Hybrid: Next.js, Nuxt, Remix for per-route strategy (SSR/SSG/CSR).
`;

export function printSPAvsMPADoc() {
```

eslint-disable-next-line no-console

```javascript
  console.log(SPA_VS_MPA_DOC);
}

```

Export for potential use in demos or REPL

```javascript
export { createSPARouter };

```
