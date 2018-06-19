<template>
  <q-page class="q-ma-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el v-for="ancest in this.ancestors" :key="ancest.id" :label="ancest.name" @click.native="$router.push(`/content/${ancest.id}`)" class="pointer"/>
      <q-breadcrumbs-el :model="this.entity" :label="this.entity.name" />
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
    <q-btn class="q-ma-lg" color="primary" @click="saveEntity" :loading="loading">Guardar</q-btn>
    <q-item
      v-for="children in this.children"
      v-bind:key="children.id"
      @click.native="$router.push(`/content/${children.id}`)"
      class="dark">
      Children: {{ children.name }}
    </q-item>
  </q-page>
</template>

<script>
/* eslint-disable */
import entityInput from '../components/formItems/entityInput'
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
      ancestors: [],
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
      this.loading = true
      // console.log(this.entity)
      let saveResult = await Connection.patch(`/entity/${this.entity.id}`, this.entity)
      this.loading = false
      if (saveResult.success) {
        this.notifySuccess(this.$t(`${this.entity.name} updated succesfully`))
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
        this.notifySuccess(this.$t(`${this.entity.name} created succesfully`))
        this.getEntity()
      } else {
        this.$message.error({message: 'There was a problem creating the entity.'})
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
         timeout: 2000,
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
     }
  }
}
const modelsEditor = {
  home: [
    { label: 'Título', field: 'contents.title', component: entityInput },
    { label: 'Descripción', field: 'contents.description', component: entityInput, params: {type: 'textarea', rows: 3} },
    { label: 'Subtítulo', field: 'contents.summary', component: entityInput },
    { label: 'Modelo Home', field: 'Home', component: entityInput },
  ],
  section: [
    { label: 'Título', field: 'contents.title', component: entityInput },
    { label: 'Descripción', field: 'contents.description', component: entityInput, params: {type: 'textarea', rows: 3} },
    { label: 'Modelo Section', field: 'Section', component: entityInput },
  ],
  page: [
    { label: 'Título', field: 'contents.title', component: entityInput },
    { label: 'Descripción', field: 'contents.description', component: entityInput, params: {type: 'textarea', rows: 3} },
    { label: 'Modelo Page', field: 'Page', component: entityInput },
  ]
}
</script>
<style>
  .dark{
    color: #2e3436;
    cursor: pointer;
  }
  .pointer{
    cursor: pointer;
  }
</style>
