import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Content from '@/components/Content'
import Sample from '@/components/Sample'
import Media from '@/components/Media'
import Users from '@/components/Users'
import Logout from '@/components/Logout'

Vue.use(Router)

let routes = {
  home: {
    path: '/',
    component: Home
  },
  login: {
    path: '/login',
    component: Login
  },
  dashboard: {
    path: '/dashboard',
    component: Dashboard
  },
  content: {
    path: '/content/:id?',
    component: Content
  },
  sample: {
    path: '/entity/:id?',
    component: Sample
  },
  media: {
    path: '/media',
    component: Media
  },
  users: {
    path: '/users',
    component: Users
  },
  logout: {
    path: '/logout',
    component: Logout
  }
}

let routesArray = []
for (let id in routes) {
  routes[id].name = id
  routesArray.push({
    path: routes[id].path,
    component: routes[id].component,
    name: id
  })
}

export default new Router({
  mode: 'history',
  routes: routesArray
})

export { routes }
