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
    }
  },
  // setup函数中的第一个参数是props，setup函数中的props是响应式的。当传入新的prop时它将被更新
  setup(props) {
    const rootRef = ref(null)
    // 将props数据传递给use-scroll中的函数
    useScroll(rootRef, props)

    return {
      rootRef
    }
  }
}
</script>
