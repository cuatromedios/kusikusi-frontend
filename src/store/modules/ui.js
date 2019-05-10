import Vue from 'vue'
import { LocalStorage } from 'quasar'
import Api from '../../tools/Api'

// initial state
const state = {
  config: {},
  lang: 'en',
  currentTitle: '',
  loading: false
}

// getters
const getters = {
}

// actions
const actions = {
  async getServerConfig ({ commit }, payload) {
    let configResult = await Api.get('/config/cms')
    commit('ui/setCms', configResult.result)
  }
}

// mutations
const mutations = {
  setCms (state, newConfig) {
    state.config = newConfig
  },
  setTitle (state, newTitle) {
    state.currentTitle = newTitle
  },
  setLang (state, newLang) {
    LocalStorage.set('lang', newLang)
    state.lang = newLang
    Vue.i18n.set('en')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
