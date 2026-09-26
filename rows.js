// rows.js：可见行（基线：把所有节点按原顺序都算作可见）
import { buildTree } from "./tree.js";

export function visibleRows(tree, expanded) {
  return tree.ids.slice();
}
