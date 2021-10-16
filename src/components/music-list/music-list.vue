<template>
  <div class="music-list">
    <div
      class="back"
      @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div
      class="bg-image"
      :style="bgImageStyle"
      ref="bgImage">
      <!-- 动态设置模糊层 -->
      <div
        class="filter"
        :style="filterStyle"></div>
    </div>
    <!-- probe-type用法参考滚动组件文档 -->
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll">
      <div class="song-list-wrapper">
        <SongList :songs="songs" />
      </div>
    </scroll>
  </div>
</template>
<script>
import scroll from '@/components/base/scroll/scroll.vue'
import SongList from '@/components/base/song-list/song-list.vue'

// 定义常量 头部导航栏的高度
const RESERVED_HEIGHT = 40

export default {
  name: 'music-list',
  components: {
    scroll,
    SongList
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: String,
    pic: String,
    loading: Boolean,
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲'
    }
  },
  data() {
    return {
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0 // 最大滚动距离
    }
  },
  computed: {
    noResult() {
      return !this.loading && !this.songs.length
    },
    bgImageStyle() {
      // 这样赋值有一个性能优化的效果，当多次使用这个数据的时候可以从缓存里获取。
      const scrollY = this.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      // ios的兼容问题
      let translateZ = 0
      if (scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }

      // 缩放
      let scale = 1
      if (scrollY < 0) {
        // 计算缩放的具体值
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }

      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`
      }
    },
    scrollStyle() {
      return {
        top: `${this.imageHeight}px`
      }
    },
    filterStyle() {
      let blur = 0
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      // 页面向上推的一个过程
      if (screenY >= 0) {
        // 设置blur的最大值
        blur = Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    }
  },
  mounted() {
    // 获取背景高度，动态设置list的top值
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 设置最大滚动距离
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    // 获取滚动距离
    onScroll(pos) {
      this.scrollY = -pos.y
    }
  }
}
</script>
<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
