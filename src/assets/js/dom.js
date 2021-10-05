export function addClass(el, className) {
  // 判断该实例中的样式类名是否包含 动态className的值
  if (!el.classList.contains(className)) {
    // 不包含则新增
    el.classList.add(className)
  }
}

export function removeClass(el, className) {
  // 移除该实例中的类名
  el.classList.remove(className)
}
