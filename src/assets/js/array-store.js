import storage from 'good-storage'

// 判断歌曲是否已经存在
function inertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) return
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  // 设置最多保存多少歌曲的数量
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFormArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 保存歌曲至storage中
export function save(item, key, compare, maxLen) {
  // 获取本地存储的歌曲数据
  const items = storage.get(key, [])
  inertArray(items, item, compare)
  storage.set(key, items)
  return items
}

// 从storage移除歌曲
export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteFormArray(items, compare)
  storage.set(key, items)
  return items
}

// 加载数据，否则每次刷新页面不读取本地数据则不会获得已收藏的数据
export function load(key) {
  return storage.get(key, [])
}

// 清空本地存储数据
export function clear(key) {
  storage.remove(key)
  return []
}

export function saveAll(items, key) {
  storage.set(key, items)
}
