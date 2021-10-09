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
