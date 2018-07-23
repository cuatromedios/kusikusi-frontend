<template>
  <q-page class="q-ma-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el v-for="ancest in this.ancestors" :key="ancest.id" :label="ancest.name" @click.native="$router.push(`/content/edit/${ancest.id}`)" style="cursor: pointer;"/>
      <q-breadcrumbs-el :model="this.entity" :label="this.entity.name" />
    </q-breadcrumbs>
    <div>
      <div v-for="item in this.editorItems"
           v-bind:key="item.index"
           :is="item.component"
           v-bind="item.props"
           :entity="entity">
      </div>
    </div>
    <q-btn-group push class="q-ma-lg">
      <q-btn push color="tertiary" @click="saveEntity" :loading="loading" >{{ 'content.update' | translate }}</q-btn>
      <q-btn push color="red" @click="deleteConfirm = true" :loading="loading" >{{ 'content.delete' | translate }}</q-btn>
    </q-btn-group>
    <q-modal v-model="deleteConfirm" minimized :content-css="{padding: '50px'}" @hide="deleteConfirm = false">
      <q-btn class="q-ma-lg absolute-top-right" round color="negative" @click="deleteConfirm = false" icon="fa-times" size="xs"></q-btn>
      <div class="q-display-1 q-mb-md">¿Deseas Eliminar esta entidad?</div>
      <p><strong>¡Esto eliminará también a todos sus descendientes!</strong></p>
      <q-btn push color="red" @click="deleteEntity(entity.id)" :loading="loading" >{{ 'content.delete' | translate }}</q-btn>
    </q-modal>
    <q-modal v-model="createMedia" :content-css="{minWidth: '80vw', minHeight: '80vh'}" @hide="createMedia = false">
      <EditMedia :relation="entity.id" :reload="getEntity" :close="deleteConfirm"></EditMedia>
      <q-btn class="q-ma-lg absolute-top-right" round color="negative" @click="createMedia = false" icon="fa-times" size="xs"></q-btn>
    </q-modal>
  </q-page>
</template>

<script>
/* eslint-disable */
import Connection from '../Connection'
import { routes } from '../router/routes'
import config from '../config'
import EditMedia from './editMedia'
import Notifications from './notifications.js'
import textInput from './editor/textInput'
import wysiwyg from './editor/editorWYSIWYG'
import datetime from './editor/datetime'
import selectInput from './editor/selectInput'
import formHeader from './editor/formHeader'
import children from './editor/children'
import titleSummaryContent from './editor/titleSummaryContent'
/* es-lint enable */

