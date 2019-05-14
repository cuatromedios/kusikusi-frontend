// initial state
const state = {
  entity: { contents: [] },
  relations: [],
  children: [],
  ancestors: []
}

// getters
const getters = {
}

// actions
const actions = {
  clear ({ commit }) {
    commit('setEntity', { contents: [] })
    commit('setRelations', [])
    commit('setChildren', [])
    commit('setAncestors', [])
  }
}

// mutations
const mutations = {
  setEntity (state, newEntity) {
    state.entity = newEntity
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
