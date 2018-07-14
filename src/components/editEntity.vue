<template>
  <q-page class="q-ma-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el v-for="ancest in this.ancestors" :key="ancest.id" :label="ancest.name" @click.native="$router.push(`/content/edit/${ancest.id}`)" style="cursor: pointer;"/>
      <q-breadcrumbs-el :model="this.entity" :label="this.entity.name" />
    </q-breadcrumbs>
    <div>
      <q-collapsible icon="fa-list" label="Contenido" opened header-class="bg-primary text-white icon-white" style="width: 80vw; max-width: 80vw;" class="q-my-md" v-if="formItems.collapsible.content">
        <q-btn-group push class="q-ma-lg">
          <q-btn-dropdown push color="tertiary" :label="'content.save child' | translate" :loading="loading">
            <q-list link>
              <q-item v-for="model in this.models" :key="model.value" @click.native="createEntity(model.value)">
                <q-item-tile label style="color: #000000;">{{ model.label }}</q-item-tile>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn push color="red" :loading="loading">{{ 'content.delete' | translate }}</q-btn>
        </q-btn-group>
        <q-list
          v-for="children in this.children"
          v-bind:key="children.id"
          @click.native="$router.push(`/content/edit/${children.id}`)"
          class="dark">
          <q-item>
            <q-item-side>
              <q-checkbox v-model="checkDelete" color="blue" :val="children.id"/>
            </q-item-side>
            <q-item-main>
              <strong style="color: #0071bc;">- {{ children.name }}</strong>
            </q-item-main>
          </q-item>
        </q-list>
      </q-collapsible>
      <q-collapsible icon="fa-info" label="Información" opened header-class="bg-primary text-white icon-white" style="width: 80vw; max-width: 80vw;" class="q-my-md" v-if="formItems.collapsible.info">
        <div v-for="item in this.formItems.info"
             v-bind:key="item.label"
             :is="item.component"
             :field="item.field"
             :label="item.label"
             :params="item.params"
             :entity="entity"
             :options="models"></div>
      </q-collapsible>
      <q-collapsible icon="fa-globe" label="Publicación" header-class="bg-primary text-white icon-white" style="width: 80vw; max-width: 80vw;" class="q-my-md" v-if="formItems.collapsible.publication">
        <div v-for="item in this.formItems.publication"
             v-bind:key="item.label"
             :is="item.component"
             :field="item.field"
             :label="item.label"
             :params="item.params"
             :entity="entity"></div>
        <!--<q-toggle-->
          <!--v-model="this.checked.value"-->
        <!--/>-->
      </q-collapsible>
      <q-collapsible icon="fa-image" label="Medios" header-class="bg-primary text-white icon-white" style="width: 80vw; max-width: 80vw;" class="q-my-md" v-if="formItems.collapsible.media">
        <q-btn push class="q-my-md" color="primary" @click="createMedia = true" :loading="loading" >{{ 'content.media' | translate }}</q-btn>
        <q-list v-if="this.media !== []">
          <q-item
            v-for="media in this.media"
            v-bind:key="media.id"
            class="dark">
            <q-item-main @click.native="$router.push(`/media/edit/${media.id}`)">
              <img :src="media.src" :title="media.name">
              <q-item-tile>{{ media.name }}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </q-collapsible>
    </div>
    <q-btn-group push class="q-ma-lg">
      <q-btn push color="primary" @click="saveEntity" :loading="loading" >{{ 'content.update' | translate }}</q-btn>
      <q-btn push color="red" @click="deleteConfirm = true" :loading="loading" >{{ 'content.delete' | translate }}</q-btn>
    </q-btn-group>
    <q-modal v-model="deleteConfirm" minimized :content-css="{padding: '50px'}" @hide="deleteConfirm = false">
      <q-btn class="q-ma-lg absolute-top-right" round color="negative" @click="deleteConfirm = false" icon="fa-times" size="xs"></q-btn>
      <div class="q-display-1 q-mb-md">¿Deseas Eliminar esta entidad?</div>
      <p><strong>¡Esto eliminará también a todos sus descendientes!</strong></p>
      <q-btn push color="tertiary" @click="deleteEntity(entity.id)" :loading="loading" >{{ 'content.delete' | translate }}</q-btn>
    </q-modal>
    <q-modal v-model="createMedia" :content-css="{minWidth: '80vw', minHeight: '80vh', maxWidth: '50vw'}" @hide="createMedia = false">
      <EditMedia></EditMedia>
      <q-btn class="q-ma-lg absolute-top-right" round color="negative" @click="createMedia = false" icon="fa-times" size="xs"></q-btn>
    </q-modal>
  </q-page>
