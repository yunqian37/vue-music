import { createRouter, createWebHashHistory } from 'vue-router'
// import Recommend from '@/views/recommend.vue'
const Recommend = () => import('@/views/recommend.vue'/* webpackChunkName: "recommend" */)
// import Search from '@/views/search.vue'
const Search = () => import('@/views/search.vue'/* webpackChunkName: "search" */)
// import Singer from '@/views/singer.vue'
const Singer = () => import('@/views/singer.vue'/* webpackChunkName: "singer" */)
// import SingerDetail from '@/views/singer-detail.vue'
const SingerDetail = () => import('@/views/singer-detail.vue'/* webpackChunkName: "singer-detail" */)
// import TopList from '@/views/top-list.vue'
const TopList = () => import('@/views/top-list.vue'/* webpackChunkName: "top-list" */)
// import Album from '@/views/album.vue'
const Album = () => import('@/views/album.vue'/* webpackChunkName: "album" */)
// import TopDetail from '@/views/top-detail.vue'
const TopDetail = () => import('@/views/top-detail.vue'/* webpackChunkName: "top-detail" */)
// import UserCenter from '@/views/user-center.vue'
const UserCenter = () => import('@/views/user-center.vue'/* webpackChunkName: "user-center" */)
const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  },
  {
    path: '/user',
    components: {
      user: UserCenter
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
