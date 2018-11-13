export default
{
  version: '0.1.0',
  langs: ['es'],
  api: {
    url: (process.env.NODE_ENV === 'development' ? 'http://nomenclatura-quimica-organica.com' : '') + '/api'
  },
  media: {
    url: (process.env.NODE_ENV === 'development' ? 'http://nomenclatura-quimica-organica.com' : '') + '/media'
  },
  server: {
    url: (process.env.NODE_ENV === 'development' ? 'http://nomenclatura-quimica-organica.com' : '')
  }
}
