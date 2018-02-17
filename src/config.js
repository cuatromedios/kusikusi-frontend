export default
{
  version: '0.1.0',
  langs: ['en', 'es'],
  api: {
    url: (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8088' : '') + '/api'
  },
  routes: {
    dashboard: 'dashboard',
    login: 'login'
  }
}
