export default
{
  version: '0.1.0',
  langs: ['es'],
  api: {
    url: (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8001' : '') + '/api'
  },
  media: {
    url: (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8001' : '') + '/media'
  },
  server: {
    url: (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8001' : '')
  }
}
