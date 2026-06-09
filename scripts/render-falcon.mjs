/** Render the current FalconViews (top + side) to standalone SVG for review. */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ts = require("typescript");

const file = new URL("../src/features/systems/aircraft/FalconViews.tsx", import.meta.url);
let code = readFileSync(file, "utf8");
code = code.replace(/@\/lib\/cn/g, "./_cn.js");

const js = ts.transpileModule(code, {
  compilerOptions: {
    jsx: ts.JsxEmit.React,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
writeFileSync(
  new URL("../scripts/_falcon.mjs", import.meta.url),
  "const React = globalThis.React;\n" + js,
);
writeFileSync(
  new URL("../scripts/_cn.js", import.meta.url),
  "export const cn=(...a)=>a.filter(Boolean).join(' ');\n",
);

const React = {
  createElement: (tag, props, ...kids) => ({ tag, props: props || {}, children: kids.flat() }),
  Fragment: "g",
};
globalThis.React = React;

const mod = await import("./_falcon.mjs");

const CAMEL = {
  strokeWidth: "stroke-width", strokeLinecap: "stroke-linecap", strokeLinejoin: "stroke-linejoin",
  strokeDasharray: "stroke-dasharray", strokeDashoffset: "stroke-dashoffset", fillOpacity: "fill-opacity",
  strokeOpacity: "stroke-opacity", textAnchor: "text-anchor", fontSize: "font-size", fontWeight: "font-weight",
  stopColor: "stop-color", stopOpacity: "stop-opacity",
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function ser(n) {
  if (n == null || n === false || n === true) return "";
  if (typeof n === "string" || typeof n === "number") return esc(n);
  if (Array.isArray(n)) return n.map(ser).join("");
  if (typeof n.tag === "function") return ser(n.tag(n.props));
  const { tag, props, children } = n;
  const attrs = Object.entries(props)
    .filter(([k]) => !["children", "key", "className"].includes(k))
    .map(([k, v]) => (v == null || v === false ? "" : `${CAMEL[k] || k}="${esc(v)}"`))
    .filter(Boolean)
    .join(" ");
  return `<${tag}${attrs ? " " + attrs : ""}>${ser(children)}</${tag}>`;
}

for (const [name, vb] of [["FalconTopView", mod.TOP_VIEW.viewBox], ["FalconSideView", mod.SIDE_VIEW.viewBox]]) {
  const body = ser(React.createElement(mod[name], { highlight: "wing" }));
  const svg = `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0b1220"/>${body}</svg>`;
  writeFileSync(new URL(`../scripts/falcon-${name}.svg`, import.meta.url), svg);
  console.log("wrote falcon-" + name + ".svg");
}
