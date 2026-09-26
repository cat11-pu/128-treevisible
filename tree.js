// tree.js：建树并校验结构（父引用必须存在、父链不能有环），一次遍历建索引。
function badTree(message) {
  const error = new Error(message);
  error.code = "E_BAD_TREE";
  return error;
}

export function buildTree(nodes) {
  const list = Array.isArray(nodes) ? nodes : [];
  const size = list.length;
  const ids = new Array(size);
  const parents = new Array(size);
  const index = new Map();
  for (let spot = 0; spot < size; spot += 1) {
    const node = list[spot] || {};
    ids[spot] = node.id;
    parents[spot] = node.parent === undefined ? null : node.parent;
    index.set(node.id, spot);
  }
  for (let spot = 0; spot < size; spot += 1) {
    const parent = parents[spot];
    if (parent !== null && !index.has(parent)) {
      throw badTree("节点 " + ids[spot] + " 的父节点 " + parent + " 不存在");
    }
  }
  // 沿父链算层级，顺带查环；state: 0 未访问 1 在链上 2 已定。迭代写法，深链不爆栈。
  const depth = new Array(size).fill(0);
  const state = new Array(size).fill(0);
  const chain = [];
  for (let spot = 0; spot < size; spot += 1) {
    if (state[spot] !== 0) continue;
    let cursor = spot;
    while (cursor !== -1 && state[cursor] === 0) {
      state[cursor] = 1;
      chain.push(cursor);
      const parent = parents[cursor];
      cursor = parent === null ? -1 : index.get(parent);
    }
    if (cursor !== -1 && state[cursor] === 1) {
      throw badTree("父链上出现环，经过节点 " + ids[cursor]);
    }
    let level = cursor === -1 ? 0 : depth[cursor] + 1;
    while (chain.length) {
      const item = chain.pop();
      depth[item] = level;
      state[item] = 2;
      level += 1;
    }
  }
  const children = new Array(size);
  for (let spot = 0; spot < size; spot += 1) children[spot] = [];
  const roots = [];
  for (let spot = 0; spot < size; spot += 1) {
    const parent = parents[spot];
    if (parent === null) roots.push(ids[spot]);
    else children[index.get(parent)].push(ids[spot]);
  }
  return { ids: ids, parents: parents, children: children, roots: roots, depth: depth, index: index };
}
