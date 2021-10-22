<template>
  <teleport to='body'>
    <!-- teleport:要求组件挂载到指定位置 -->
    <transition name="list-fade">
      <div
        class="playlist"
        v-show="visible && playlist.length"
        @click="hide">
        <div class="list-wrapper">
          <div class="list-header">
            <h1 class="title">
              <i
                class="icon"
                :class="modeIcon"
                @click.stop="changeMode"></i>
              <span class="text">{{modeText}}</span>
            </h1>
          </div>
          <scroll class="list-content" ref="scrollRef">
            <ul>
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id">
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{song.name}}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
              </li>
            </ul>
          </scroll>
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script>
import scroll from '@/components/base/scroll/scroll.vue'
import { ref, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'

export default {
  name: 'playList',
  components: {
    scroll
  },
  setup() {
    const visible = ref(false)
    const scrollRef = ref(null)

    const store = useStore()
    const playlist = computed(() => store.state.playList)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    const { modeIcon, changeMode, modeText } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    async function show() {
      visible.value = true
      await nextTick()
      refreshScroll()
    }
    function hide() {
      visible.value = false
    }
    function getCurrentIcon(song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    return {
      visible,
      playlist,
      sequenceList,
      show,
      hide,
      getCurrentIcon,
      scrollRef,
      // use-mode
      modeIcon,
      changeMode,
      modeText,
      // use-favorite
      getFavoriteIcon,
      toggleFavorite
    }
  }
}
</script>
<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
