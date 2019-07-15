import Vue from 'vue'
import { LocalStorage } from 'quasar'
import Api from '../../tools/Api'
import lodash from 'lodash'
import router from '../../router'

// initial state
const state = {
  config: {},
  lang: 'en',
  editorLang: null,
  currentTitle: '',
  loading: false,
  menuItems: {
    dashboard: {
      label: 'dashboard.title',
      icon: 'dashboard',
      name: router.names.dashboard
    },
    content: {
      label: 'content.title',
      icon: 'home',
      name: router.names.content
    },
    media: {
      label: 'media.title',
      icon: 'photo',
      name: router.names.media
    },
    users: {
      label: 'users.title',
      icon: 'supervised_user_circle',
      name: router.names.users
    },
    configuration: {
      label: 'settings.title',
      icon: 'settings_applications',
      name: router.names.settings
    },
    logout: {
      label: 'login.logout',
      icon: 'exit_to_app',
      name: router.names.login
    }
  }
}

// getters
const getters = {
  langs: (state) => {
    return state.config.langs
  },
  defaultLang: (state) => {
    if (state.config && state.config.langs) {
      return state.config.langs[0]
    } else {
      return ''
    }
  },
  menu: (state, getters, rootState, rootGetters) => {
    let menu = lodash.clone(lodash.get(state, `config.menu.${rootState.session.user.profile}`))
    if (!menu) {
      if (rootState.session.user.profile === 'admin') {
        menu = [state.menuItems.dashboard, state.menuItems.content, state.menuItems.media, state.menuItems.users, state.menuItems.configuration]
      } else {
        menu = [state.menuItems.dashboard, state.menuItems.content]
      }
    }
    menu.push(state.menuItems.logout)
    return menu
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
