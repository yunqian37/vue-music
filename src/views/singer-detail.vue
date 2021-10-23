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
import createDetailComponent from '@/assets/js/create-detail-component'
import { getSingerDetail } from '@/service/siniger'
// import { processSongs } from '@/service/song'
// import MusicList from '@/components/music-list/music-list.vue'
// import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
// export default {
//   name: 'singer-detail',
//   props: {
//     singer: Object
//   },
//   components: {
//     MusicList
//   },
//   data() {
//     return {
//       songs: [],
//       loading: true // music-list组件所需的loading参数
//     }
//   },
//   computed: {
//     computedSinger() {
//       let ret = null
//       const singer = this.singer
//       // 判断是否有歌手信息
//       if (singer) {
//         ret = singer
//       } else {
//         // 没有歌手信息的情况下从session缓存中获取
//         const cachedSinger = storage.session.get(SINGER_KEY)
//         if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
//           // 获取session缓存中的歌手信息 并将缓存中的歌手id与当前路由的id进行匹配
//           ret = cachedSinger
//         }
//       }
//       return ret
//     },
//     pic() {
//       const singer = this.computedSinger
//       return singer && singer.pic
//     },
//     title() {
//       const singer = this.computedSinger
//       return singer && singer.name
//     }
//   },
//   async created() {
//     if (!this.computedSinger) {
//       const path = this.$route.matched[0].path
//       this.$router.push({
//         path
//       })
//       return
//     }
//     const result = await getSingerDetail(this.computedSinger)
//     const songs = await processSongs(result.songs)
//     this.songs = songs
//     this.loading = false
//   }
// }
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
