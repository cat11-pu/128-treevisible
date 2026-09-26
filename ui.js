// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  let expanded = (spec.expanded || []).slice();
  parts.log.textContent = "节点 " + (spec.nodes || []).length + " 个，点按钮折叠或展开最深的那个。";

  function draw() {
    const scene = Object.assign({}, spec, { expanded: expanded });
    let view = null;
    try {
      view = render(scene);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    view.rows.forEach(function (item, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = item;
      head.style.marginLeft = Math.max(0, view.depths[spot]) * 16 + "px";
      row.appendChild(head);
      const mark = document.createElement("span");
      mark.className = "chip";
      mark.textContent = "第 " + view.depths[spot] + " 层";
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "可见行 " + view.count + " 条，隐藏 " + view.hidden + " 个节点";
    parts.log.textContent = "最深层级 " + view.deepest;
  }

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "算可见行";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const foldButton = document.createElement("button");
  foldButton.textContent = "全部折叠";
  foldButton.addEventListener("click", function () {
    expanded = ["root"];
    draw();
  });
  parts.controls.appendChild(foldButton);

  const unfoldButton = document.createElement("button");
  unfoldButton.textContent = "全部展开";
  unfoldButton.addEventListener("click", function () {
    expanded = (spec.nodes || []).map(function (item) { return item.id; });
    draw();
  });
  parts.controls.appendChild(unfoldButton);

  const label = document.createElement("label");
  label.textContent = "加展开一个节点";
  parts.controls.appendChild(label);

  const box = document.createElement("input");
  box.type = "text";
  box.value = "b";
  box.addEventListener("input", function () {
    expanded = (spec.expanded || []).slice();
    expanded.push(box.value);
    draw();
  });
  parts.controls.appendChild(box);

  const readButton = document.createElement("button");
  readButton.textContent = "只看可见行数";
  readButton.addEventListener("click", function () {
    const scene = Object.assign({}, spec, { expanded: expanded });
    const view = render(scene);
    parts.out.textContent = "可见 " + view.count + " 行，隐藏 " + view.hidden + " 个，最深 " + view.deepest + " 层";
  });
  parts.controls.appendChild(readButton);

  draw();
}
