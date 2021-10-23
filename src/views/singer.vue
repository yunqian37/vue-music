<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList
      @select="selectSinger"
      :data="singers" />
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>
<script>
import { getSingerList } from '@/service/siniger'
import IndexList from '@/components/base/index-list/index-list.vue'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
export default {
  name: 'singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
  },
  methods: {
    selectSinger(item) {
      this.selectedSinger = item
      this.cacheSinger(item)
      this.$router.push({
        path: `/singer/${item.mid}`
      })
    },
    // session缓存singer数据
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  }
}
</script>
<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
