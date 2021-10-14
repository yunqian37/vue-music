<template>
  <div class="singer-detail">
    <MusicList
      :songs="songs"
      :pic="pic"
      :title="title"
      :loading="loading" />
  </div>
</template>
<script>
import { getSingerDetail } from '@/service/siniger'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/music-list.vue'
export default {
  name: 'singer-detail',
  props: {
    singer: Object
  },
  components: {
    MusicList
  },
  data() {
    return {
      songs: [],
      loading: true // music-list组件所需的loading参数
    }
  },
  computed: {
    pic() {
      return this.singer && this.singer.pic
    },
    title() {
      return this.singer && this.singer.name
    }
  },
  async created() {
    const result = await getSingerDetail(this.singer)
    console.log('result', result)
    const songs = await processSongs(result.songs)
    this.songs = songs
    console.log('songs', songs)
    this.loading = false
  }
}
</script>
<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
