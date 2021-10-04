<template>
  <div class="recommend">
    <!-- slide容器 -->
    <div class="slider-wrapper">
      <!-- slide滚动元素 -->
      <div class="slider-content">
        <!-- 至少需要一个轮播图 -->
        <Slider v-if="sliders.length > 0" :sliders="sliders" />
      </div>
    </div>
  </div>
</template>
<script>
import { getRecommend } from '@/service/recommend'
import Slider from '@/components/base/slider/slider.vue'
export default {
  name: 'recommend',
  components: {
    Slider
  },
  data() {
    return {
      sliders: []
    }
  },
  async created() {
    // 获取轮播图数据
    const result = await getRecommend()
    this.sliders = result.sliders
  }
}
</script>
<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .slider-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 40%;
    overflow: hidden;
    .slider-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
