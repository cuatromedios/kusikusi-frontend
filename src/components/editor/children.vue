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
            @click.native="$router.push(`/content/edit/${children.id}`)"
            class="dark">
      <q-item>
        <q-item-side>
          <q-checkbox v-model="checkDeleteContent" color="primary" :val="children.id" @input="disableContentButton"/>
        </q-item-side>
        <q-item-main>
          <strong style="color: #0071bc;">- {{ children.name }}</strong>
        </q-item-main>
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
      children: [],
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

      let childrenResult
      // CHECK FILTER
      if (this.filter === undefined) {
        childrenResult = await Connection.get(`/entity/${entityId}/children?fields=e.id,e.name`)
      } else {
        childrenResult = await Connection.get(`/entity/${entityId}/children?fields=e.id,e.name&filter=${this.filter}`)
      }
      if (childrenResult.success) {
        this.children = childrenResult.data
      }
    },
    createEntity: async function (model) {
      this.loading = true
      this.newEntity.parent = this.entity.id
      this.newEntity.model = model
      this.newEntity.name = 'entidad'
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
        let descendantsResult = await Connection.get(`/entity/${entity[i]}/descendants?fields=e.id`)
        if (descendantsResult.success) {
          for (let i = 0; i < descendantsResult.data.length; i++) {
            let deleteDescendantsResult = await Connection.delete(`/entity/${descendantsResult.data[i].id}`)
            if (!deleteDescendantsResult.success) {
              Notifications.notifyError(this.$t(`An error was thrown while deleting a descendant`))
              return
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
      this.disable = true
      setTimeout(() => this.getChildren(), 1500)
    },
    disableContentButton: function () {
      this.checkDeleteContent.length === 0 ? this.disable = true : this.disable = false
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
