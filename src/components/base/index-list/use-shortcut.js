import { ref, computed } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18 // 锚点像素
  const scrollRef = ref(null)
  // 获取右侧字母导航栏的数据
  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  const touch = {}

  function onShortcutTouchStart(e) {
    // 获取当前坐标
    const anchorIndex = parseInt(e.target.dataset.index)
    // 记录第一个y坐标
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e) {
    // 记录第二个y坐标
    touch.y2 = e.touches[0].pageY
    // 获取间距
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }

  function onShortcutTouchEnd(e) {}

  // 滚动的封装
  function scrollTo(index) {
    if (isNaN(index)) return
    // 超出范围会报错 设置index范围
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    // 获取目标滚动元素
    const targetEl = groupRef.value.children[index]
    // 获取滚动组件scroll实例
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    scrollRef,
    onShortcutTouchMove,
    onShortcutTouchEnd
  }
}
