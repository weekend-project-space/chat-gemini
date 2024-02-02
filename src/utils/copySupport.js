// 检测是否iOS端
function iosAgent() {
  return navigator.userAgent.match(/(iPhone|iPod|iPad);?/i);
}

// 复制文本函数，微信端，需要在用户触发 Click 事件里面才能执行成功
export function copy(message) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(message);
  } else if (iosAgent()) {
    console.log("input 复制方式 " + message);
    let inputObj = document.createElement("input");
    inputObj.value = message;
    document.body.appendChild(inputObj);
    inputObj.select();
    inputObj.setSelectionRange(0, inputObj.value.length);
    _execCommand('Copy');
    document.body.removeChild(inputObj);
  } else {
    console.log("document 复制方式 " + message);
    let domObj = document.createElement("span");
    domObj.innerHTML = message;
    document.body.appendChild(domObj);
    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNodeContents(domObj);
    selection.removeAllRanges();
    selection.addRange(range);
    _execCommand('Copy');
    document.body.removeChild(domObj);
  }
}

// 执行浏览器命令 Copy 顺便输出一下日志，如果在移动端推荐写个方法展示日志或者用alert(msg)也行。
function _execCommand(action) {
  let is = document.execCommand(action);
  if (is) {
    console.log("复制成功");
  } else {
    console.log("复制失败");
  }
}
