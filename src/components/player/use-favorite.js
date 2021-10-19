import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'
export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100
  // 动态设置收藏按钮图标的样式
  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }
  // 点击按钮动态切换歌曲的收藏状态
  function toggleFavorite(song) {
    let list
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', list)
    // 根据id判断是否为同一首歌曲
    function compare(item) {
      console.log('compare item', item)
      return item.id === song.id
    }
  }
  // 判断当前歌曲是否被收藏
  function isFavorite(song) {
    return favoriteList.value.findIndex((item) => {
      return item.id === song.id
    }) > -1
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
