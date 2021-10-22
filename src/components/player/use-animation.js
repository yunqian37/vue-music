import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation() {
  const cdWrapperRef = ref(null)

  function enter(el, done) {
    const { x, y, scale } = getPosAndScale()
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }
    // 注册动画
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }
  function afterEnter() {
    animations.unregisterAnimation('move')
    cdWrapperRef.value.animation = ''
  }
  function leave(el, done) {
    const { x, y, scale } = getPosAndScale()
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    cdWrapperEl.addEventListener('transitionend', next)
    // 解绑事件
    function next() {
      cdWrapperEl.removeEventListener('transitionend', next)
      done()
    }
  }
  // 清理操作
  function afterLeave() {
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
  }
  // 计算偏移量
  function getPosAndScale() {
    // 目标宽度（小cd）
    const targetWidth = 40
    // 小cd圆心到边界的距离
    const paddingLeft = 40
    const paddingBottom = 30
    // 大cd到顶部的距离
    const paddingTop = 80
    // 大cd的宽度
    const width = window.innerWidth * 0.8
    // x轴的偏移量
    const x = -(window.innerWidth / 2 - paddingLeft)
    // y轴的偏移量
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    // 缩放
    const scale = targetWidth / width

    return {
      x,
      y,
      scale
    }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
