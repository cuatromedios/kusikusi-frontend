import Vue from 'vue'
import Vuex from 'vuex'
import Router from '../router'
import { LocalStorage } from 'quasar'

import main from './main'
import session from './session'

Vue.use(Vuex)

const Store = new Vuex.Store({
  modules: {
    main, session
  }
})

/* Search for stored user data in the browser */
let user = LocalStorage.getItem('user')
let authtoken = LocalStorage.getItem('authtoken')
if (authtoken && authtoken !== '') {
  Store.commit('session/setAuthtoken', authtoken)
  Store.commit('session/setUser', user)
} else {
  Store.dispatch('session/resetUserData')
  Vue.nextTick(() => {
    Router.push({ name: Router.names.login })
  })
}

export default Store
