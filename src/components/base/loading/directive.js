// 代码结构大概 查看首次提交的相关记录 版本号13d3783(2021-10-16)之前都有
import Loading from './loading.vue'
import createLoadingLikeDirective from '@/assets/js/create-loading-like-directive.js'

const loadingDirective = createLoadingLikeDirective(Loading)

export default loadingDirective
