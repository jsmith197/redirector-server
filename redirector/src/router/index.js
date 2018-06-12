import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Mkprofile from '@/components/Mkprofile'
import User from '@/components/User'
import About from '@/components/About'
import Matched from '@/components/Matched'
import GameSearch from '@/components/GameSearch'
import GameOver from '@/components/GameOver'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/makeprofile',
      name: 'Mkprofile',
      component: Mkprofile,
    },
    {
      path: '/user/:name',
      name: 'User',
      component: User,
      props: true,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/game',
      name: 'GameSearch',
      component: GameSearch,
    },
    {
      path: '/game/match/:gameId',
      name: 'Matched',
      component: Matched,
    },
    {
      path: '/game/over/:gameId',
      name: 'GameOver',
      component: GameOver,
    }
  ]
})
