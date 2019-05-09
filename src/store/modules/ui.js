import Vue from 'vue'
import { LocalStorage } from 'quasar'

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

// let configResult = await this.$api.get('/config/cms')
// this.$store.commit('ui/setCms', configResult.result)

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
