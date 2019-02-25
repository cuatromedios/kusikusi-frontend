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
      },
      {
        path: '/content/:entity_id?',
        component: () => import('pages/Content'),
        name: 'content'
      },
      {
        path: '/media',
        component: () => import('pages/Media'),
        name: 'media'
      },
      {
        path: '/users/:entity_id?',
        component: () => import('pages/Users'),
        name: 'users'
      },
      {
        path: '/settings',
        component: () => import('pages/Settings'),
        name: 'settings'
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/Error404')
  }
]
export default routes
