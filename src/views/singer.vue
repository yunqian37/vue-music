<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList
      @select="selectSinger"
      :data="singers" />
    <router-view :singer="selectedSinger" />
  </div>
</template>
<script>
import { getSingerList } from '@/service/siniger'
import IndexList from '@/components/base/index-list/index-list.vue'
export default {
  name: 'singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: [],
      selectedSinger: []
    }
  },
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
  },
  methods: {
    selectSinger(item) {
      this.selectedSinger = item
      this.$router.push({
        path: `/singer/${item.mid}`
      })
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
