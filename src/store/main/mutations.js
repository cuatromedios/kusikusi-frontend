import Vue from 'vue'
import { LocalStorage } from 'quasar'

export const setConfig = (state, newConfig) => {
  LocalStorage.set('config', newConfig)
  state.config = newConfig
}
export const setTitle = (state, newTitle) => {
  state.currentTitle = newTitle
}
export const setLang = (state, newLang) => {
  LocalStorage.set('lang', newLang)
  state.lang = newLang
  Vue.i18n.set('es')
}
