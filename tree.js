// tree.js：建树索引并校验父子关系（父缺失 / 父链有环 => E_BAD_TREE）
export class TreeError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "TreeError";
    this.code = code;
  }
}

function isEmptyParent(value) {
  return value === null || value === undefined || value === "";
}

export function buildTree(nodes) {
  const list = Array.isArray(nodes) ? nodes : [];
  const n = list.length;
  const ids = new Array(n);
  const parents = new Array(n).fill(null);
  const children = new Array(n);
  const parentIndex = new Array(n).fill(-1);
  const byId = new Map();

  for (let i = 0; i < n; i++) {
    const item = list[i] || {};
    if (byId.has(item.id)) {
      throw new TreeError("E_BAD_TREE", "节点 id 重复: " + JSON.stringify(item.id));
    }
    byId.set(item.id, i);
    ids[i] = item.id;
    children[i] = [];
  }

  for (let i = 0; i < n; i++) {
    const parent = list[i].parent;
    if (isEmptyParent(parent)) continue;
    const pi = byId.get(parent);
    if (pi === undefined) {
      throw new TreeError(
        "E_BAD_TREE",
        "节点 " + JSON.stringify(ids[i]) + " 的父节点不存在: " + JSON.stringify(parent)
      );
    }
    parentIndex[i] = pi;
    parents[i] = parent;
    children[pi].push(ids[i]);
  }

  // 环检测与层级一起算：沿父链边走边标记，每个节点整体只走 O(1) 摊还
  const state = new Array(n).fill(0); // 0 未访问 / 1 在当前父链上 / 2 已完成
  const depth = new Array(n).fill(0);
  for (let start = 0; start < n; start++) {
    if (state[start] !== 0) continue;
    const path = [];
    let cur = start;
    while (cur !== -1 && state[cur] === 0) {
      state[cur] = 1;
      path.push(cur);
      cur = parentIndex[cur];
    }
    if (cur !== -1 && state[cur] === 1) {
      throw new TreeError("E_BAD_TREE", "父链存在环，涉及节点: " + JSON.stringify(ids[cur]));
    }
    let level = cur === -1 ? -1 : depth[cur];
    for (let k = path.length - 1; k >= 0; k--) {
      level += 1;
      depth[path[k]] = level;
      state[path[k]] = 2;
    }
  }

  const roots = [];
  for (let i = 0; i < n; i++) {
    if (parentIndex[i] === -1) roots.push(ids[i]);
  }

  return {
    ids: ids,
    parents: parents,
    children: children,
    parentIndex: parentIndex,
    byId: byId,
    depth: depth,
    roots: roots
  };
}
