// tree.js：建树（基线：不建父子关系）
export function buildTree(nodes) {
  return { ids: nodes.map((item) => item.id), parents: [], children: [] };
}
