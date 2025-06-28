// // Core Web Vitals


// Core Web Vitals are a set of specific metrics defined by Google to measure the user experience of a web page. These metrics focus on three key aspects of user experience: loading performance, interactivity, and visual stability. Each of these aspects is represented by a specific metric:
// 1.
// Largest Contentful Paint (LCP):
// Definition: LCP measures the loading performance of a page. It marks the point in the page load timeline when the main content of the page has likely loaded. A good LCP score is 2.5 seconds or less.
// Example: If a user visits a news article, the LCP would be the time it takes for the main article text and image to be fully visible.
// Improvement Tips: Optimize server response times, use a Content Delivery Network (CDN), and compress images.
// 2.
// First Input Delay (FID):
// Definition: FID measures interactivity. It quantifies the time from when a user first interacts with a page (e.g., clicks a button) to the time when the browser is able to respond to that interaction. A good FID score is 100 milliseconds or less.
// Example: If a user clicks a button on a webpage, FID measures the delay before the browser starts processing the event.
// Improvement Tips: Minimize JavaScript execution time, break up long tasks, and use a web worker.
// 3.
// Cumulative Layout Shift (CLS):
// Definition: CLS measures visual stability. It quantifies how much the page layout shifts during the loading phase. A good CLS score is 0.1 or less.
// Example: If a user is reading an article and an image loads above the text, causing the text to shift down, this would contribute to a higher CLS score.
// Improvement Tips: Use size attributes for images and videos, avoid inserting content above existing content, and use CSS to reserve space for dynamic content.
// Example of Core Web Vitals in Practice:
// Consider a simple webpage that includes a large hero image, a button, and some text content. Here's how Core Web Vitals would apply:
// LCP: The time it takes for the hero image and the main text to be fully visible after the page starts loading.
// FID: The delay experienced by the user when they click the button for the first time.
// CLS: Any unexpected shifts in the layout, such as the button moving down when the hero image loads.
// By focusing on these metrics, developers can ensure that their web pages provide a fast, responsive, and stable experience for users. Improving Core Web Vitals can lead to better user engagement and potentially higher search rankings, as these metrics are part of Google's ranking criteria.










// First Contentful Paint (FCP) is a performance metric that measures the time from when a page starts loading to when any part of the page's content is rendered on the screen. This content could be text, an image, or a canvas element. FCP is an important metric because it provides the first indication to users that the page is loading.
// How to Optimize FCP
// 1.
// Reduce Server Response Times:
// Explanation: Faster server response times mean that the browser can start rendering content sooner.
// Optimization Tips: Use a Content Delivery Network (CDN), optimize your server configuration, and ensure your server is located close to your users.
// 2.
// Optimize Resource Load Times:
// Explanation: Resources like CSS, JavaScript, and images can block rendering if they take too long to load.
// Optimization Tips: Minify and compress CSS and JavaScript files, use asynchronous loading for non-critical JavaScript, and optimize images by using modern formats like WebP.
// 3.
// Use Efficient Caching:
// Explanation: Proper caching can reduce the time it takes to load resources that have been previously fetched.
// Optimization Tips: Implement browser caching and use cache headers to control how resources are cached.
// 4.
// Eliminate Render-Blocking Resources:
// Explanation: CSS and JavaScript files that block rendering can delay FCP.
// Optimization Tips: Inline critical CSS, defer non-critical JavaScript, and use the async attribute for scripts that can be loaded asynchronously.
// 5.
// Optimize Critical Rendering Path:
// Explanation: The critical rendering path is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on the screen.
// Optimization Tips: Minimize the number of critical resources, reduce the size of critical resources, and defer the loading of non-critical resources.
// 6.
// Preload Key Resources:
// Explanation: Preloading resources can ensure they are available sooner in the loading process.
// Optimization Tips: Use the <link rel="preload"> tag to preload important resources like fonts and images.
// By focusing on these optimization techniques, you can improve the FCP of your web pages, leading to a better user experience as users will see content rendered on their screens more quickly.




// Performance Tools 

//    Developer Mode 