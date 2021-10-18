// 计算属性 根据歌曲列表 和 当前索引得出当前播放歌曲是什么
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
