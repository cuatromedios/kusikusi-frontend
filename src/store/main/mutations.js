import Vue from 'vue'
import Connection from '../../Connection'
import store from 'store' // Browser storage

export const setAuthtoken = (state, newToken) => {
  Connection.setHeader('Authorization', 'Bearer ' + newToken)
  store.set('authtoken', newToken) // local data in the browser
  state.user.authtoken = newToken
  if (newToken === '') {
    state.logged = false
  } else {
    state.logged = true
  }
}
export const setName = (state, newName) => {
  store.set('name', newName) // local data in the browser
  state.user.name = newName
}
export const setConfig = (state, newConfig) => {
  store.set('config', newConfig)
  state.config = newConfig
}
export const setProfile = (state, newProfile) => {
  store.set('profile', newProfile) // local data in the browser
  state.user.profile = newProfile
}
export const setUserId = (state, newId) => {
  store.set('userId', newId) // local data in the browser
  state.user.id = newId
}
export const setRelations = (state, newRelations) => {
  state.user.relations = newRelations
}
export const setTitle = (state, newTitle) => {
  state.currentTitle = newTitle
}
export const setCurrentProvider = (state, newValue) => {
  state.currentProvider = newValue
}
export const setCurrentCategory = (state, newValue) => {
  state.currentCategory = newValue
}
export const setLang = (state, newLang) => {
  store.set('lang', newLang) // local data in the browser
  state.lang = newLang
  Vue.i18n.set('es')
}
