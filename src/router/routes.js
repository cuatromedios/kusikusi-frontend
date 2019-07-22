let routes = [
  {
    path: '/',
    component: () => import('layouts/ExternalLayout'),
    children: [
      {
        path: '/',
        component: () => import('pages/Home'),
        name: 'home'
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
        path: '/content/:entity_id/:model/in/:parent_id',
        component: () => import('pages/ContentEdit'),
        name: 'contentNew'
      },
      {
        path: '/content/edit/:entity_id',
        component: () => import('pages/ContentEdit'),
        name: 'contentEdit'
      },
      {
        path: '/content/:entity_id?',
        component: () => import('pages/ContentDisplay'),
        name: 'contentDisplay'
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
