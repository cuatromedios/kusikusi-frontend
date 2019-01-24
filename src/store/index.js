import Vue from 'vue'
import Vuex from 'vuex'
import localstorage from 'store' // local storage in the browser
import vuexI18n from 'vuex-i18n' // Localization
import router from '../router'
import { routes } from '../router/routes'
import Connection from '../Connection'

Connection.setBaseUrl(process.env.API_URL)

import main from './main'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    main
  }
})

Vue.use(vuexI18n.plugin, store)

/* Search for stored user data in the browser */
let authtoken = localstorage.get('authtoken')
let name = localstorage.get('name')
let profile = localstorage.get('profile')
let userId = localstorage.get('userId')
let Config = localstorage.get('config')
if (authtoken && authtoken !== '') {
  store.commit('main/setAuthtoken', authtoken)
  store.commit('main/setName', name)
  store.commit('main/setUserId', userId)
  store.commit('main/setProfile', profile)
  store.commit('main/setConfig', Config)
} else {
  store.dispatch('main/resetUserData')
  Vue.nextTick(() => {
    router.push({name: routes.login.name})
  })
}

export default store
