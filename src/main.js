// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import config from './config'
import router from './router'
import Vuex from 'vuex' // general storage (states container)
import vuexStore from './vuexStore' // store definition for Vuex
import localstorage from 'store' // local storage in the browser
import vuexI18n from 'vuex-i18n' // Localization
import ElementUI from 'element-ui'
import elementLocale from 'element-ui/lib/locale/lang/en'
import './styles/main.scss'
import Connection from './Connection'

// TODO: Language files should be lazy loaded
import englishTexts from './locale/en.json'
import spanishTexts from './locale/es.json'

Vue.config.productionTip = false
Vue.use(ElementUI, { elementLocale })
Vue.use(ElementUI)
Vue.use(Vuex)

const store = new Vuex.Store(vuexStore)

/* Search for stored user data in the browser */
let authtoken = localstorage.get('authtoken')
let name = localstorage.get('name')
let profile = localstorage.get('profile')
if (authtoken && authtoken !== '') {
  store.commit('setAuthtoken', authtoken)
  store.commit('setName', name)
  store.commit('setProfile', profile)
  router.push({ name: config.routes.dashboard })
} else {
  store.dispatch('resetUserData')
  router.push({ name: config.routes.login })
}

/* Initialize localozation support and search for prefered language in the browser */
Vue.use(vuexI18n.plugin, store)

Vue.i18n.add('en', englishTexts)
Vue.i18n.add('en', spanishTexts)
let lang = localstorage.get('lang')
if (lang && lang !== '') {
  // Ok, we have a lang stored
} else {
  let browserLang = (navigator.language || navigator.userLanguage).split('-')[0]
  if (config.langs.indexOf(browserLang) !== -1) {
    lang = browserLang
  } else {
    lang = config.langs[0]
  }
}
store.commit('setLang', lang)

Connection.setBaseUrl(config.api.url)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
