import { PLAY_MODE } from '@/assets/js/constant.js'

const state = {
  sequenceList: [], // 播放列表
  playList: [], // 真实的播放列表
  playing: false, // 播放状态
  playMode: PLAY_MODE.sequence, // 播放模式 默认顺序播放
  currentIndex: 0, // 当前播放索引
  fullScreen: false // 播放器状态 全屏还是收缩
}

export default state
