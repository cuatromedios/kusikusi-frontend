import Vue from 'vue'
import router from '../../router'
// initial state
const state = {
  entity: { contents: [] },
  relations: [],
  children: [],
  ancestors: [],
  parent: {}
}

// getters
const getters = {
}

// actions
const actions = {
  clear ({ commit }) {
    commit('setEntity', { contents: {} })
    commit('setRelations', [])
    commit('setChildren', [])
    commit('setAncestors', [])
  },
  clearId ({ commit }) {
    commit('setEntityValue', { field: 'id', value: undefined })
  },
  newEntity ({ commit }, entity) {
    let newEntity = { id: 'new', contents: {} }
    let merged = { ...newEntity, ...entity }
    commit('setEntity', merged)
    commit('setRelations', [])
    commit('setChildren', [])
    commit('setAncestors', [])
    router.push({ name: 'content', params: { entity_id: merged.id } })
  }
}

// mutations
const mutations = {
  setEntity (state, newEntity) {
    state.entity = newEntity
  },
  addLanguage (state, newLang) {
    if (!state.entity.contents[newLang]) {
      Vue.set(state.entity.contents, newLang, {})
    }
  },
  setEntityValue (state, payload) {
    let fieldParts = payload.field.split('.')
    if (fieldParts.length === 1) {
      Vue.set(state.entity, fieldParts[0], payload.value)
    } else if (fieldParts[0] === 'contents') {
      if (!state.entity.contents[payload.lang]) state.entity.contents[payload.lang] = {}
      Vue.set(state.entity.contents[payload.lang], fieldParts[1], payload.value)
    } else {
      if (!state.entity[fieldParts[1]]) state.entity[fieldParts[1]] = {}
      Vue.set(state.entity[fieldParts[1]], payload.value)
    }
  },
  setRelations (state, newRelations) {
    state.relations = newRelations
  },
  setChildren (state, newChildren) {
    state.children = newChildren
  },
  setAncestors (state, newAncestors) {
    state.ancestors = newAncestors
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
