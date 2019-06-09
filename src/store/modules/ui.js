import Vue from 'vue'
import { LocalStorage } from 'quasar'
import Api from '../../tools/Api'

// initial state
const state = {
  config: {},
  lang: 'en',
  editorLang: null,
  currentTitle: '',
  loading: false
}

// getters
const getters = {
  langs: (state) => {
    return state.config.langs
  },
  defaultLang: (state) => {
    return state.config.langs[0]
  }
}

// actions
const actions = {
  async getCmsConfig ({ commit }, payload) {
    let configResult = await Api.get('/config/cms')
    commit('setCms', configResult.result)
    let editorLang = LocalStorage.getItem('editorLang')
    if (!editorLang || editorLang === '') {
      editorLang = configResult.result.langs[0] || 'en'
    }
    commit('setEditorLang', editorLang)
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
    Vue.i18n.set(newLang)
  },
  setEditorLang (state, newLang) {
    LocalStorage.set('editorLang', newLang)
    state.editorLang = newLang
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
