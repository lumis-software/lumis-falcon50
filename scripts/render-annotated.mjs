/** Render an AnnotatedView (Falcon art + numbered hotspot markers) to SVG for review. */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ts = require("typescript");

function load(rel, extraReplace = (s) => s) {
  let code = readFileSync(new URL(rel, import.meta.url), "utf8");
  code = code.replace(/@\/lib\/cn/g, "./_cn.js");
  code = extraReplace(code);
  const js = ts.transpileModule(code, {
    compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  return "const React = globalThis.React;\n" + js;
}

const React = {
  createElement: (tag, props, ...kids) => ({ tag, props: props || {}, children: kids.flat() }),
  Fragment: "g",
};
globalThis.React = React;

writeFileSync(new URL("./_cn.js", import.meta.url), "export const cn=(...a)=>a.filter(Boolean).join(' ');\n");
writeFileSync(new URL("./_falcon.mjs", import.meta.url), load("../src/features/systems/aircraft/FalconViews.tsx"));
// pointLearn imports only a type from AnnotatedDiagram (erased) -> safe to transpile alone.
writeFileSync(new URL("./_pl.mjs", import.meta.url), load("../src/features/systems/aircraft/pointLearn.ts", (s) => s.replace(/import type[^\n]*\n/g, "")));

const falcon = await import("./_falcon.mjs");
const { POINT_LEARN } = await import("./_pl.mjs");

const CAMEL = { strokeWidth: "stroke-width", strokeLinecap: "stroke-linecap", strokeLinejoin: "stroke-linejoin", strokeDasharray: "stroke-dasharray", fillOpacity: "fill-opacity", strokeOpacity: "stroke-opacity", textAnchor: "text-anchor", fontSize: "font-size", fontWeight: "font-weight", stopColor: "stop-color", stopOpacity: "stop-opacity" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function ser(n) {
  if (n == null || n === false || n === true) return "";
  if (typeof n === "string" || typeof n === "number") return esc(n);
  if (Array.isArray(n)) return n.map(ser).join("");
  if (typeof n.tag === "function") return ser(n.tag(n.props));
  const { tag, props, children } = n;
  const attrs = Object.entries(props).filter(([k]) => !["children", "key", "className"].includes(k)).map(([k, v]) => (v == null || v === false ? "" : `${CAMEL[k] || k}="${esc(v)}"`)).filter(Boolean).join(" ");
  return `<${tag}${attrs ? " " + attrs : ""}>${ser(children)}</${tag}>`;
}

const slug = process.argv[2];
const data = POINT_LEARN[slug];
if (!data) { console.error("no view for", slug, "— have:", Object.keys(POINT_LEARN).join(", ")); process.exit(1); }
const vb = data.view === "top" ? falcon.TOP_VIEW.viewBox : falcon.SIDE_VIEW.viewBox;
const View = data.view === "top" ? falcon.FalconTopView : falcon.FalconSideView;
const art = ser(React.createElement(View, { highlight: undefined }));
const markers = data.hotspots.map((hs, i) =>
  `<circle cx="${hs.x}" cy="${hs.y}" r="12" fill="#1e293b" stroke="#60a5fa" stroke-width="2"/><text x="${hs.x}" y="${hs.y + 4}" text-anchor="middle" font-size="13" font-weight="bold" fill="#dbeafe">${i + 1}</text>`,
).join("");
const svg = `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0b1220"/>${art}${markers}</svg>`;
writeFileSync(new URL(`./pl-${slug}.svg`, import.meta.url), svg);
console.log("wrote pl-" + slug + ".svg");
