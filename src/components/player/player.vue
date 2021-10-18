<template>
  <div class="player">
    <div
      class="normal-player"
      v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{currentSong.name}}</h1>
        <h2 class="subtitle">{{currentSong.singer}}</h2>
      </div>
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i class="icon-prev" @click="prev" />
          </div>
          <div class="icon i-center" :class="disableCls">
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i class="icon-next" @click="next" />
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
      <audio
        ref="audioRef"
        @pause="pause"
        @canplay="ready"
        @error="error" />
    </div>
  </div>
</template>
<script>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
export default {
  name: 'player',
  setup() {
    const audioRef = ref(null)
    // 初始配置 歌曲是否准备完毕
    const songReady = ref(false)
    // 获取store数据
    const store = useStore()
    // 播放器状态 全屏还是收缩
    const fullScreen = computed(() => store.state.fullScreen)
    // 当前播放的歌曲
    const currentSong = computed(() => store.getters.currentSong)
    // 获取播放状态 动态设置播放按钮样式
    const playing = computed(() => store.state.playing)
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })
    const disableCls = computed(() => {
      return songReady.value ? '' : 'disabled'
    })
    // 获取当前歌曲的索引
    const currentIndex = computed(() => store.state.currentIndex)
    // 获取当前歌曲的播放列表
    const playlist = computed(() => store.state.playList)

    // 监听当前播放歌曲是否改变
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      songReady.value = false
      console.log('watch currentSong ------', songReady.value)
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })
    // 监听当前的播放状态 操作歌曲的暂停 & 播放
    watch(playing, (newPlaying) => {
      if (!songReady.value) return
      const audioEl = audioRef.value
      newPlaying ? audioEl.play() : audioEl.pause()
    })
    // 返回，更改播放器状态
    function goBack() {
      store.commit('setFullScreen', false)
    }
    // 切换播放状态
    function togglePlay() {
      console.log('togglePlay ------', songReady.value)
      if (!songReady.value) return
      store.commit('setPlayingState', !playing.value)
    }
    // 不是用户操作点击的状态下暂停事件处理，比如电脑进入睡眠。。。
    function pause() {
      store.commit('setPlayingState', false)
    }
    // 切换上一首歌
    function prev() {
      console.log('prev ------', songReady.value)
      const list = playlist.value
      if (!songReady.value || !list.length) return
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        // 如果当前坐标为第一首歌则切换至播放列表的最后一首
        if (index === -1) {
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
        // 如果当前播放状态为暂停时则自动播放
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }
    // 切换上一首歌
    function next() {
      console.log('next ------', songReady.value)
      const list = playlist.value
      if (!songReady.value || !list.length) return
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        // 如果当前坐标为播放列表的最后一首则切换至第一首歌
        if (index === list.length) {
          index = 0
        }
        store.commit('setCurrentIndex', index)
        // 如果当前播放状态为暂停时则自动播放
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }
    // 歌曲循环播放
    function loop() {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
    }
    function ready() {
      // 已经准备好了则不执行
      if (songReady.value) return
      songReady.value = true
    }
    function error() {
      songReady.value = true
    }

    return {
      audioRef,
      fullScreen,
      currentSong,
      goBack,
      playIcon,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      disableCls,
      error
    }
  }
}
</script>
<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .top {
    position: relative;
    margin-bottom: 25px;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
    }
    .icon-back {
      display: block;
      padding: 9px;
      font-size: $font-size-large-x;
      color: $color-theme;
      transform: rotate(-90deg);
    }
    .title {
      width: 70%;
      margin: 0 auto;
      line-height: 40px;
      text-align: center;
      @include no-wrap();
      font-size: $font-size-large;
      color: $color-text;
    }
    .subtitle {
      line-height: 20px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;
    .operators {
      display: flex;
      align-items: center;
      .icon {
        flex: 1;
        color: $color-theme;
        i {
          font-size: 30px;
        }
      }
      .i-left {
        text-align: right;
      }
      .i-center {
        padding: 0 20px;
        text-align: center;
        i {
          font-size: 40px;
        }
      }
      .i-right {
        text-align: left
      }
    }
  }
}
</style>
