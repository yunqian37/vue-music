<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>
<script>
import useScroll from './use-scroll'
import { ref } from 'vue'
export default {
  name: 'scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    },
    // 决定是否派发scroll事件，对页面的性能有影响
    probeType: {
      type: Number,
      default: 0
    }
  },
  // emits：定义一个组件可以向其父组件触发的事件
  emits: ['scroll'],
  /**
   * setup函数中的第一个参数是props，setup函数中的props是响应式的。当传入新的prop时它将被更新
   * setup函数中的第二个参数是context，不是响应式的，可以对context使用ES6解构
   *  注：
   *    因为执行setup时组件实例尚未被创建，因此只能访问以下属性：props、attrs、slots、emit
   *    无法访问：data、computed、methods
   */
  setup(props, { emit }) {
    const rootRef = ref(null)
    // 将props数据传递给use-scroll中的函数
    const scroll = useScroll(rootRef, props, emit)

    return {
      rootRef,
      scroll
    }
  }
}
</script>
