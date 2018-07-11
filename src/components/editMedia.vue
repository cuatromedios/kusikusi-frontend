<template>
  <q-page class="q-pa-md">
    <strong style="font-size: 25px;" v-if="this.kind !== 'new'">{{ this.entityMedia.name }}</strong>
    <strong style="font-size: 25px;" v-if="this.kind === 'new'">Nueva media</strong>
    <q-field>
      <div v-for="item in this.formItems"
           v-bind:key="item.label"
           :is="item.component"
           :field="item.field"
           :label="item.label"
           :params="item.params"
           :src="item.src"
           :entity="entityMedia"
           :action="add"></div>
      <img :src="src">
    </q-field>
    <q-btn class="q-ma-lg" color="primary" @click="update" :loading="loading" v-if="this.kind !== 'new'">Actualizar datos</q-btn>
    <q-btn class="q-ma-lg" color="primary" @click="save" :loading="loading" v-if="this.kind === 'new'">Guardar</q-btn>
    <img src="">
  </q-page>
</template>

<script>
import mediaUpload from './formItems/mediaUpload'
import Input from './formItems/input'
import Connection from '../Connection'
import axios from 'axios'
import config from '../config'
import { routes } from '../router/routes'
export default {
  name: 'EditMedia',
  mounted () {
    this.getSelected()
  },
  beforeRouteUpdate (to, from, next) {
    this.load(to.params.id)
    next()
  },
  data () {
    return {
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
      files: {}
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
          this.entityMedia = Result.data
          this.url = `${config.api.url}/media/${this.entityMedia.id}/upload`
          if (this.entityMedia.data) {
            this.src = `${config.media.url}/${this.entityMedia.id}/thumb`
            console.log(this.src)
            this.kind = 'update'
          } else {
            this.kind = 'recent'
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
    save: async function () {
      this.loading = true
      this.entityMedia.model = 'medium'
      this.entityMedia.parent = 'media'
      let saveResult = await Connection.post(`/media`, this.entityMedia)
      this.loading = false
      if (saveResult.success) {
        this.notifySuccess(this.$t(`Media created successfully`))
        setTimeout(() => this.$router.push({name: routes.media.name, params: {id: saveResult.data.id}}), 1500)
      } else {
        this.notifyError(this.$t(`Failed at creating media`))
      }
    },
    update: async function () {
      let data = new FormData()
      this.loading = true
      let updateResult = await Connection.patch(`/entity/${this.entityMedia.id}`, this.entityMedia)
      this.loading = false
      if (updateResult.success) {
        data.set('file', this.files, { type: 'multipart/form-data' })
        console.log(data)
        console.log(this.files)
        let uploadResult = axios.post(`${config.api.url}/media/${this.entityMedia.id}/upload`, data)
        if (uploadResult.success) {
          this.notifySuccess(this.$t(`Media uploaded and updated successfully`))
          setTimeout(() => this.getSelected(), 1500)
        } else {
          this.notifyError(this.$t(`Media data updated, but failed at uploading the file`))
        }
      } else {
        this.notifyError(this.$t(`Failed at updating media data`))
      }
    },
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
const kindEditor = {
  new: [
    { label: 'Titulo', field: 'contents.title', component: Input },
    { label: 'Descripcion', field: 'contents.description', component: Input, params: {type: 'textarea', rows: 3} }
  ],
  recent: [
    { label: 'Titulo', field: 'contents.title', component: Input },
    { label: 'Descripción', field: 'contents.description', component: Input, params: {type: 'textarea', rows: 3} },
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
