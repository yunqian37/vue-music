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
