/**
 * Extracts pure-data declarations from the legacy single-file app
 * (legacy/index.html) and writes them as JSON into src/data/raw.
 *
 * The legacy app is a Babel-transpiled bundle where content lives in
 * `var NAME=[...]` / `var NAME={...}` literals. We locate each name,
 * bracket-match the following literal (string-aware), and evaluate it in
 * an isolated function scope. Only data literals (no functions) are valid
 * targets — interactive/SVG components are ported by hand.
 *
 * Usage: node scripts/extract-content.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const src = readFileSync(resolve(root, "legacy/index.html"), "utf8");
const outDir = resolve(root, "src/data/raw");
mkdirSync(outDir, { recursive: true });

// Data-only declarations safe to evaluate.
const TARGETS = [
  "QUESTIONS",
  "LIMITATIONS",
  "MEMORY_ITEMS",
  "SYSTEMS",
  "PROCEDURES",
  "TRAINER_PROCEDURES",
  "COCKPIT",
  "FLIGHT_PHASES",
  "AIRCRAFT_REGISTRY",
  "ORAL_QUESTIONS",
];

const OPEN = { "[": "]", "{": "}" };

/** Bracket-match a literal starting at `start` (index of `[` or `{`). */
function matchLiteral(text, start) {
  const open = text[start];
  const close = OPEN[open];
  let depth = 0;
  let inStr = null;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (c === "\\") {
        i++;
        continue;
      }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = c;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  throw new Error(`Unbalanced literal starting at ${start}`);
}

function extract(name) {
  const decl = `var ${name}=`;
  const at = src.indexOf(decl);
  if (at === -1) {
    console.warn(`  ! ${name}: not found`);
    return null;
  }
  let i = at + decl.length;
  while (i < src.length && src[i] !== "[" && src[i] !== "{") i++;
  const literal = matchLiteral(src, i);
  // eslint-disable-next-line no-new-func
  const value = Function(`"use strict";return (${literal});`)();
  return value;
}

let ok = 0;
for (const name of TARGETS) {
  try {
    const value = extract(name);
    if (value == null) continue;
    const file = resolve(outDir, `${name}.json`);
    writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
    const count = Array.isArray(value)
      ? `${value.length} items`
      : `${Object.keys(value).length} keys`;
    console.log(`  ✓ ${name} → ${count}`);
    ok++;
  } catch (err) {
    console.warn(`  ! ${name}: ${err.message}`);
  }
}
console.log(`\nExtracted ${ok}/${TARGETS.length} declarations to src/data/raw`);
