<template>
  <div>
    <Header />
    <Tab />
    <router-view :style="viewStyle" v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <router-view
      :style="viewStyle"
      name="user"
      v-slot="{ Component }">
      <transition appear name="slide">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
    <Player />
  </div>
</template>
<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab.vue'
import Player from '@/components/player/player.vue'
import { mapState } from 'vuex'
export default {
  components: {
    Header,
    Tab,
    Player
  },
  computed: {
    viewStyle() {
      const bottom = this.playList.length ? '60px' : '0'
      return {
        bottom
      }
    },
    ...mapState([
      'playList'
    ])
  }
}
</script>
