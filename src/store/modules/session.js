import { LocalStorage } from 'quasar'
import Api from '../../tools/Api'

// initial state
const state = {
  user: {},
  authtoken: ''
}

// getters
const getters = {
}

// actions
const actions = {
  resetUserData ({ commit }) {
    commit('setAuthtoken', '')
    commit('setUser', {})
  },
  async login ({ commit }, payload) {
    let loginResult = await Api.post('/user/login', payload)
    if (loginResult.success) {
      commit('setAuthtoken', loginResult.result.token)
      commit('setUser', loginResult.result.user)
    }
    return loginResult
  }
}

// mutations
const mutations = {
  setAuthtoken (state, newToken) {
    Api.setHeader('Authorization', 'Bearer ' + newToken)
    LocalStorage.set('authtoken', newToken)
    state.authtoken = newToken
    state.logged = newToken === ''
  },
  setUser (state, newUser) {
    LocalStorage.set('user', newUser)
    state.user = newUser
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
