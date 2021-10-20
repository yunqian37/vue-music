<template>
  <div class="player" v-show="playlist.length">
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
      <!-- 中间 -->
      <div
        class="middle"
        @touchstart.prevent="onMiddleTouchStart"
        @touchmove.prevent="onMiddleTouchMove"
        @touchend.prevent="onMiddleTouchEnd">
        <div class="middle-l" :style="middleLStyle">
          <div
            class="cd-wrapper"
            ref="cdWrapperRef">
            <div
              ref="cdRef"
              class="cd">
              <img
                ref="cdImageRef"
                class="image"
                :class="cdCls"
                :src="currentSong.pic" />
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLyric}}</div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
          <div class="lyric-wrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p
                class="text"
                :class="{'current': currentLineNum === index}"
                v-for="(line, index) in currentLyric.lines"
                :key="line.num">
                {{line.txt}}
              </p>
            </div>
            <div class="pure-music" v-show="pureMusicLyric">
              <p>{{pureMusicLyric}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span
            class="dot"
            :class="{'active':currentShow === 'cd'}"></span>
          <span
            class="dot"
            :class="{'active':currentShow === 'lyric'}"></span>
        </div>
        <!-- 进度条 -->
        <div class="progress-wrapper">
          <span class="time time-l">{{formatTime(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progressBar
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-change="onProgressChanged" />
          </div>
          <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
        </div>
        <!-- 歌曲切换按钮 -->
        <div class="operators">
          <div class="icon i-left">
            <i @click="changeMode" :class="modeIcon" />
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
            <i
              :class="getFavoriteIcon(currentSong)"
              @click="toggleFavorite(currentSong)" />
          </div>
        </div>
      </div>
    </div>
    <MiniPlayer />
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end" />
  </div>
</template>
<script>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import progressBar from './progress-bar.vue'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'
import useCd from './use-cd'
import useLyric from './use-lyric'
import Scroll from '@/components/base/scroll/scroll.vue'
import useMiddleInteractive from './use-middle-interactive'
import MiniPlayer from './mini-player.vue'
export default {
  name: 'player',
  components: {
    progressBar,
    Scroll,
    MiniPlayer
  },
  setup() {
    const audioRef = ref(null)
    const currentTime = ref(0)
    // 当前进度条是否被拖动
    let progressChanging = false
    // 歌曲播放模式
    const playMode = computed(() => store.state.playMode)
    // 初始配置 歌曲是否准备完毕
    const songReady = ref(false)

    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdCls, cdRef, cdImageRef } = useCd()
    const { currentLyric, currentLineNum, playLyric, lyricScrollRef, lyricListRef, stopLyric, pureMusicLyric, playingLyric } = useLyric({ songReady, currentTime })
    const { currentShow, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } = useMiddleInteractive()

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
    // 计算进度条
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration
    })

    // 监听当前播放歌曲是否改变
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      currentTime.value = 0
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })
    // 监听当前的播放状态 操作歌曲的暂停 & 播放
    watch(playing, (newPlaying) => {
      if (!songReady.value) return
      const audioEl = audioRef.value
      // 根据播放状态处理歌词滚动效果和歌曲播放
      if (newPlaying) {
        audioEl.play()
        stopLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
    })

    // 返回，更改播放器状态
    function goBack() {
      store.commit('setFullScreen', false)
    }
    // 切换播放状态
    function togglePlay() {
      if (!songReady.value) return
      store.commit('setPlayingState', !playing.value)
    }
    // 不是用户操作点击的状态下暂停事件处理，比如电脑进入睡眠。。。
    function pause() {
      store.commit('setPlayingState', false)
    }
    // 切换上一首歌
    function prev() {
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
      store.commit('setPlayingState', true)
    }
    function ready() {
      // 已经准备好了则不执行
      if (songReady.value) return
      songReady.value = true
      playLyric()
    }
    function error() {
      songReady.value = true
    }
    // 当前播放时间
    function updateTime(e) {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }
    function onProgressChanging(progress) {
      progressChanging = true
      // 实时修改当前时间
      currentTime.value = currentSong.value.duration * progress
      // 拖动滚动条时歌词也进行拖动
      playLyric()
      // 歌词停止滚动
      stopLyric()
    }
    function onProgressChanged(progress) {
      // 松开拖动时修改播放时间
      audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
      // 如果歌曲状态是暂停状态 拖动完毕播放
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      // 滚动条拖到结束 歌词开始滚动
      playLyric()
    }
    // 当前歌曲播放结束操作
    function end() {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }

    return {
      playlist,
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
      error,
      // use-mode
      modeIcon,
      changeMode,
      // use-favorite
      getFavoriteIcon,
      toggleFavorite,
      // 进度条相关
      progress,
      currentTime,
      updateTime,
      formatTime,
      onProgressChanging,
      onProgressChanged,
      end,
      // cd旋转相关
      cdCls,
      cdRef,
      cdImageRef,
      // 歌词相关
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric,
      // use-middle-interactive
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
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
  .middle {
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 170px;
    white-space: nowrap;
    font-size: 0;
    .middle-l {
      display: inline-block;
      vertical-align: top;
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 80%;
      .cd-wrapper {
        position: absolute;
        left: 10%;
        top: 0;
        width: 80%;
        box-sizing: border-box;
        height: 100%;
        .cd {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border-radius: 50%;
            border: 10px solid rgba(255, 255, 255, 0.1);
          }
          .playing {
            animation: rotate 20s linear infinite
          }
        }
      }
      .playing-lyric-wrapper {
        width: 80%;
        margin: 30px auto 0 auto;
        overflow: hidden;
        text-align: center;
        .playing-lyric {
          height: 20px;
          line-height: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
    }
    .middle-r {
      display: inline-block;
      vertical-align: top;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .lyric-wrapper {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;
        .text {
          line-height: 32px;
          color: $color-text-l;
          font-size: $font-size-medium;
          &.current {
            color: $color-text;
          }
        }
        .pure-music {
          padding-top: 50%;
          line-height: 32px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
  }
  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;
    .dot-wrapper {
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
        vertical-align: middle;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $color-text-l;
        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-text-ll;
        }
      }
    }
    .progress-wrapper {
      display: flex;
      align-items: center;
      width: 80%;
      margin: 0px auto;
      padding: 10px 0;
      .time {
        color: $color-text;
        font-size: $font-size-small;
        flex: 0 0 40px;
        line-height: 30px;
        width: 40px;
        &.time-l {
          text-align: left;
        }
        &.time-r {
          text-align: right;
        }
      }
      .progress-bar-wrapper {
        flex: 1;
      }
    }
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