export default {
  components: {
    EditMedia, textInput, wysiwyg, datetime, selectInput, formHeader, children, titleSummaryContent
  },
  name: 'EditEntity',
  mounted () {
    this.load(this.$route.params.id)
  },
  beforeRouteUpdate (to, from, next) {
    this.load(to.params.id)
    next()
  },
  data () {
    return {
      loading: false,
      toggle: 'Activo',
      deleteConfirm: false,
      createMedia: false,
      disableContent: true,
      disableMedia: true,
      checkDeleteContent: [],
      checkDeleteMedia: [],
      modelsData: {
        allowedChild: [],
      },
      ancestors: [],
      children: [],
      media: [],
      entity: {},
      newEntity: {
        model: '',
        name: '',
        parent: '',
        created_by: '',
        updated_by: '',
        contents: {
          description: '',
          summary: '',
          title: '',
          url: '/'
        },
        data: {}
      },
      editorItems: []
    }
  },
  methods: {
    load: function (id) {
      if (id === ' ' || id === undefined) {
        this.$route.params.id = undefined
        id = undefined
      }
      if (this.$route.params.id === ' ') {
        this.$route.params.id = undefined
      }
      this.getEntity(id)
    },
    getEntity: async function (id) {
      // Get Entity
      this.media = []
      this.modelsData = {
        'allowedChild': []
      }
      this.editorItems = []
      this.disable = true
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
      //Get medias
      let mediums
      let mediaResult = await Connection.get(`/entity/${this.entity.id}/relations/medium?fields=e.id,e.name`)
      if (mediaResult.success) {
        for (let i = 0; i < mediaResult.data.length; i++) {
          mediums = {'id': mediaResult.data[i].id, 'name': mediaResult.data[i].name, 'src': `${config.media.url}/${mediaResult.data[i].id}/thumb`}
          this.media.push(mediums)
        }
      }
      //Set models
      this.modelData()

      this.loading = false
    },
    saveEntity: async function () {
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

    createEntity: async function (model) {
      this.loading = true
      this.newEntity.parent = this.entity.id
      this.newEntity.model = model
      this.newEntity.name = 'entidad'
      this.newEntity.created_by = this.entity.id
      this.newEntity.updated_by = this.entity.id
      let createResult = await Connection.post('/entity', this.newEntity)
      this.loading = false
      if (createResult.success) {
        Notifications.notifySuccess(this.$t(`New entity created successfully`))
        setTimeout(() => this.$router.push({name: routes.content.name, params: {id: createResult.data.id}}), 1500)
      } else {
        Notifications.notifyError(this.$t(`Couldn´t create new entity`))
      }
    },
    deleteEntitiesArray: async function (entity) {
      for (let i = 0; i < entity.length; i++) {
        this.loading = true
        let descendantsResult = await Connection.get(`/entity/${entity[i]}/descendants?fields=e.id`)
        if (descendantsResult.success) {
          for (let i = 0; i < descendantsResult.data.length; i++) {
            let deleteDescendantsResult = await Connection.delete(`/entity/${descendantsResult.data[i].id}`)
            if (!deleteDescendantsResult.success) {
              Notifications.notifyError(this.$t(`An error was thrown while deleting a descendant`))
              return;
            }
          }
        }
        let deleteEntityResult = await Connection.delete(`/entity/${entity[i]}`)
        this.loading = false
        if (deleteEntityResult.success) {
          Notifications.notifySuccess(this.$t(`Entity and it's descendants were deleted successfully`))
        } else {
          Notifications.notifyError(this.$t(`Couldn't delete the selected entity`))
        }
      }
      this.checkDeleteContent = []
      this.disableContent = true
      setTimeout(() => this.getEntity(), 1500)
    },
    deleteEntity: async function (entity) {
      this.deleteConfirm = false
      this.loading = true
      let descendantsResult = await Connection.get(`/entity/${entity}/descendants?fields=e.id`)
      if (descendantsResult.success) {
        for (let i = 0; i < descendantsResult.data.length; i++) {
          let deleteDescendantsResult = await Connection.delete(`/entity/${descendantsResult.data[i].id}`)
          if (!deleteDescendantsResult.success) {
            Notifications.notifyError(this.$t(`An error was thrown while deleting a descendant`))
            return;
          }
        }
      }
      let deleteEntityResult = await Connection.delete(`/entity/${entity}`)
      this.loading = false
      if (deleteEntityResult.success) {
        Notifications.notifySuccess(this.$t(`The entity and it's descendants were deleted successfully`))
        setTimeout(() => this.$router.push({name: routes.content.name, params: {id: this.entity.parent}}), 1500)
      } else {
        Notifications.notifyError(this.$t(`Couldn't delete the selected entity`))
      }
    },
    deleteMedia: async function (entity) {
      for (let i = 0; i < entity.length; i++) {
        this.loading = true
        let deleteResult = await Connection.delete(`/media/${entity[i]}`)
        if (deleteResult.success) {
          let deleteEntityResult = await Connection.delete(`/entity/${entity[i]}`)
          if (deleteEntityResult.success) {
            this.loading = false
            Notifications.notifySuccess(this.$t(`Media deleted successfully`))
          } else {
            this.loading = false
            Notifications.notifyError(this.$t(`Media deleted, but couldn't delete the entity itself`))
          }
        } else {
          Notifications.notifyError(this.$t(`Failed at deleting ${this.entityMedia.name}'s media`))
        }
      }
      this.checkDeleteMedia = []
      this.disableMedia = true
      setTimeout(() => this.getEntity(), 1500)
    },
    updateActiveValue: function () {
      this.toggle === 'Activo' ? this.entity.isActive = 1 : this.entity.isActive = 0
    },
    disableContentButton: function () {
      this.checkDeleteContent.length === 0 ? this.disableContent = true : this.disableContent = false
    },
    disableMediaButton: function () {
      this.checkDeleteMedia.length === 0 ? this.disableMedia = true : this.disableMedia = false
    },
    modelData: async function () {
      let data
      let configModels = this.$store.state.main.config.models
      if (configModels[this.entity.model]) {
        /*let allowedChildren = configModels[this.entity.model].children.allowed
        for (let i = 0; i < allowedChildren.length; i++) {
          data = {'value': allowedChildren[i]}
          this.modelsData.allowedChild.push(data)
        }*/
        this.editorItems = configModels[this.entity.model].editor
        console.log(this.editorItems)
      } else {
        this.modelsData = {
          'allowedChild': []
        }
      }
    }
  }
}
</script>
<style>
  .dark{
    color: #2e3436;
    cursor: pointer;
  }
</style>
