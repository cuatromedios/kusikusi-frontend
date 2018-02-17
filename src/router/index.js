import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import config from '@/config'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: config.routes.home,
      component: Home
    },
    {
      path: '/login',
      name: config.routes.login,
      component: Login
    }
  ]
})
