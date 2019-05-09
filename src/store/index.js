import Vue from 'vue'
import Vuex from 'vuex'
import Router from '../router'
import { LocalStorage } from 'quasar'

import cms from './cms'
import session from './session'
import entity from './entity'

Vue.use(Vuex)

const Store = new Vuex.Store({
  modules: {
    cms, session, entity
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

Store.commit('cms/setTitle', '')

export default Store
