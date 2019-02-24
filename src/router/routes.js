let routes = [
  {
    path: '/',
    component: () => import('layouts/ExternalLayout'),
    children: [
      {
        path: '/',
        component: () => import('pages/Login'),
        name: 'index'
      },
      {
        path: '/login',
        component: () => import('pages/Login'),
        name: 'login'
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/InternalLayout'),
    children: [
      {
        path: '/dashboard',
        component: () => import('pages/Dashboard'),
        name: 'dashboard'
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/Error404')
  }
]
export default routes
