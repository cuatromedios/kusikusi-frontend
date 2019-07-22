import { LocalStorage } from 'quasar'
import Api from '../../tools/Api'
import _ from 'lodash'

// initial state
const state = {
  user: {
    profile: ''
  },
  authtoken: ''
}

// getters
const getters = {
  hasAuthtoken (state) {
    return (state.authtoken !== '')
  },
  entitiesWithWritePermissions (state) {
    let entities = []
    for (let e = 0; e < _.get(state, 'user.permissions.length', 0); e++) {
      if (state.user.permissions[e].write !== 'none' && state.user.permissions[e].read !== 'none') {
        let entity = state.user.permissions[e].entity
        entity.write = state.user.permissions[e].write
        entity.read = state.user.permissions[e].read
        entities.push(entity)
      }
    }
    return entities
  },
  entitiesWithPermissions (state) {
    let entities = []
    for (let e = 0; e < _.get(state, 'user.permissions.length', 0); e++) {
      if (state.user.permissions[e].read !== 'none') {
        let entity = state.user.permissions[e].entity
        entity.write = state.user.permissions[e].write
        entity.read = state.user.permissions[e].read
        entities.push(entity)
      }
    }
    return entities
  }
}

// actions
const actions = {
  getLocalSession ({ dispatch, commit }) {
    let session = LocalStorage.getItem('session')
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
      loginResult.result.user.permissions = loginResult.result.user.permissions.sort(function (a, b) {
        let ua = a.entity.distance_to_home < 0 ? a.entity.distance_to_home * -1000 : a.entity.distance_to_home
        let ub = b.entity.distance_to_home < 0 ? b.entity.distance_to_home * -1000 : b.entity.distance_to_home
        let comparison = Math.sign(ua - ub)
        return comparison
      })
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
