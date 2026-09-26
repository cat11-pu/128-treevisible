// app.js：渲染结果
import { buildTree } from "./tree.js";
import { visibleRows } from "./rows.js";

export function render(spec) {
  const tree = buildTree(spec.nodes || []);
  const rows = visibleRows(tree, spec.expanded || []);
  const byId = new Map((spec.nodes || []).map((item) => [item.id, item]));
  const depthOf = (id) => {
    let steps = 0;
    let cursor = byId.get(id);
    while (cursor && cursor.parent !== null && cursor.parent !== undefined && byId.has(cursor.parent)) {
      steps += 1;
      cursor = byId.get(cursor.parent);
    }
    return steps;
  };
  const depths = rows.map((id) => depthOf(id));
  const deepest = depths.length ? Math.max.apply(null, depths) : 0;
  return { rows: rows, depths: depths, count: rows.length,
           hidden: (spec.nodes || []).length - rows.length, deepest: deepest };
}
