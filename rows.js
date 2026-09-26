// rows.js：按展开状态做深度优先遍历，折叠节点的整棵子树都不出现
import { TreeError } from "./tree.js";

export function visibleRows(tree, expanded) {
  const byId = tree.byId;
  const open = new Set();
  const listed = expanded === undefined || expanded === null ? [] : expanded;
  for (const id of listed) {
    if (!byId.has(id)) {
      throw new TreeError(
        "E_UNKNOWN_NODE",
        "展开集合里存在树中没有的节点: " + JSON.stringify(id)
      );
    }
    open.add(id);
  }

  const rows = [];
  const stack = [];
  const roots = tree.roots;
  for (let i = roots.length - 1; i >= 0; i--) stack.push(roots[i]);

  while (stack.length) {
    const id = stack.pop();
    rows.push(id);
    if (open.has(id)) {
      const kids = tree.children[byId.get(id)];
      for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i]);
    }
  }
  return rows;
}
