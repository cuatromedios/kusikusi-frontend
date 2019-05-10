import { LocalStorage } from 'quasar'
import Api from '../../tools/Api'

// initial state
const state = {
  user: {},
  authtoken: ''
}

// getters
const getters = {
  hasAuthtoken (state) {
    return (state.authtoken !== '')
  }
}

// actions
const actions = {
  getLocalSession ({ dispatch, commit }) {
    let session = LocalStorage.getItem('session')
    console.log('getLocalSession', session)
    if (!session || session === {}) {
      dispatch('resetUserData')
    } else {
      commit('setAuthtoken', session.authtoken)
      commit('setUser', session.user)
    }
    return session
  },
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
    state.authtoken = newToken
    Api.setHeader('Authorization', 'Bearer ' + newToken)
    let session = LocalStorage.getItem('session') || {}
    session.authtoken = newToken
    LocalStorage.set('session', session)
  },
  setUser (state, newUser) {
    state.user = newUser
    let session = LocalStorage.getItem('session') || {}
    session.user = newUser
    LocalStorage.set('session', session)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
