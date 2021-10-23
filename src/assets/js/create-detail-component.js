import MusicList from '@/components/music-list/music-list.vue'
import storage from 'good-storage'
import { processSongs } from '@/service/song'
export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    props: {
      data: Object
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
      computedData() {
        let ret = null
        const data = this.data
        // 判断是否有歌手信息
        if (data) {
          ret = data
        } else {
          // 没有歌手信息的情况下从session缓存中获取
          const cachedData = storage.session.get(key)
          if (cachedData && (cachedData.mid || cachedData.id + '') === this.$route.params.id) {
            // 获取session缓存中的歌手信息 并将缓存中的歌手id与当前路由的id进行匹配
            ret = cachedData
          }
        }
        return ret
      },
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    async created() {
      const data = this.computedData
      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.push({
          path
        })
        return
      }
      const result = await fetch(data)
      const songs = await processSongs(result.songs)
      this.songs = songs
      this.loading = false
    }
  }
}
