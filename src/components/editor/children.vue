<template>
  <div class="q-my-md">
    <h4>{{ label }}</h4>
    <q-btn-group push class="q-ma-lg">
      <q-btn-dropdown push color="tertiary" :label="'content.save child' | translate" :loading="loading">
        <q-list link>
          <q-item v-for="model in this.allowed" :key="model" @click.native="createEntity(model)">
            <q-item-tile label style="color: #000000;">{{ model }}</q-item-tile>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn push color="red" :loading="loading" @click="deleteEntities(checkDeleteContent)" :disable="disable">{{ 'content.delete' | translate }}</q-btn>
    </q-btn-group>
    <q-list
            v-for="children in this.children"
            v-bind:key="children.id"
            class="dark">
      <q-item>
        <q-item-side>
          <q-checkbox v-model="checkDeleteContent" color="primary" :val="children.id" @input="disableContentButton"/>
        </q-item-side>
        <q-item-main @click.native="$router.push(`/content/edit/${children.id}`)">
          <strong style="color: #0071bc;">- {{ children.name }}</strong>
        </q-item-main>
        <q-item-side right>
          <q-select
             multiple
             chips
             inverted
             dark
             color="primary"
             float-label="Etiquetas:"
             v-model="children.tags.tags"
             :options="selectableTags"
             @input="updateTag(children.id, children.tags.tags)"
           />
        </q-item-side>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import Connection from '../../Connection'
import { routes } from '../../router/routes'
import Notifications from '../notifications.js'
export default {
  name: 'Children',
  mounted () {
    this.getChildren()
  },
  props: {
    label: {
      default: '',
      type: String
    },
    allowed: {
      default: []
    },
    filter: {},
    tags: {},
    entity: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      disable: true,
      checkDeleteContent: [],
      selectableTags: [],
      children: [],
      relationChild: [],
      newEntity: {
        model: '',
        name: '',
        parent: '',
        created_by: '',
        updated_by: '',
        contents: [],
        data: {}
      }
    }
  },
  methods: {
    getChildren: async function () {
      let entityId
      if (this.$route.params.id === ' ' || this.$route.params.id === undefined) {
        entityId = this.entity.id
      } else {
        entityId = this.$route.params.id
      }
      this.children = []
      this.selectableTags = []

      let childrenResult
      let tag
      let relationsTags
      let relationChildResult
      // CHECK FILTER
      if (this.filter === undefined) {
        childrenResult = await Connection.get(`/entity/${entityId}/children?fields=e.id,e.name`)
      } else {
        childrenResult = await Connection.get(`/entity/${entityId}/children?fields=e.id,e.name&filter=${this.filter}`)
      }
      if (childrenResult.success) {
        this.children = childrenResult.data
        for (let c = 0; c < this.children.length; c++) {
          relationChildResult = await Connection.get(`/entity/${this.children[c].id}/relations/ancestor?fields=e.id,r.tags`)
          if (relationChildResult.success) {
            for (let r = 0; r < relationChildResult.data.length; r++) {
              if (entityId === relationChildResult.data[r].id) {
                relationsTags = {'tags': relationChildResult.data[r].relation.tags}
                this.children[c].tags = relationsTags
                if (this.children[c].tags.tags[0] === '') {
                  this.children[c].tags.tags = []
                }
              }
            }
          }
        }
      }
      if (this.tags !== undefined) {
        for (let t = 0; t < this.tags.length; t++) {
          tag = {'label': this.tags[t], 'value': this.tags[t]}
          this.selectableTags.push(tag)
        }
      }
    },
    createEntity: async function (model) {
      this.loading = true
      this.newEntity.parent = this.entity.id
      this.newEntity.model = model
      this.newEntity.name = ''
      this.newEntity.created_by = this.$store.state.main.user.id
      this.newEntity.updated_by = this.$store.state.main.user.id
      let createResult = await Connection.post('/entity', this.newEntity)
      this.loading = false
      if (createResult.success) {
        Notifications.notifySuccess(this.$t(`New entity created successfully`))
        setTimeout(() => this.$router.push({name: routes.content.name, params: {id: createResult.data.id}}), 1500)
      } else {
        Notifications.notifyError(this.$t(`Couldn´t create new entity`))
      }
    },
    deleteEntities: async function (entity) {
      for (let i = 0; i < entity.length; i++) {
        this.loading = true
        let deleteEntityResult = await Connection.delete(`/entity/${entity[i]}`)
        this.loading = false
        if (deleteEntityResult.success) {
          Notifications.notifySuccess(this.$t(`The selected entity was deleted successfully`))
        } else {
          Notifications.notifyError(this.$t(`Couldn't delete the selected entity`))
        }
      }
      this.checkDeleteContent = []
      this.disable = true
      setTimeout(() => this.getChildren(), 1500)
    },
    disableContentButton: function () {
      this.checkDeleteContent.length === 0 ? this.disable = true : this.disable = false
    },
    updateTag: async function (id, tags) {
      let data = {
        'kind': 'ancestor',
        'id': this.entity.id,
        'tags': tags,
        'depth': 1
      }
      let updateTagsResult = await Connection.post(`/entity/${id}/relations`, data)
      if (!updateTagsResult.success) {
        Notifications.notifyError(this.$t(`Fail at updating tags`))
      }
    }
  },
  watch: {
    $route (to, from) {
      setTimeout(() => this.getChildren(), 900)
    }
  }
}
</script>

<style scoped>

</style>
