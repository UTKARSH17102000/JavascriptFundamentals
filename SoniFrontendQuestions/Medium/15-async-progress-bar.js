/**
 * Soni Frontend — Medium — Concurrent progress bars with concurrency limit (Uber)
 * Requires: npm install (jsdom).
 */

const { JSDOM } = require("jsdom");

const { window } = new JSDOM(
  `<!DOCTYPE html><html><body>
<button id="btn">Click Me</button>
<button id="reset-btn">Reset</button>
<div id="progress-bar"></div>
</body></html>`
);
const document = window.document;

const progressBarEle = document.getElementById("progress-bar");
const btn = document.getElementById("btn");
const resetBtn = document.getElementById("reset-btn");

function createProgressBarElement() {
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    height: "20px",
    width: "300px",
    border: "2px solid black",
    marginBottom: "5px",
  });
  const progress = document.createElement("div");
  Object.assign(progress.style, {
    width: "0%",
    height: "20px",
    background: "pink",
  });
  wrapper.appendChild(progress);
  progressBarEle.appendChild(wrapper);
  return progress;
}

function ProgressBarManager(maxConcurrent) {
  let activeCount = 0;
  const queue = [];
  let currentIndex = 0;

  function animateProgressBar(element) {
    activeCount++;
    let progress = 0;
    const intervalId = window.setInterval(() => {
      progress++;
      element.style.width = `${progress}%`;
      if (progress >= 100) {
        window.clearInterval(intervalId);
        activeCount--;
        runNextProgressBar();
      }
    }, 10);
  }

  function runNextProgressBar() {
    if (currentIndex < queue.length && activeCount < maxConcurrent) {
      const element = queue[currentIndex++];
      animateProgressBar(element);
    }
  }

  function addProgressBar() {
    const progressBarElement = createProgressBarElement();
    queue.push(progressBarElement);
    runNextProgressBar();
  }

  function resetProgressBars() {
    queue.length = 0;
    currentIndex = 0;
    activeCount = 0;
    progressBarEle.innerHTML = "";
  }

  return { addProgressBar, resetProgressBars };
}

const progressBarManager = ProgressBarManager(3);
btn.addEventListener("click", () => {
  progressBarManager.addProgressBar();
});
resetBtn.addEventListener("click", () => {
  progressBarManager.resetProgressBars();
});

for (let i = 0; i < 5; i++) progressBarManager.addProgressBar();
console.log("progress bars created:", progressBarEle.children.length);
