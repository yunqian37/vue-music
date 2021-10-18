<template>
  <div>
    <Header />
    <Tab />
    <router-view/>
    <Player />
  </div>
</template>
<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab.vue'
import Player from '@/components/player/player.vue'
export default {
  components: {
    Header,
    Tab,
    Player
  }
}
</script>
