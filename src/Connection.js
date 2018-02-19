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
    let result = await Connection.call('get', path)
    return result
  }
  static async post (path, body) {
    let result = await Connection.call('post', path, body)
    return result
  }
  static async patch (path, body) {
    let result = await Connection.call('patch', path, body)
    return result
  }
  static async delete (path, body) {
    let result = await Connection.call('delete', path)
    return result
  }
  static async call (method, path, body) {
    if (['get', 'post', 'patch', 'delete'].indexOf(method.toLowerCase()) < 0) {
      return {success: false, data: null, info: 'No method or method not allowed'}
    }
    let jsonBody = body ? JSON.stringify(body) : null
    let result
    try {
      result = await axios[method](baseUrl + path, jsonBody)
    } catch (error) {
      return {success: false, data: null, info: 'An error ocurried in the external call'}
    }
    return result.data
  }
}

export default Connection
