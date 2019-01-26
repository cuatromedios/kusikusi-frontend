import Vue from 'vue'
import Vuex from 'vuex'
import localstorage from 'store' // local storage in the browser
import vuexI18n from 'vuex-i18n' // Localization
import router from '../router'
import { routes } from '../router/routes'
import Connection from '../Connection'

Connection.setBaseUrl(process.env.API_URL)

import main from './main'
import session from './session'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    main, session
  }
})

Vue.use(vuexI18n.plugin, store)

/* Search for stored user data in the browser */
let user = localstorage.get('user')
let authtoken = localstorage.get('authtoken')
if (authtoken && authtoken !== '') {
  store.commit('session/setAuthtoken', authtoken)
  store.commit('session/setUser', user)
} else {
  store.dispatch('session/resetUserData')
  Vue.nextTick(() => {
    router.push({name: routes.login.name})
  })
}

export default store
