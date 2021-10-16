import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy' // 懒加载
import loadingDirective from '@/components/base/loading/directive' // 全局引入自定义指令
import noResultDirective from '@/components/base/no-result/directive'
// 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App).use(store).use(router).use(lazyPlugin, {
  // 配置懒加载loading图片
  loading: require('@/assets/images/default.png')
}).directive('loading', loadingDirective).directive('no-result', noResultDirective).mount('#app')
