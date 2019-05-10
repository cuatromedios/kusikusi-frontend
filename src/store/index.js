import Vue from 'vue'
import Vuex from 'vuex'

import ui from './modules/ui'
import session from './modules/session'
import entity from './modules/entity'

Vue.use(Vuex)

const Store = new Vuex.Store({
  modules: {
    ui, session, entity
  }
})

Store.dispatch('session/getLocalSession')

export default Store
