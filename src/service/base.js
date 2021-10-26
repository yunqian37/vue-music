import axios from 'axios'

const ERR_OK = 0

// 上线需要修改
const baseURL = '/'

axios.defaults.baseURL = baseURL

export function get(url, params) {
  return axios.get(url, {
    params
  }).then((res) => {
    const serverData = res.data
    if (serverData.code === ERR_OK) {
      return serverData.result
    }
  }).catch((err) => {
    console.log(err)
  })
}
