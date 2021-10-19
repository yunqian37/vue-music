import { get } from './base'

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((res) => {
    const map = res.map
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      // 过滤不包含vkey的数据，不包含vkey的不能播放
      return song.url.indexOf('vkey') > 1
    })
  })
}

// 获取歌词
const lyricMap = {} // 从其他地方获取song内容有可能不一样，但是mid是固定的 对其优化
export function getLyric(song) {
  // 如果歌词已存在则直接返回
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(song.lyric)
  }

  return get('/api/getLyric', {
    mid
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    return lyric
  })
}
