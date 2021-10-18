// 计算属性 根据歌曲列表 和 当前索引得出当前播放歌曲是什么
export const currentSong = (state) => {
  console.log('state ==>', state.currentIndex)
  console.log('state.playlist ==>', state.playList)
  return state.playList[state.currentIndex] || {}
}
