<template>
  <q-page class="q-pa-md">
    <strong style="font-size: 25px;" v-if="this.kind === 'update'">{{ this.entityMedia.name }}</strong>
    <strong style="font-size: 25px;" v-if="this.kind === 'new'">Nuevo medio</strong>
    <q-field>
      <div v-for="item in this.formItems"
           v-bind:key="item.label"
           :is="item.component"
           :field="item.field"
           :label="item.label"
           :params="item.params"
           :entity="entityMedia"
           :action="add"
           :trigger="remove"></div>
      <img :src="src" class="q-my-lg">
      <q-btn class="q-ma-lg" round color="negative" @click="deleteMedia" icon="fa-times" size="sm" :loading="loading" v-if="this.src !== ''"></q-btn>
    </q-field>
    <q-btn class="q-ma-lg" color="primary" @click="update" :loading="loading" v-if="this.kind === 'update'">Actualizar datos</q-btn>
    <q-btn class="q-ma-lg" color="negative" @click="deleteEntity" :loading="loading" v-if="this.kind === 'update'">Eliminar</q-btn>
    <q-btn class="q-ma-lg" color="primary" @click="save" :loading="loading" v-if="this.kind === 'new'">Guardar</q-btn>
  </q-page>
</template>

<script>
import mediaUpload from './formItems/mediaUpload'
import Input from './formItems/textInput'
import Connection from '../Connection'
import config from '../config'
import { routes } from '../router/routes'
import Notifications from './notifications.js'
export default {
  name: 'EditMedia',
  mounted () {
    this.getSelected()
  },
  beforeRouteUpdate (to, from, next) {
    this.load(to.params.id)
    next()
  },
  props: {
    relation: {
      default: '',
      type: String
    },
    close: {},
    reload: {}
  },
  data () {
    return {
      // TODO: Agregar button group. Se ven mas chidos
      loading: false,
      kind: '',
      entityMedia: {
        name: '',
        model: '',
        parent: '',
        contents: {
          title: '',
          description: ''
        }
      },
      src: '',
      url: '',
      extensions: ['.jpg', '.png', 'gif'],
      formItems: [],
      files: {},
      type: {
        name: 'file',
        headerType: 'multipart/form-data'
      },
      called: {
        kind: 'medium',
        id: ''
      }
    }
  },
  methods: {
    load: function (id) {
      if (id) {
        this.getSelected(id)
      } else {
        this.getSelected()
      }
    },
    getSelected: async function (id) {
      let userId
      if (!id) {
        userId = this.$route.params.id
      } else {
        userId = id
      }
      if (userId) {
        let Result = await Connection.get(`/entity/${userId}`)
        if (Result.success) {
          if (Result.data.model === 'medium') {
            this.entityMedia = Result.data
            this.url = `${config.api.url}/media/${this.entityMedia.id}/upload`
            this.kind = 'update'
            if (this.entityMedia.data) {
              this.src = `${config.media.url}/${this.entityMedia.id}/thumb`
            }
          } else {
            this.kind = 'new'
          }
        }
      } else {
        this.kind = 'new'
      }
      this.formItems = kindEditor[this.kind]
    },
    add: function (files) {
      this.files = files[0]
    },
    remove: function () {
      this.files = {}
    },
    save: async function () {
      this.loading = true
      this.entityMedia.model = 'medium'
      this.entityMedia.parent = 'media'
      let saveResult = await Connection.post(`/media`, this.entityMedia)
      this.loading = false
      if (saveResult.success) {
        let uploadResult = await Connection.post(`/media/${saveResult.data.id}/upload`, this.files, this.type)
        if (uploadResult.success) {
          if (this.relation) {
            this.called.id = saveResult.data.id
            let relationResult = await Connection.post(`/entity/${this.relation}/relations`, this.called)
            if (relationResult.success) {
              Notifications.notifySuccess(this.$t(`Media created and related successfully`))
              setTimeout(() => this.closeModalWhenIsComponent(), 1500)
            } else {
              Notifications.notifyWarning(this.$t(`Media created but could´t create the relation`))
              setTimeout(() => this.$router.push({name: routes.media.name, params: {id: saveResult.data.id}}), 1500)
            }
          } else {
            Notifications.notifySuccess(this.$t(`Media created successfully`))
            setTimeout(() => this.$router.push({name: routes.media.name, params: {id: saveResult.data.id}}), 1500)
          }
        } else {
          Notifications.notifyError(this.$t(`Media data created, but failed at uploading the file`))
        }
      } else {
        Notifications.notifyError(this.$t(`Failed at creating media`))
      }
    },
    closeModalWhenIsComponent: function () {
      this.close = true
      this.reload()
    },
    update: async function () {
      this.loading = true
      let updateResult = await Connection.patch(`/entity/${this.entityMedia.id}`, this.entityMedia)
      this.loading = false
      if (updateResult.success) {
        if (this.files.name) {
          let uploadResult = await Connection.post(`/media/${this.entityMedia.id}/upload`, this.files, this.type)
          if (uploadResult.success) {
            Notifications.notifySuccess(this.$t(`Media uploaded and updated successfully`))
            setTimeout(() => this.load(), 1500)
          } else {
            Notifications.notifyError(this.$t(`Media data updated, but failed at uploading the file`))
          }
        } else {
          Notifications.notifySuccess(this.$t(`${this.entityMedia.name}'s data updated successfully`))
          setTimeout(() => this.load(), 1500)
        }
      } else {
        Notifications.notifyError(this.$t(`Failed at updating media data`))
      }
    },
    deleteMedia: async function () {
      this.loading = true
      let deleteResult = await Connection.delete(`/media/${this.entityMedia.id}`)
      this.loading = false
      if (deleteResult.success) {
        this.src = ''
        Notifications.notifySuccess(this.$t(`${this.entityMedia.name}'s media deleted successfully`))
        setTimeout(() => this.load(), 1500)
      } else {
        Notifications.notifyError(this.$t(`Failed at deleting ${this.entityMedia.name}'s media`))
      }
    },
    deleteEntity: async function () {
      this.loading = true
      let deleteResult = await Connection.delete(`/media/${this.entityMedia.id}`)
      if (deleteResult.success) {
        this.src = ''
        let deleteEntityResult = await Connection.delete(`/entity/${this.entityMedia.id}`)
        if (deleteEntityResult.success) {
          this.loading = false
          Notifications.notifySuccess(this.$t(`Media deleted successfully`))
          setTimeout(() => this.$router.push({name: routes.gallery.name}), 1500)
        } else {
          this.loading = false
          Notifications.notifyError(this.$t(`Media deleted, but couldn't delete ${this.entityMedia.name}`))
          setTimeout(() => this.load(), 1500)
        }
      } else {
        Notifications.notifyError(this.$t(`Failed at deleting ${this.entityMedia.name}'s media`))
      }
    }
  }
}
const kindEditor = {
  new: [
    { label: 'Titulo', field: 'contents.title', component: Input },
    { label: 'Descripcion', field: 'contents.description', component: Input, params: {type: 'textarea', rows: 3} },
    { label: 'Subir arcivos', component: mediaUpload }
  ],
  update: [
    { label: 'Título', field: 'contents.title', component: Input },
    { label: 'Descripción', field: 'contents.description', component: Input, params: {type: 'textarea', rows: 3} },
    { label: 'Subir arcivos', component: mediaUpload }
  ]
}
</script>

<style>
</style>
