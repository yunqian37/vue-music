import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY } from '@/assets/js/constant.js'
import { load } from '@/assets/js/array-store'
const state = {
  sequenceList: [], // 播放列表
  playList: [], // 真实的播放列表
  playing: false, // 播放状态
  playMode: PLAY_MODE.sequence, // 播放模式 默认顺序播放
  currentIndex: 0, // 当前播放索引
  fullScreen: false, // 播放器状态 全屏还是收缩
  favoriteList: load(FAVORITE_KEY), // 收藏歌曲列表
  searchHistory: load(SEARCH_KEY) // 搜索历史
}

export default state
