let loggedBasePath = '/home'
let notLoggedRoutes = {
  home: {
    path: '/',
    component: () => import('pages/index')
  },
  login: {
    path: '/login',
    component: () => import('pages/login')
  }
}
let loggedRoutes = {
  home: {
    path: '/home',
    component: () => import('pages/home')
  },
  dashboard: {
    path: '/dashboard',
    component: () => import('pages/dashboard')
  },
  content: {
    path: '/content',
    component: () => import('pages/content')
  },
  media: {
    path: '/media',
    component: () => import('pages/media')
  },
  users: {
    path: '/users',
    component: () => import('pages/users')
  },
  config: {
    path: '/config',
    component: () => import('pages/config')
  }
}
let routes = {}
Object.assign(routes, notLoggedRoutes, loggedRoutes)

let notLoggedRoutesArray = []
for (let id in notLoggedRoutes) {
  routes[id].name = id
  notLoggedRoutesArray.push({
    path: notLoggedRoutes[id].path,
    component: notLoggedRoutes[id].component,
    name: id
  })
}

let loggedRoutesArray = []
for (let id in loggedRoutes) {
  routes[id].name = id
  loggedRoutesArray.push({
    path: loggedRoutes[id].path,
    component: loggedRoutes[id].component,
    name: id
  })
}
let routesObject = [
  {
    path: '/',
    component: () => import('layouts/notlogged'),
    children: notLoggedRoutesArray
  },
  {
    path: loggedBasePath + '/',
    component: () => import('layouts/logged'),
    children: loggedRoutesArray
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
export default routesObject
export { routes }
