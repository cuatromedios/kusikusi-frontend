import axios from 'axios'
import { default as router, routes } from './router'

let baseUrl = ''
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.patch['Content-Type'] = 'application/json'
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  // Taken from: https://github.com/mzabriskie/axios
  if (error.response) {
    if (error.response.status === 401) {
      router.push({ name: routes.login.name })
    }
    console.log('auth error: ' + error.response.status)
  } else if (error.request) {
    console.log(error.request)
  } else {
    console.log('Error', error.message)
  }
  return Promise.reject(error)
})

class Connection {
  static setBaseUrl (url) {
    baseUrl = url
  }
  static setHeader (header, value) {
    axios.defaults.headers.common[header] = value
  }
  static deleteHeader (header) {
    delete axios.defaults.headers.common[header]
  }
  static async get (path) {
    let result = await axios.get(baseUrl + path)
    return result.data
  }
  static async post (path, body) {
    let jsonBody = JSON.stringify(body)
    let result = await axios.post(baseUrl + path, jsonBody)
    return result.data
  }
}

export default Connection
