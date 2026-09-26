// app.js：渲染结果（返回结构保持 rows/depths/count/hidden/deepest 五个键）
import { buildTree } from "./tree.js";
import { visibleRows } from "./rows.js";

export function render(spec) {
  const nodes = spec.nodes || [];
  const tree = buildTree(nodes);
  const rows = visibleRows(tree, spec.expanded || []);
  const depths = rows.map((id) => tree.depth[tree.byId.get(id)]);
  const deepest = depths.length ? Math.max.apply(null, depths) : 0;
  return {
    rows: rows,
    depths: depths,
    count: rows.length,
    hidden: nodes.length - rows.length,
    deepest: deepest
  };
}
