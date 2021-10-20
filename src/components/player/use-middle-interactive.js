import { ref } from 'vue'

export default function useMiddleInteractive() {
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  const touch = {}

  let currentView = 'cd'

  function onMiddleTouchStart(e) {
    // 获取手指按下去时的x坐标
    touch.startX = e.touches[0].pageX
  }
  function onMiddleTouchMove(e) {
    // 手指拖动的位移
    const deltaX = e.touches[0].pageX - touch.startX
    // window.innerWidth:屏幕的宽度
    const left = currentView === 'cd' ? 0 : -window.innerWidth
    // 歌词列表偏移量 限制在0与window.innerWidth之间
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    // 计算拖动的百分比
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    if (currentView === 'cd') {
      if (touch.percent > 0.2) {
        // 在cd界面的情况下拖动超过20%设置当前页为歌词页面
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        // 在歌词界面拖动小于0.8 设置当前页为cd页面
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    // 样式设置
    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms'
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: '0ms'
    }
  }
  function onMiddleTouchEnd() {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
