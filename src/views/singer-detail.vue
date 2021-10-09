<template>
  <div class="singer-detail"></div>
</template>
<script>
import { getSingerDetail } from '@/service/siniger'
import { processSongs } from '@/service/song'
export default {
  name: 'singer-detail',
  props: {
    singer: Object
  },
  async created() {
    const result = await getSingerDetail(this.singer)
    console.log('result', result)
    const songs = await processSongs(result.songs)
    console.log('songs', songs)
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
