// app.js：渲染结果
import { buildTree } from "./tree.js";
import { visibleRows } from "./rows.js";

export function render(spec) {
  const tree = buildTree(spec.nodes || []);
  const rows = visibleRows(tree, spec.expanded || []);
  const depths = rows.map((id) => tree.depth[tree.index.get(id)]);
  let deepest = 0;
  for (const level of depths) if (level > deepest) deepest = level;
  return { rows: rows, depths: depths, count: rows.length,
           hidden: (spec.nodes || []).length - rows.length, deepest: deepest };
}
