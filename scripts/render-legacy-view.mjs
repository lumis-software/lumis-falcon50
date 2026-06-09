/**
 * Renders a legacy React.createElement-based SVG component to a standalone .svg
 * file so we can visually evaluate it. Provides a tiny createElement shim that
 * serializes to SVG markup.
 */
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync(new URL("../legacy/index.html", import.meta.url), "utf8");

function extractExpr(name) {
  const decl = `var ${name}=`;
  const at = src.indexOf(decl);
  if (at < 0) throw new Error(`${name} not found`);
  let i = at + decl.length;
  const start = i;
  let c = 0, p = 0, sq = 0, str = null;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (str) { if (ch === "\\") { i++; continue; } if (ch === str) str = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { str = ch; continue; }
    if (ch === "{") c++; else if (ch === "}") c--;
    else if (ch === "(") p++; else if (ch === ")") p--;
    else if (ch === "[") sq++; else if (ch === "]") sq--;
    else if (ch === ";" && !c && !p && !sq) return src.slice(start, i);
  }
  throw new Error("no terminator");
}

const CAMEL = {
  strokeWidth: "stroke-width", strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin", strokeDasharray: "stroke-dasharray",
  strokeDashoffset: "stroke-dashoffset", strokeOpacity: "stroke-opacity",
  fillOpacity: "fill-opacity", textAnchor: "text-anchor", fontSize: "font-size",
  fontWeight: "font-weight", fontFamily: "font-family", stopColor: "stop-color",
  stopOpacity: "stop-opacity", gradientUnits: "gradientUnits", clipPath: "clip-path",
  repeatCount: "repeatCount", attributeName: "attributeName", dur: "dur",
};

function styleToStr(o) {
  return Object.entries(o)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v}`)
    .join(";");
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function serialize(node) {
  if (node == null || node === false || node === true) return "";
  if (typeof node === "string" || typeof node === "number") return esc(node);
  if (Array.isArray(node)) return node.map(serialize).join("");
  const { tag, props, children } = node;
  const attrs = Object.entries(props || {})
    .filter(([k]) => k !== "children" && k !== "key" && k !== "onClick")
    .map(([k, v]) => {
      if (k === "className") return `class="${esc(v)}"`;
      if (k === "style" && v && typeof v === "object") return `style="${esc(styleToStr(v))}"`;
      if (v == null || v === false) return "";
      return `${CAMEL[k] || k}="${esc(v)}"`;
    })
    .filter(Boolean)
    .join(" ");
  const inner = serialize(children);
  return `<${tag}${attrs ? " " + attrs : ""}>${inner}</${tag}>`;
}

const React = {
  createElement: (tag, props, ...children) => ({ tag, props, children }),
  Fragment: "g",
};

const name = process.argv[2] || "FalconSideView";
const fnText = extractExpr(name);
// eslint-disable-next-line no-new-func
const fn = new Function("React", `return (${fnText});`)(React);

const state = {
  gear: "down", flap: 20, slat: true, airbrake: false,
  eng: [
    { run: true, n1: 88 },
    { run: true, n1: 90 },
    { run: true, n1: 89 },
  ],
  lights: { beacon: true, landing: true, taxi: false, position: true, strobe: true },
  autopilot: true, yawDamp: true, reverser: false,
};
const tree = fn({ s: state });
const body = serialize(tree);
const out = body.startsWith("<svg")
  ? body
  : `<svg viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const file = new URL(`../scripts/legacy-${name}.svg`, import.meta.url);
writeFileSync(file, out);
console.log("wrote", file.pathname, `(${out.length} bytes)`);
