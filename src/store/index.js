import { createStore, createLogger } from 'vuex'
import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'
// createLogger: 获取提交状态 在开发环境下使用
const debug = process.env.NODE_ENV !== 'production'
export default createStore({
  state,
  getters,
  mutations,
  actions,
  strict: debug, // 严格模式 开发环境下开启
  plugins: debug ? [createLogger()] : []
})
