import { PLAY_MODE } from '@/assets/js/constant.js'
import { shuffle } from '@/assets/js/util.js'
// 顺序播放
export function selectPlay({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
}

// 随机播放
export function randomPlay({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', shuffle(list)) // 通过洗牌函数打乱歌曲播放顺序
  commit('setCurrentIndex', 0)
}

// 修改播放器状态
export function changeMode({ commit, state, getters }, mode) {
  // 获取当前播放歌曲的id
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    // 随机播放
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    // 顺序播放
    commit('setPlayList', state.sequenceList)
  }
  const index = state.playList.findIndex((song) => {
    return song.id === currentId
  })
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}
// 移除歌曲列表中的歌曲
export function removeSong({ commit, state }, song) {
  // vuex不能直接修改数据通过slice的返回值复制
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playList, song)
  // 对于用户快速点击删除按钮时的保护操作
  if (sequenceIndex < 0 || playIndex < 0) return

  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)

  // 处理当前歌曲坐标
  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
  if (!playList.length) {
    commit('setPlayingState', false)
  }
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
// 清空歌曲列表
export function clearSongList({ commit }) {
  commit('setSequenceList', [])
  commit('setPlayList', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}
