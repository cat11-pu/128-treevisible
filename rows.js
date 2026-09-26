// rows.js：可见行。按原列表顺序做深度优先遍历，只有展开集合里的节点才露出子节点。
function unknownNode(id) {
  const error = new Error("展开集合里的节点 " + id + " 不在树中");
  error.code = "E_UNKNOWN_NODE";
  return error;
}

export function visibleRows(tree, expanded) {
  const open = new Set(expanded || []);
  for (const id of open) {
    if (!tree.index.has(id)) throw unknownNode(id);
  }
  const rows = [];
  const stack = [];
  for (let spot = tree.roots.length - 1; spot >= 0; spot -= 1) stack.push(tree.roots[spot]);
  while (stack.length) {
    const id = stack.pop();
    rows.push(id);
    if (!open.has(id)) continue;
    const kids = tree.children[tree.index.get(id)];
    for (let spot = kids.length - 1; spot >= 0; spot -= 1) stack.push(kids[spot]);
  }
  return rows;
}
