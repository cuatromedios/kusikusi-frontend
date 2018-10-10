<template>
  <q-page class="q-ma-md">
    <div>
      <q-breadcrumbs>
        <q-breadcrumbs-el v-for="ancest in this.ancestors" :key="ancest.id" :label="ancest.name" @click.native="$router.push(`/content/edit/${ancest.id}`)" style="cursor: pointer;"/>
        <q-breadcrumbs-el :model="this.entity" :label="this.entity.name" />
      </q-breadcrumbs>
    </div>
    <div v-if="!edit">
      <div v-for="item in this.displayItems"
        v-bind:key="item.index"
        :is="item.component"
        v-bind="item.props"
        :entity="entity"
        :reload="getEntity"
        :edit.sync="edit">
      </div>
    </div>
    <div v-if="edit">
      <div v-for="item in this.editorItems"
         v-bind:key="item.index"
         :is="item.component"
         v-bind="item.props"
         :entity="entity"
         :reload="getEntity"
         :lang.sync="selectedLang">
      </div>
      <q-btn-group push class="q-ma-lg">
        <q-btn push color="tertiary" @click="saveEntity" :loading="loading" >{{ 'content.update' | translate }}</q-btn>
        <q-btn push color="red" @click="edit = false" :loading="loading" >CANCELAR</q-btn>
        <q-btn push color="negative" @click="deleteConfirm = true" :loading="loading" >{{ 'content.delete' | translate }}</q-btn>
      </q-btn-group>
      <q-modal v-model="deleteConfirm" minimized :content-css="{padding: '50px'}" @hide="deleteConfirm = false">
        <q-btn class="q-ma-lg absolute-top-right" round color="red" @click="deleteConfirm = false" icon="fa-times" size="xs"></q-btn>
        <div class="q-display-1 q-mb-md">¿Deseas Eliminar esta entidad?</div>
        <q-btn push color="red" @click="deleteEntity(entity.id)" :loading="loading" >{{ 'content.delete' | translate }}</q-btn>
      </q-modal>
    </div>
  </q-page>
</template>

<script>
/* eslint-disable */
import Connection from '../Connection'
import { routes } from '../router/routes'
import config from '../config'
import Notifications from './notifications.js'
import textInput from './editor/textInput'
import wysiwyg from './editor/editorWYSIWYG'
import datetime from './editor/datetime'
import selectInput from './editor/selectInput'
import formHeader from './editor/formHeader'
import children from './editor/children'
import titleSummaryContent from './editor/titleSummaryContent'
import entityCard from './editor/entityCard'
import publication from './editor/publication'
import media from './editor/media'
import urlAccess from './editor/urlAccess'
import toggleButton from './editor/toggleButton'
import multiLang from './editor/multiLang'
import relation from './editor/relation'
import userBasicData from './editor/userBasicData'
import displayMedia from './editor/displayMedia'
import qrCode from './editor/qrCode'
/* es-lint enable */

export default {
  components: {
    textInput,
    wysiwyg,
    datetime,
    selectInput,
    formHeader,
    children,
    titleSummaryContent,
    entityCard,
    publication,
    media,
    urlAccess,
    toggleButton,
    multiLang,
    relation,
    userBasicData,
    displayMedia,
    qrCode
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
      edit: false,
      deleteConfirm: false,
      selectedLang: '',
      ancestors: [],
      entity: {},
      contents: [],
      editorItems: [],
      displayItems: []
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
      this.edit = false
      this.selectedLang = this.$store.state.main.config.langs[0]
      this.getEntity(id)
    },
    getEntity: async function (id) {
      // Get Entity
      this.editorItems = []
      let home
      let entityId = id ? id : this.$route.params.id

      let relations
      let relationsResult
      if (this.$store.state.main.user.id) {
        relationsResult = await Connection.get(`/entity/${this.$store.state.main.user.id}/relations?fields=e.id,r.kind`)
      }
      if (relationsResult.success) {
        relations = relationsResult.data
        for (let r = 0; r < relations.length; r++) {
          if (relations[r].relation.kind === 'home') {
            if (!entityId) {
              entityId = relations[r].id
            }
            home = relations[r].id
          }
        }
      } else {
        this.loading = false
      }

      if (!entityId) {
        return
      }
      let entityResult = await Connection.get(`/entity/${entityId}?lang=${this.selectedLang}`)
      if (entityResult.success) {
        this.entity = entityResult.data
      }

      // Get ancestors
      let homeDepth
      let ancestorsResult = await Connection.get(`/entity/${this.entity.id}/ancestors?fields=e.id,e.name,r.depth&order=r.depth:desc`)
      if (ancestorsResult.success) {
        this.ancestors = []
        if (home !== this.entity.id) {
          for (let a = 0;a < ancestorsResult.data.length;a++) {
            if (ancestorsResult.data[a].id === home){
              homeDepth = ancestorsResult.data[a].relation.depth
              for (let d = 0;d < ancestorsResult.data.length;d++) {
                if (ancestorsResult.data[d].relation.depth <= homeDepth) {
                  this.ancestors.push(ancestorsResult.data[d])
                }
              }
            }
          }
        }
      }

      //Set models
      this.modelEditor()

      if (this.entity.name === '') {
        this.edit = true
      }
      this.loading = false
    },
    saveEntity: async function () {
      this.loading = true

      //CHECK FOR LANG
      let data
      let contents = this.entity.contents
      this.entity.contents = []
      for (let i = 0; i < Object.keys(contents).length; i++) {
        data = {'lang': this.selectedLang, 'field': Object.keys(contents)[i], 'value': Object.values(contents)[i]}
        this.entity.contents.push(data)
      }
      let saveResult = await Connection.patch(`/entity/${this.entity.id}`, this.entity)
      this.loading = false
      if (saveResult.success) {
        Notifications.notifySuccess(this.$t(`${this.entity.name} updated succesfully`))
        setTimeout(() => this.getEntity(), 1500)
      } else {
        Notifications.notifyError(this.$t(`${this.entity.name} failed at update`))
      }
    },
    deleteEntity: async function (entity) {
      this.deleteConfirm = false
      this.loading = true
      // let descendantsResult = await Connection.get(`/entity/${entity}/descendants?fields=e.id`)
      // if (descendantsResult.success) {
      //  for (let i = 0; i < descendantsResult.data.length; i++) {
      //     let deleteDescendantsResult = await Connection.delete(`/entity/${descendantsResult.data[i].id}`)
      //     if (!deleteDescendantsResult.success) {
      //       Notifications.notifyError(this.$t(`An error was thrown while deleting a descendant`))
      //       return;
      //     }
      //   }
      // }
      let deleteEntityResult = await Connection.delete(`/entity/${entity}`)
      this.loading = false
      if (deleteEntityResult.success) {
        Notifications.notifySuccess(this.$t(`The entity was deleted successfully`))
        setTimeout(() => this.$router.push({name: routes.content.name, params: {id: this.entity.parent}}), 1500)
      } else {
        Notifications.notifyError(this.$t(`Couldn't delete the selected entity`))
      }
    },
    modelEditor: async function () {
      let data
      let configModels = this.$store.state.main.config.models
      if (configModels[this.entity.model]) {
        this.editorItems = configModels[this.entity.model].editor
        this.displayItems = configModels[this.entity.model].display
      }
    }
  }
}
</script>
<style>
  .dark{
    color: #000000;
    cursor: pointer;
  }
</style>
