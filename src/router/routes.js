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
  dashboard: {
    path: '/home',
    component: () => import('pages/home')
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
