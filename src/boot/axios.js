import axios from 'axios'
import Api from '../tools/Api'

export default async ({ Vue }) => {
  Vue.prototype.$axios = axios
  Api.setBaseUrl(process.env.API_URL)
  Vue.prototype.$api = Api
}
