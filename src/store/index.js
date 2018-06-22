import Vue from 'vue'
import Vuex from 'vuex'
import localstorage from 'store' // local storage in the browser
import vuexI18n from 'vuex-i18n' // Localization
import router from '../router'
import { routes } from '../router/routes'
import config from '../config'
import Connection from '../Connection'
import spanishTexts from '../locale/es.json'

Connection.setBaseUrl(config.api.url)

import main from './main'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    main
  }
})

Vue.use(vuexI18n.plugin, store)
Vue.i18n.add('es', spanishTexts)
Vue.i18n.set('es')

/* Search for stored user data in the browser */
let authtoken = localstorage.get('authtoken')
let name = localstorage.get('name')
let storeName = localstorage.get('storeName')
let profile = localstorage.get('profile')
let userId = localstorage.get('userId')
let Config = localstorage.get('config')
if (authtoken && authtoken !== '') {
  store.commit('main/setAuthtoken', authtoken)
  store.commit('main/setName', name)
  store.commit('main/setStoreName', storeName)
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
