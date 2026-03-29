/**
 * Soni Frontend — Medium — Render DOM from tree (Meta)
 * Requires: npm install (jsdom).
 */

const { JSDOM } = require("jsdom");

const dom = {
  type: "section",
  props: {
    id: "section-1",
    class: "main-section",
    style:
      "background-color: lightblue; padding: 20px; border-radius: 5px;",
  },
  children: [
    {
      type: "header",
      children: "Welcome to Soni Frontend Doc",
      props: {
        style: "font-size: 24px; color: darkblue; text-align: center;",
      },
    },
    {
      type: "article",
      children: [
        {
          type: "h2",
          children: "Render DOM",
          props: { style: "color: darkgreen;" },
        },
        {
          type: "p",
          children: "Try yourself first then look for solution",
          props: { style: "font-size: 16px; color: grey;" },
        },
      ],
    },
    {
      type: "footer",
      children: "Thanks you :)",
      props: {
        style: "text-align: center; font-size: 14px; color: black;",
      },
    },
  ],
};

const renderDom = ({ type, props, children }, document) => {
  if (!type) return null;
  const ele = document.createElement(type);
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key === "style") {
        ele.style.cssText = value;
      } else {
        ele.setAttribute(key, value);
      }
    });
  }
  if (Array.isArray(children)) {
    children.forEach((child) => ele.appendChild(renderDom(child, document)));
  } else if (typeof children === "string") {
    ele.textContent = children;
  }
  return ele;
};

const { window } = new JSDOM(
  "<!DOCTYPE html><html><body><div id='root'></div></body></html>"
);
const rootEle = window.document.getElementById("root");
rootEle.appendChild(renderDom(dom, window.document));
console.log(rootEle.innerHTML.slice(0, 300));
