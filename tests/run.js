import assert from "node:assert";
import { buildTree } from "../tree.js";
import { visibleRows } from "../rows.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("buildTree returns ids", () => {
  assert.ok(Array.isArray(buildTree([{ id: "a", parent: null }]).ids));
});

check("buildTree returns parents", () => {
  assert.ok(Array.isArray(buildTree([{ id: "a", parent: null }]).parents));
});

check("visibleRows returns a list", () => {
  const tree = buildTree([{ id: "a", parent: null }]);
  assert.ok(Array.isArray(visibleRows(tree, ["a"])));
});

check("render counts rows", () => {
  assert.strictEqual(typeof render({ nodes: [{ id: "a", parent: null }], expanded: ["a"] }).count, "number");
});

check("render exposes depths", () => {
  assert.ok(Array.isArray(render({ nodes: [{ id: "a", parent: null }], expanded: ["a"] }).depths));
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
