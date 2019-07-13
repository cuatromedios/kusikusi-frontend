import Vue from 'vue'
import Api from '../../tools/Api'
import lodash from 'lodash'

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
  getRelationsByKind: (state) => (kind) => {
    return state.relations.filter(relation => relation.kind === kind)
  }
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
  },
  async getEntity ({ commit, dispatch }, entityId) {
    dispatch('clear')
    let call = await Api.get(`/entity/${entityId}/forEdit`)
    if (call.success) {
      let groupedContents = {}
      for (let c = 0; c < call.result.entity.contents.length; c++) {
        if (!groupedContents[call.result.entity.contents[c].lang]) {
          groupedContents[call.result.entity.contents[c].lang] = {}
        }
        groupedContents[call.result.entity.contents[c].lang][call.result.entity.contents[c].field] = call.result.entity.contents[c].value
      }
      call.result.entity.contents = groupedContents
      commit('setEntity', call.result.entity)
      commit('setRelations', call.result.relations)
      commit('setAncestors', call.result.ancestors)
      commit('setChildren', call.result.children)
    }
  },
  async changeRelationsPosition ({ commit, dispatch, state }, relations) {
    let index = 0
    let objects = lodash.keyBy(lodash.map(relations, (o) => {
      index++
      return { id: o.id, position: index }
    }), 'id')
    let oldRelations = state.relations
    lodash.forEach(oldRelations, async (value, key) => {
      if (objects[state.relations[key].id]) {
        state.relations[key].position = objects[state.relations[key].id].position
        await Api.post(`/entity/${state.entity.id}/relations`, { kind: 'medium', id: state.relations[key].id, depth: state.relations[key].depth, position: state.relations[key].position, tags: state.relations[key].tags })
      }
    })
    state.relations = lodash.sortBy(oldRelations, ['position'])
  },
  async changeChildrenPosition ({ commit, dispatch, state }, relations) {
    let index = 0
    let objects = lodash.keyBy(lodash.map(relations, (o) => {
      index++
      return { id: o.id, position: index }
    }), 'id')
    let oldRelations = state.children
    lodash.forEach(oldRelations, async (value, key) => {
      if (objects[state.children[key].id]) {
        state.children[key].position = objects[state.children[key].id].position
        await Api.post(`/entity/${state.children[key].id}/relations`, { kind: 'ancestor', id: state.entity.id, depth: state.children[key].depth, position: state.children[key].position, tags: state.children[key].tags })
      }
    })
    state.children = lodash.sortBy(oldRelations, ['position'])
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
    state.relations = lodash.sortBy(newRelations, ['position'])
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
