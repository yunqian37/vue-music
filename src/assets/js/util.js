// 洗牌函数
export function shuffle(source) {
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

// 获取 0 到 max的随机数
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

function swap(arr, i, j) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}

// 格式化时间
export function formatTime(interval) {
  // ｜ 可以进行取整运算 通过二进制转换
  interval = interval | 0
  // padStart:字符串头部不全 参数1:指定字符串的最小长度，参数2:用来补全的字符串   padEnd:尾部不全
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = (interval % 60 + '').padStart(2, '0')
  return `${minute}:${second}`
}
