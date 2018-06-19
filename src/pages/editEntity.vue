<template>
  <q-page class="q-ma-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Root"/>
      <q-breadcrumbs-el label="Home"/>
    </q-breadcrumbs>
    <q-field :model="this.entity">
      <div v-for="item in this.formItems"
           v-bind:key="item.label"
           :is="item.component"
           :field="item.field"
           :label="item.label"
           :params="item.params"
           :entity="entity" ></div>
    </q-field>
    <p>
      {{ entity }}
    </p>
    <q-btn class="q-ma-lg" color="primary" @click="child">Ir a Hijo</q-btn>
    <q-btn class="q-ma-lg" color="primary" @click="parent">Ir a Padre</q-btn>
  </q-page>
</template>

<script>
import Connection from '../Connection'

/* eslint-disable */
import entityInput from '../components/formItems/entityInput'
import entityInputUrl from '../components/formItems/entityInputUrl'
/* es-lint enable */

export default {
  name: 'EditEntity',
  mounted () {
    this.getEntity()
  },
  data () {
    return {
      loading: false,
      ancestors: [],
      parents: [],
      children: [],
      entity: {
        contents: {},
        data: {},
        relations: []
      },
      formItems: []
    }
  },
  methods: {
    getEntity: async function () {
      // Get Entity
      let entityId
      if (!this.$route.params.id) {
        let relations
        let relationsResult
        if (this.$store.state.main.user.id) {
          relationsResult = await Connection.get(`/entity/${this.$store.state.main.user.id}/relations?fields=e.id,r.kind`)
        }
        if (relationsResult.success) {
          relations = relationsResult.data
          for (let r = 0; r < relations.length; r++) {
            if (relations[r].relation.kind === 'home') {
              entityId = relations[r].id
            }
          }
        } else {
          this.loading = false
        }
      } else {
        entityId = this.$route.params.id
      }
      if (!entityId) {
        return
      }
      let entityResult = await Connection.get(`/entity/${entityId}`)
      if (entityResult.success) {
        this.entity = entityResult.data
      }

      // Get ancestors
      let ancestorsResult = await Connection.get(`/entity/${this.entity.id}/ancestors`)
      if (ancestorsResult.success) {
        this.ancestors = ancestorsResult.data
      }
      // Get parent
      let parentResult = await Connection.get(`/entity/${this.entity.id}/parent`)
      if (parentResult.success) {
        this.parents = parentResult.data
      }
       //Get children
      let childrenResult = await Connection.get(`/entity/${this.entity.id}/children`)
      if (childrenResult.success) {
        this.children = childrenResult.data[0]
      }

      this.formItems = modelsEditor[this.entity.model]

      this.loading = false
    },
    saveEntity: async function () {
      this.loading = true
      console.log(this.entity)
      let saveResult = await Connection.patch(`/entity/${this.entity.id}`, this.entity)
      this.loading = false
      if (saveResult.success) {
        this.$message({message: 'The entity was saved.', type: 'success'
        })
      } else {
        this.$message.error({message: 'There was a problem saving the entity.'})
      }
    },
    createEntity: async function () {
      this.loading = true
      this.newEntity.parent = this.entity.id
      let createResult = await Connection.post('/entity', this.newEntity)
      this.loading = false
      if (createResult.success) {
        this.$message({message: 'The entity was created.', type: 'success'})
        this.getEntity()
      } else {
        this.$message.error({message: 'There was a problem creating the entity.'})
      }
    },
    child: async function () {
      this.$router.push({name: routes.editEntity.name, params: {id: this.children.id}})
    },
    parent: async function () {
      this.$router.push({name: routes.editEntity.name, params: {id: this.parents.id}})
    }
  }
}
const modelsEditor = {
  home: [
    { label: 'Título', field: 'contents.title', component: entityInput },
    { label: 'Reseña', field: 'contents.summary', component: entityInput, params: {type: 'textarea', rows: 3} },
    { label: 'Subtitulo', field: 'contents.subtitle', component: entityInput },
    { label: 'Modelo Home', field: 'contents.subtitle', component: entityInput },
    { label: 'Url', field: 'contents.url', component: entityInputUrl, params: {reference: 'contents.title'} }
  ],
  section: [
    { label: 'Título', field: 'contents.title', component: entityInput },
    { label: 'Reseña', field: 'contents.summary', component: entityInput, params: {type: 'textarea', rows: 3} },
    { label: 'Subtitulo', field: 'contents.subtitle', component: entityInput },
    { label: 'Modelo Section', field: 'contents.subtitle', component: entityInput },
    { label: 'Url', field: 'contents.url', component: entityInputUrl, params: {reference: 'contents.title'} }
  ],
  page: [
    { label: 'Título', field: 'contents.title', component: entityInput },
    { label: 'Reseña', field: 'contents.summary', component: entityInput, params: {type: 'textarea', rows: 3} },
    { label: 'Subtitulo', field: 'contents.subtitle', component: entityInput },
    { label: 'Modelo Page', field: 'contents.subtitle', component: entityInput },
    { label: 'Url', field: 'contents.url', component: entityInputUrl, params: {reference: 'contents.title'} }
  ]
}
</script>
