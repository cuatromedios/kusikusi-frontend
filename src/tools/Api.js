import axios from 'axios'
import Router from '../router'

let baseUrl = ''
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.patch['Content-Type'] = 'application/json'
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  // Taken from: https://github.com/mzabriskie/axios
  if (error.response) {
    if (error.response.status === 401) {
      Router.push({ name: 'login' })
    }
    console.log('auth error: ' + error.response.status)
  } else if (error.request) {
    console.log(error.request)
  } else {
    console.log('Error', error.message)
  }
  return Promise.reject(error)
})

class Api {
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
    let result = await Api.call('get', path)
    return result
  }
  static async post (path, body, type) {
    let result = await Api.call('post', path, body, type)
    return result
  }
  static async patch (path, body, type) {
    let result = await Api.call('patch', path, body, type)
    return result
  }
  static async delete (path) {
    // DELETE method doesn't support body
    let result = await Api.call('delete', path)
    return result
  }
  static async call (method, path, body, type) {
    if (['get', 'post', 'patch', 'delete'].indexOf(method.toLowerCase()) < 0) {
      return { success: false, data: null, info: 'No method or method not allowed' }
    }
    let data
    if (type) {
      data = new FormData()
      data.append(type.name, body, { type: type.headerType })
    } else {
      let jsonBody = body ? JSON.stringify(body) : null
      data = jsonBody
    }
    let result
    try {
      result = await axios[method](baseUrl + '/api' + path, data)
    } catch (error) {
      return { success: false, data: null, info: 'An error occurred in the external call' }
    }
    return result.data
  }
}

export default Api
