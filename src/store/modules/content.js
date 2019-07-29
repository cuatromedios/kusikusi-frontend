import Vue from 'vue'
import Api from '../../tools/Api'
import _ from 'lodash'
import moment from 'moment'

// initial state

const blankEntity = {
  contents: {},
  active: true
}

const state = {
  entity: _.clone(blankEntity),
  relations: [],
  children: [],
  ancestors: []
}

// getters
const getters = {
  getRelationsByKind: (state) => (kind) => {
    return state.relations.filter(relation => relation.kind === kind)
  },
  getBreadcrums: (state, getters, rootState, rootGetters) => {
    let firstFound
    let ancestors = []
    for (let a = 0; a < state.ancestors.length; a++) {
      if (state.ancestors[a].id === 'home') firstFound = true
      if (firstFound && rootState.ui.config.models && state.ancestors[a].model) {
        ancestors.push({
          id: state.ancestors[a].id,
          title: _.get(state.ancestors[a], 'contents.title') || state.ancestors[a].name || state.ancestors[a].model,
          icon: rootState.ui.config.models[state.ancestors[a].model].icon
        })
      }
    }
    if (_.get(rootState, 'ui.config.models', null) && _.get(state, 'entity.model', null)) {
      ancestors.push({
        id: state.entity.id,
        title: _.get(state.entity, 'contents.title') || state.entity.name || state.entity.model,
        icon: rootState.ui.config.models[state.entity.model].icon
      })
    }
    return ancestors
  },
  getField: (state) => (field) => {
    return _.get(state, 'entity.' + field)
  }
}

// actions
const actions = {
  clear ({ commit }) {
    commit('setEntity', _.clone(blankEntity))
    commit('setRelations', [])
    commit('setChildren', [])
    commit('setAncestors', [])
  },
  clearId ({ commit }) {
    commit('setEntityValue', { field: 'id', value: undefined })
  },
  async newEntity ({ commit, rootGetters, rootState }, entity) {
    let newEntity = _.clone(blankEntity)
    newEntity.id = 'new'
    if (entity.model) {
      let editorGroups = _.get(rootState, 'ui.config.models.' + entity.model + '.editor')
      if (editorGroups && editorGroups.length) {
        for (let g in editorGroups) {
          for (let f in editorGroups[g].fields) {
            let fieldName = editorGroups[g].fields[f].field
            let fieldParts = fieldName.split('.')
            if (fieldParts[0] === entity.model) {
              Vue.set(newEntity, entity.model, {})
            }
          }
        }
      }
    }
    newEntity.published_at = moment().format()
    for (let l in rootGetters['ui/langs']) {
      Vue.set(newEntity.contents, rootGetters['ui/langs'][l], {})
    }
    let merged = { ...newEntity, ...entity }
    let call = await Api.get(`/entity/${entity.parent_id}/forEdit`)
    let ancestors = call.result.ancestors
    for (let a = 0; a < call.result.ancestors.length; a++) {
      call.result.ancestors[a].contents = groupContents(call.result.ancestors[a].contents)
    }
    call.result.entity.contents = groupContents(call.result.entity.contents)
    ancestors.push(call.result.entity)
    commit('setEntity', merged)
    commit('setRelations', [])
    commit('setChildren', [])
    commit('setAncestors', ancestors)
  },
  async getEntity ({ commit, dispatch, rootState }, entityId) {
    dispatch('clear')
    let call = await Api.get(`/entity/${entityId}/forEdit`)
    if (call.success) {
      call.result.entity.contents = groupContents(call.result.entity.contents)
      if (!_.get(rootState, 'ui.config.models.' + call.result.entity.model)) {
        call.result.entity.model = 'undefined'
      }
      commit('setEntity', call.result.entity)
      commit('setRelations', call.result.relations)
      for (let a = 0; a < call.result.ancestors.length; a++) {
        call.result.ancestors[a].contents = groupContents(call.result.ancestors[a].contents)
      }
      commit('setAncestors', call.result.ancestors)
      commit('setChildren', call.result.children)
    }
  },
  async changeRelationsPosition ({ commit, dispatch, state }, relations) {
    let index = 0
    let objects = _.keyBy(_.map(relations, (o) => {
      index++
      return { id: o.id, position: index }
    }), 'id')
    let oldRelations = state.relations
    _.forEach(oldRelations, async (value, key) => {
      if (objects[state.relations[key].id]) {
        state.relations[key].position = objects[state.relations[key].id].position
        await Api.post(`/entity/${state.entity.id}/relations`, { kind: 'medium', id: state.relations[key].id, depth: state.relations[key].depth, position: state.relations[key].position, tags: state.relations[key].tags })
      }
    })
    state.relations = _.sortBy(oldRelations, ['position'])
  },
  async changeChildrenPosition ({ commit, dispatch, state }, relations) {
    let index = 0
    let objects = _.keyBy(_.map(relations, (o) => {
      index++
      return { id: o.id, position: index }
    }), 'id')
    let oldRelations = state.children
    _.forEach(oldRelations, async (value, key) => {
      if (objects[state.children[key].id]) {
        state.children[key].position = objects[state.children[key].id].position
        await Api.post(`/entity/${state.children[key].id}/relations`, { kind: 'ancestor', id: state.entity.id, depth: state.children[key].depth, position: state.children[key].position, tags: state.children[key].tags })
      }
    })
    state.children = _.sortBy(oldRelations, ['position'])
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
      console.log('- entity')
      Vue.set(state.entity, fieldParts[0], payload.value)
    } else if (fieldParts[0] === 'contents') {
      if (!state.entity.contents[payload.lang]) {
        Vue.set(state.entity.contents, payload.lang, {})
      }
      Vue.set(state.entity.contents[payload.lang], fieldParts[1], payload.value)
    } else {
      if (!state.entity[fieldParts[0]]) Vue.set(state.entity, fieldParts[0], {})
      Vue.set(state.entity[fieldParts[0]], fieldParts[1], payload.value)
    }
  },
  setRelations (state, newRelations) {
    state.relations = _.sortBy(newRelations, ['position'])
  },
  setChildren (state, newChildren) {
    state.children = newChildren
  },
  setAncestors (state, newAncestors) {
    state.ancestors = newAncestors
  }
}

const groupContents = function (contents) {
  let groupedContents = {}
  for (let c = 0; c < contents.length; c++) {
    if (!groupedContents[contents[c].lang]) {
      groupedContents[contents[c].lang] = {}
    }
    groupedContents[contents[c].lang][contents[c].field] = contents[c].value
  }
  return groupedContents
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
