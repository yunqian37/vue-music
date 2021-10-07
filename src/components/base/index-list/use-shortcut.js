import { ref, computed } from 'vue'

export default function useShortcut(props, groupRef) {
  const scrollRef = ref(null)
  // 获取右侧字母导航栏的数据
  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  function onShortcutTouchStart(e) {
    // 获取当前坐标
    const anchorIndex = parseInt(e.target.dataset.index)
    // 获取目标滚动元素
    const targetEl = groupRef.value.children[anchorIndex]
    // 获取滚动组件scroll实例
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }

  function onShortcutTouchMove(e) {

  }

  function onShortcutTouchEnd(e) {}

  return {
    shortcutList,
    onShortcutTouchStart,
    scrollRef,
    onShortcutTouchMove,
    onShortcutTouchEnd
  }
}
