import Vue from 'vue'
import axios from 'axios'
import store from 'store' // Browser storage

export default {
  debug: true,
  state: {
    user: {
      authtoken: '',
      name: '',
      profile: ''
    },
    lang: 'en'
  },
  mutations: {
    setAuthtoken (state, newToken) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken
      store.set('authtoken', newToken) // local data in the browser
      state.user.authtoken = newToken
    },
    setName (state, newName) {
      store.set('name', newName) // local data in the browser
      state.user.name = newName
    },
    setProfile (state, newProfile) {
      store.set('profile', newProfile) // local data in the browser
      state.user.profile = newProfile
    },
    setLang (state, newLang) {
      store.set('lang', newLang) // local data in the browser
      state.lang = newLang
      Vue.i18n.set('en')
    }
  },
  actions: {
    resetUserData  ({commit}) {
      commit('setAuthtoken', '')
      commit('setName', '')
      commit('setProfile', '')
    }
  }
}