</template>

<script>
/* eslint-disable */
import Input from './formItems/input'
import Connection from '../Connection'
import { routes } from '../router/routes'
import config from '../config'
import EditMedia from './editMedia'
import Notifications from './notifications.js'
import wysiwyg from './formItems/editorWYSIWYG'
import datetime from './formItems/datetime'
import select from './formItems/select'
/* es-lint enable */

export default {
  // TODO: is active button toggle
  components: {
    EditMedia
  },
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
      deleteConfirm: false,
      createMedia: false,
      checkDelete: [],
      models: [],
      ancestors: [],
      children: [],
      media: [],
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
        created_by: '',
        updated_by: '',
        contents: {
          description: '',
          summary: '',
          title: '',
          url: '/'
        }
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
      this.media = []
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

    createEntity: async function (model) {
      this.childAuth(model)
      if (this.auth === true) {
        this.loading = true
        this.newEntity.parent = this.entity.id
        this.newEntity.model = model
        this.newEntity.name = 'Nuevo hijo'
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
      } else {
        Notifications.notifyWarning(this.$t(`Child's model not allowed`))
      }
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
    childAuth: function (model) {
      let configModels = this.$store.state.main.config.models
      if (configModels[this.entityModel]) {
        let allowedChildren = configModels[this.entityModel].allowedChildren
        for (let i = 0; i < allowedChildren.length; i++) {
          if (allowedChildren[i] === model) {
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
  home: {
    info: [
      {label: 'Título:', field: 'contents.title', component: Input},
      {label: 'Dirección de acceso:', field: 'contents.url', component: Input, params: {type: 'url'} },
      {label: 'Reseña:', field: 'contents.summary', component: Input, params: {type: 'textarea', rows: 3}},
      {label: 'Descripción:', field: 'contents.description', component: wysiwyg},
      {label: 'Modelo:', field: 'model', component: select, params: {placeholder: 'Seleccione un model:', options: this.models} },
    ],
    publication: [
      {label: 'Posición:', field: 'position', component: Input, params: {type: 'number'}},
      {label: 'Publicado:', field: 'created_at', component: datetime},
      {label: 'Actualizado:', field: 'updated_at', component: datetime},
    ],
    collapsible: {
      content: true,
      info: true,
      publication: true,
      media: true,
    }
  },
  section: {
    info: [
      {label: 'Título:', field: 'contents.title', component: Input},
      {label: 'Dirección de acceso:', field: 'contents.url', component: Input, params: {type: 'url'} },
      {label: 'Reseña:', field: 'contents.summary', component: Input, params: {type: 'textarea', rows: 3}},
      {label: 'Descripción:', field: 'contents.description', component: wysiwyg},
      {label: 'Modelo:', field: 'model', component: select, params: {placeholder: 'Seleccione un model:', options: this.models} },
    ],
    publication: [
      {label: 'Posición:', field: 'position', component: Input, params: {type: 'number'}},
      {label: 'Publicado:', field: 'created_at', component: datetime},
      {label: 'Actualizado:', field: 'updated_at', component: datetime},
    ],
    collapsible: {
      content: true,
      info: true,
      publication: true,
      media: true,
    }
  },
  page: {
    info: [
      {label: 'Título:', field: 'contents.title', component: Input},
      {label: 'Dirección de acceso:', field: 'contents.url', component: Input, params: {type: 'url'} },
      {label: 'Reseña:', field: 'contents.summary', component: Input, params: {type: 'textarea', rows: 3}},
      {label: 'Descripción:', field: 'contents.description', component: wysiwyg},
      {label: 'Modelo:', field: 'model', component: select, params: {placeholder: 'Seleccione un model:', options: this.models} },
    ],
    publication: [
      {label: 'Posición:', field: 'position', component: Input, params: {type: 'number'}},
      {label: 'Publicado:', field: 'created_at', component: datetime},
      {label: 'Actualizado:', field: 'updated_at', component: datetime},
    ],
    collapsible: {
      content: false,
      info: true,
      publication: true,
      media: true,
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
