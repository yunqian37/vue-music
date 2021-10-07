/**
 *  通过一个新的ref函数使任何响应式变量在任何地方起作用
 *  ref函数：
 *    ref推荐定义基本数据类型
 *    在vue的模版中使用ref的值不需要通过value获取，vue会通过自动给ref的值加上.value
 *    在js中使用ref的值必须使用.value获取
 */
import { ref, watch, nextTick, computed } from 'vue'

export default function useFixed(props) {
  const TITLE_HEIGHT = 30 // 固定title栏高度
  const groupRef = ref(null) // 整体列表的实例
  const listHeights = ref([]) // 列表各个子模块的位置
  const scrollY = ref(0) // 当前滚动的位置
  const currentIndex = ref(0) // 当前模块的坐标
  const distance = ref(0) // 当前模块的底部与页面头部的间距

  // 计算当前固定栏title的值
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      // scrollY的值 < 0时则固定title栏的内容不显示
      return ''
    }
    // 获取当前固定栏显示的名称
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  // 滚动时两个title栏相接的动画效果
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    // 根据当前模块与页面头部的间距 动态设置固定栏的动画效果
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })

  // 监听props.data 即歌手列表的数据
  watch(() => props.data, async () => {
    // nextTick将回调推迟到下一个DOM更新周期之后执行。在更改了一些数据以等待DOM更新后立即使用它
    await nextTick()
    // 当歌手列表数据进行改变时计算
    calculate()
  })

  // 监听滚动位置
  watch(scrollY, (newY) => {
    // 获取当前各个子模块的位置数据
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      // 开始位置为当前模块的值
      const heightTop = listHeightsVal[i]
      // 结束位置为下一个模块的值
      const heightBottom = listHeightsVal[i + 1]
      // 当前位置 >= 开始位置  && 当前的值 <= 结束位置
      // 即当前位置是否在该模块区域内
      if (newY >= heightTop && newY <= heightBottom) {
        // 设置当前模块的坐标
        currentIndex.value = i
        // 当前模块底部与页面头部的间距
        distance.value = heightBottom - newY
      }
    }
  })

  // 计算所有子模块的高度
  function calculate() {
    // list 获取整体列表的子元素
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0

    // 初始化列表各个子模块位置
    listHeightsVal.length = 0
    // 第一个模块位置默认为0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      // clientHeight：元素高度 height + padding 不包含边框 即元素可视区域高度
      // 各模块的开始位置 = 之前各个模块高度之和
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }
  // 当列表滚动时调用 获取当前滚动的位置
  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
