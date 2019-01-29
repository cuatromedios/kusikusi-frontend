import Vue from 'vue'
import store from 'store' // Browser storage

export const setConfig = (state, newConfig) => {
  store.set('config', newConfig)
  state.config = newConfig
}
export const setTitle = (state, newTitle) => {
  state.currentTitle = newTitle
}
export const setLang = (state, newLang) => {
  store.set('lang', newLang) // local data in the browser
  state.lang = newLang
  Vue.i18n.set('es')
}
