<template>
  <q-page class="q-ma-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el v-for="ancest in this.ancestors" :key="ancest.id" :label="ancest.name" @click.native="$router.push(`/content/edit/${ancest.id}`)" style="cursor: pointer;"/>
      <q-breadcrumbs-el :model="this.entity" :label="this.entity.name" />
    </q-breadcrumbs>
    <q-field :model="this.entity">
      <div v-for="item in this.formItems"
           v-bind:key="item.label"
           :is="item.component"
           :field="item.field"
           :label="item.label"
           :params="item.params"
           :entity="entity"></div>
    </q-field>
    <q-select
      style="width: 300px; max-width: 90vw; color: black;"
      class="q-mt-md"
      dark
      inverted-light
      v-model="entity.model"
      separator
      placeholder="Seleccione un modelo:"
      :options="this.models"
    />
    <q-btn class="q-ma-lg" color="primary" @click="saveEntity" :loading="loading">{{ 'content.update' | translate }}</q-btn>
    <q-btn class="q-ma-lg" color="primary" @click="createEntity" :loading="loading">{{ 'content.save child' | translate }}</q-btn>
    <q-item
      v-for="children in this.children"
      v-bind:key="children.id"
      @click.native="$router.push(`/content/edit/${children.id}`)"
      class="dark">
      {{ 'content.children' | translate }}: {{ children.name }}
    </q-item>
  </q-page>
</template>

<script>
/* eslint-disable */
import Input from './formItems/input'
import Connection from '../Connection'
import { routes } from '../router/routes'
import Notifications from './notifications.js'
/* es-lint enable */

export default {
  name: 'EditEntity',
  mounted () {
    this.getEntity()
  },
  beforeRouteUpdate (to, from, next) {
    // console.log(to.params.id)
    this.getEntity(to.params.id)
    next()
  },
  data () {
    return {
      loading: false,
      auth: true,
      models: [],
      ancestors: [],
      children: [],
      entity: {
        contents: {},
        data: {},
        relations: []
      },
      entityModel: '',
      newEntity: {
        model: '',
        name: '',
        parent: '',
        contents: []
      },
      formItems: []
    }
  },
  methods: {
    getEntity: async function (id) {
      // Get Entity
      if (id === ' ') {
        this.$route.params.id = undefined
        id = undefined
      }
      if (this.$route.params.id === ' ') {
        this.$route.params.id = undefined
      }
      let entityId = id ? id : this.$route.params.id
      if (!entityId) {
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
      }
      if (!entityId) {
        return
      }
      let entityResult = await Connection.get(`/entity/${entityId}`)
      if (entityResult.success) {
        this.entity = entityResult.data
      }

      // Get ancestors
      let ancestorsResult = await Connection.get(`/entity/${this.entity.id}/ancestors?fields=e.id,e.name`)
      if (ancestorsResult.success) {
        this.ancestors = ancestorsResult.data
      }
       //Get children
      let childrenResult = await Connection.get(`/entity/${this.entity.id}/children?fields=e.id,e.name`)
      if (childrenResult.success) {
        this.children = childrenResult.data
      }

       //Set models
      this.models = this.$store.state.main.config.models.list
      this.entityModel = this.entity.model

      this.formItems = modelsEditor[this.entity.model]

      this.loading = false
    },
    saveEntity: async function () {
      //TODO: Right now you can´t update a field when it hasn´t been stated first.
      this.loading = true
      let saveResult = await Connection.patch(`/entity/${this.entity.id}`, this.entity)
      this.loading = false
      if (saveResult.success) {
        Notifications.notifySuccess(this.$t(`${this.entity.name} updated succesfully`))
        setTimeout(() => this.getEntity(), 1500)
      } else {
        Notifications.notifyError(this.$t(`${this.entity.name} failed at update`))
      }
    },
    createEntity: async function () {
      this.childAuth()
      if (this.auth === true) {
        this.loading = true
        this.newEntity.parent = this.entity.id
        this.newEntity.model = this.entity.model
        this.newEntity.name = this.entity.name
        this.newEntity.contents = this.entity.contents
        let createResult = await Connection.post('/entity', this.newEntity)
        this.loading = false
        if (createResult.success) {
          Notifications.notifySuccess(this.$t(`New entity created successfully`))
          setTimeout(() => this.$router.push({name: routes.content.name, params: {id: createResult.data.id}}), 1500)
        } else {
          Notifications.notifyError(this.$t(`Couldn´t create new entity`))
        }
      } else {
        Notifications.notifyWarning(this.$t(`Child's model not allowed`))
      }
    },
    childAuth: function () {
      let configModels = this.$store.state.main.config.models
      if (configModels[this.entityModel]) {
        let allowedChildren = configModels[this.entityModel].allowedChildren
        for (let i = 0; i < allowedChildren.length; i++) {
          if (allowedChildren[i] === this.entity.model) {
            this.auth = true
            return
          }
        }
        this.auth = false
      } else {
        this.auth = false
      }
    }
  }
}
const modelsEditor = {
  home: [
    { label: 'Nombre', field: 'name', component: Input},
    { label: 'Título', field: 'contents.title', component: Input },
    { label: 'Descripción', field: 'contents.description', component: Input, params: {type: 'textarea', rows: 3} },
    { label: 'Subtítulo', field: 'contents.summary', component: Input },
  ],
  section: [
    { label: 'Nombre', field: 'name', component: Input},
    { label: 'Título', field: 'contents.title', component: Input },
    { label: 'Descripción', field: 'contents.description', component: Input, params: {type: 'textarea', rows: 3} },
  ],
  page: [
    { label: 'Nombre', field: 'name', component: Input},
    { label: 'Título', field: 'contents.title', component: Input },
    { label: 'Descripción', field: 'contents.description', component: Input, params: {type: 'textarea', rows: 3} },
  ]
}
</script>
<style>
  .dark{
    color: #2e3436;
    cursor: pointer;
  }
</style>
