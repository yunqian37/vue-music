// 对原始数据做修改

const mutations = {
  // 设置播放状态 playing：修改的参数
  setPlayingState(state, playing) {
    state.playing = playing
  },
  // 设置顺序播放列表
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  // 设置播放列表
  setPlayList(state, list) {
    state.playList = list
  },
  // 设置播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  // 设置当前播放索引
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  // 设置播放器状态
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  },
  // 设置歌曲收藏列表
  setFavoriteList(state, list) {
    state.favoriteList = list
  }
}

export default mutations
