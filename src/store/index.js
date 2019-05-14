import Vue from 'vue'
import Vuex from 'vuex'

import ui from './modules/ui'
import session from './modules/session'
import content from './modules/content'

Vue.use(Vuex)

const Store = new Vuex.Store({
  modules: {
    ui, session, content
  }
})

export default Store
