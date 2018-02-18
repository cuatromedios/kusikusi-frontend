import Vue from 'vue'
import Connection from '@/Connection'
import store from 'store' // Browser storage

export default {
  debug: true,
  state: {
    logged: false,
    user: {
      authtoken: '',
      name: '',
      profile: '',
      relations: []
    },
    lang: 'en'
  },
  mutations: {
    setAuthtoken (state, newToken) {
      Connection.setHeader('Authorization', 'Bearer ' + newToken)
      store.set('authtoken', newToken) // local data in the browser
      state.user.authtoken = newToken
      if (newToken === '') {
        state.logged = false
      } else {
        state.logged = true
      }
    },
    setName (state, newName) {
      store.set('name', newName) // local data in the browser
      state.user.name = newName
    },
    setProfile (state, newProfile) {
      store.set('profile', newProfile) // local data in the browser
      state.user.profile = newProfile
    },
    setUserId (state, newId) {
      store.set('userId', newId) // local data in the browser
      state.user.id = newId
    },
    setRelations (state, newRelations) {
      state.user.relations = newRelations
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
      commit('setRelations', [])
    }
  }
}
