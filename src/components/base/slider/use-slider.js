import BScroll from '@better-scroll/core'
// slide 为 BetterScroll 扩展了轮播焦点图的能力
import Slide from '@better-scroll/slide'
/**
 * 导入onXXX函数来注册生命周期钩子
 * 只能在setup()期间同步使用
 * 它们依赖于内部的全局状态来定位当前活动的实例
 * 在没有当前活动实例的情况下调用它们将会出错
 */
import { onMounted, onUnmounted, ref, onActivated, onDeactivated } from 'vue'

// 通过静态方法使用
BScroll.use(Slide)

// wrapperRef 接受参数，获取当前轮播图的ref
export default function useSlider(wrapperRef) {
  const slider = ref(null)
  const currentPageIndex = ref(0)
  // onMounted 对标 mounted
  onMounted(() => {
    // BScroll的options中传入slide相关的配置
    const sliderVal = slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true, // 为true时设置slide的方向为横向
      scrollY: false, // 为true时设置slide的方向为纵向，scrollX和scrollY不能同时设置为true
      momentum: false, // 避免惯性动画带来的快速滚动时的闪烁问题和快速滑动时一次滚动多页的问题
      bounce: false, // 设置为false，否则会在循环衔接时出现闪烁
      probeType: 2, // 监听slideWillChange事件，在用户拖动slide时实时获取到slide的PageIndex的改变
      slide: true // 开启slide功能，没有该项则插件不会生效
    })
    // 触发时机：轮播图的当前页值将要改变时
    sliderVal.on('slideWillChange', (page) => {
      // pageX：即将展示的横向页面的索引值，下标从0开始
      currentPageIndex.value = page.pageX
    })
  })
  // onUnmounted 对标 unmounted
  onUnmounted(() => {
    slider.value.destroy()
  })

  // keep-alive相关页面触发
  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })
  onDeactivated(() => {
    slider.value.disable()
  })

  // 返回当前页坐标 && 轮播图信息
  return {
    slider,
    currentPageIndex
  }
}
