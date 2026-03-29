/**
 * Soni Frontend — Medium — Find matching element in DOM (Swiggy)
 * Same index path in two parallel trees; returns corresponding node in container2 or null.
 * Requires: npm install (jsdom) in parent folder.
 */

const { JSDOM } = require("jsdom");

const html = `<!DOCTYPE html><html><body>
<div id="container1">
  <div>
    <div>
      <span id="span-id">Test1</span>
      <span id="span-id-2">Test2</span>
    </div>
  </div>
</div>
<div id="container2">
  <div>
    <div>
      <span>Test2</span>
    </div>
  </div>
</div>
</body></html>`;

const findMatchingElement = (container1, container2, targetElement) => {
  if (container1 === targetElement) return container2;
  const children1 = Array.from(container1.children);
  const children2 = Array.from(container2.children);
  for (let i = 0; i < children1.length; i++) {
    if (children1[i] && children2[i]) {
      const result = findMatchingElement(
        children1[i],
        children2[i],
        targetElement
      );
      if (result) return result;
    }
  }
  return null;
};

const dom = new JSDOM(html);
const { document } = dom.window;

const positiveResult = findMatchingElement(
  document.getElementById("container1"),
  document.getElementById("container2"),
  document.getElementById("span-id")
);
console.log("Positive Result:", positiveResult && positiveResult.textContent);

const negativeResult = findMatchingElement(
  document.getElementById("container1"),
  document.getElementById("container2"),
  document.getElementById("span-id-2")
);
console.log("Negative Result:", negativeResult);
