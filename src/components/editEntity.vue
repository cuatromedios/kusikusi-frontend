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
      style="width: 650px; max-width: 90vw; color: black;"
      class="q-mt-md"
      dark
      inverted-light
      v-model="entity.model"
      separator
      placeholder="Seleccione un modelo"
      :options="options"
    />
    <q-btn class="q-ma-lg" color="primary" @click="saveEntity" :loading="loading">Actualizar</q-btn>
    <q-btn class="q-ma-lg" color="primary" @click="createEntity" :loading="loading">Guardar como hijo</q-btn>
    <!--<q-select-->
      <!--style="width: 300px; max-width: 90vw; color: black;"-->
      <!--class="q-mt-md"-->
      <!--dark-->
      <!--inverted-light-->
      <!--v-for="children in this.children"-->
      <!--v-bind:key="children.id"-->
      <!--v-model="selectChild"-->
      <!--separator-->
      <!--placeholder="Hijos:"-->
      <!--:options="[{ label: children.name, value: children.id}]"-->
      <!--@change="test"-->
    <!--/>-->
    <q-item
      v-for="children in this.children"
      v-bind:key="children.id"
      @click.native="$router.push(`/content/edit/${children.id}`)"
      class="dark">
      Children: {{ children.name }}
    </q-item>
  </q-page>
</template>

<script>
/* eslint-disable */
import entityInput from './formItems/entityInput'
import Connection from '../Connection'
import { routes } from '../router/routes'
/* es-lint enable */

export default {
  name: 'EditEntity',
  mounted () {
    this.getEntity()
  },
  beforeRouteUpdate(to, from, next) {
    // console.log(to.params.id)
    this.getEntity(to.params.id)
    next()
  } ,
  data () {
    return {
      loading: false,
      options: [
        {
          label: 'Root',
          value: 'root'
        },
        {
          label: 'Home',
          value: 'home'
        },
        {
          label: 'Section',
          value: 'section'
        },
        {
          label: 'Page',
          value: 'page'
        },
        {
          label: 'Container',
          value: 'container'
        },
        {
          label: 'Medium',
          value: 'medium'
        },
        {
          label: 'User',
          value: 'user'
        }
      ],
      ancestors: [],
      children: [],
      // selectChild: '',
      entity: {
        contents: {},
        data: {},
        relations: []
      },
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
      let ancestorsResult = await Connection.get(`/entity/${this.entity.id}/ancestors`)
      if (ancestorsResult.success) {
        this.ancestors = ancestorsResult.data
      }
       //Get children
      let childrenResult = await Connection.get(`/entity/${this.entity.id}/children`)
      if (childrenResult.success) {
        this.children = childrenResult.data
      }

      this.formItems = modelsEditor[this.entity.model]

      this.loading = false
    },
    saveEntity: async function () {
      //TODO: Right now you can´t update a field when it hasn´t been stated first. FIX THAT!
      this.loading = true
      let saveResult = await Connection.patch(`/entity/${this.entity.id}`, this.entity)
      this.loading = false
      if (saveResult.success) {
        this.notifySuccess(this.$t(`${this.entity.name} updated succesfully`))
        setTimeout(() => this.getEntity(), 1500)
      } else {
        this.notifyError(this.$t(`${this.entity.name} failed at update`))
      }
    },
    createEntity: async function () {
      this.loading = true
      this.newEntity.parent = this.entity.id
      this.newEntity.model = this.entity.model
      this.newEntity.name = this.entity.name
      this.newEntity.contents = this.entity.contents
      let createResult = await Connection.post('/entity', this.newEntity)
      this.loading = false
      if (createResult.success) {
        this.notifySuccess(this.$t(`New entity created succesfully`))
        setTimeout(() => this.$router.push({name: routes.content.name, params: {id: createResult.data.id}}), 1500)
      } else {
        this.notifyError(this.$t(`Couldn´t create new entity`))
      }
    },
    // child: async function () {
    //   this.$router.push({name: routes.editEntity.name, params: {id: this.children[0].id}})
    // },
    // parent: async function () {
    //   this.$router.push({name: routes.editEntity.name, params: {id: this.entity.parent}})
    // },
    notifySuccess: function (message) {
       this.$q.notify({
         message: message,
         timeout: 1500,
         type: 'positive',
         textColor: 'white',
         icon: 'fa-check',
         position: 'top',
         actions: [
           {
             label: '',
             icon: 'fa-times', // optional
             handler: () => {
             }
           }
         ]
       })
     },
    notifyError: function (message) {
      this.$q.notify({
        message: message,
        timeout: 1500,
        type: 'negative',
        textColor: 'white',
        icon: 'fa-exclamation-triangle',
        position: 'top',
        actions: [
          {
            label: '',
            icon: 'fa-times', // optional
            handler: () => {
            }
          }
        ]
      })
    }
  }
}
const modelsEditor = {
  home: [
    { label: 'Nombre', field: 'name', component: entityInput},
    { label: 'Título', field: 'contents.title', component: entityInput },
    { label: 'Descripción', field: 'contents.description', component: entityInput, params: {type: 'textarea', rows: 3} },
    { label: 'Subtítulo', field: 'contents.summary', component: entityInput },
  ],
  section: [
    { label: 'Nombre', field: 'name', component: entityInput},
    { label: 'Título', field: 'contents.title', component: entityInput },
    { label: 'Descripción', field: 'contents.description', component: entityInput, params: {type: 'textarea', rows: 3} },
  ],
  page: [
    { label: 'Nombre', field: 'name', component: entityInput},
    { label: 'Título', field: 'contents.title', component: entityInput },
    { label: 'Descripción', field: 'contents.description', component: entityInput, params: {type: 'textarea', rows: 3} },
  ]
}
</script>
<style>
  .dark{
    color: #2e3436;
    cursor: pointer;
  }
</style>
