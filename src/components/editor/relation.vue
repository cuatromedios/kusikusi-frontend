<template>
  <q-collapsible icon="fa-vector-square" label="Relaciones" opened header-class="bg-primary text-white icon-white" class="q-my-md">
    <q-btn-group push class="q-ma-lg">
      <q-btn push color="tertiary" @click="createRelation = true" :loading="loading" >{{ 'content.media' | translate }}</q-btn>
      <q-btn push color="red" :loading="loading" @click="deleteRelation(checkDeleteRelation)" :disable="disable">eliminar relacion</q-btn>
    </q-btn-group>
    <q-list
      v-for="relation in this.relations"
      v-bind:key="relation.id"
      class="dark">
      <q-item>
        <q-item-side>
          <q-checkbox v-model="checkDeleteRelation" color="primary" :val="[relation.id, relation.kind]" @input="disableRelationButton"/>
        </q-item-side>
        <q-item-main
          @click.native="$router.push(`/content/edit/${relation.id}`)">
          <strong style="color: #0071bc;">- {{ relation.name }}</strong>
        </q-item-main>
        <q-item-side>
          <q-select
            multiple
            chips
            inverted
            dark
            color="primary"
            float-label="Etiquetas:"
            v-model="relation.tags"
            :options="selectableTags"
            @input="updateTag(relation.id, relation.tags, relations.kind)"
          />
        </q-item-side>
      </q-item>
    </q-list>
    <q-modal v-model="createRelation" :content-css="{minWidth: '80vw', minHeight: '80vh'}" @hide="createRelation = false">
      <q-list
        v-for="item in this.availableChildren"
        v-bind:key="item.id"
        class="dark">
        <q-item>
          <q-item-side>
            <q-checkbox v-model="checkDeleteRelation" color="primary" :val="item.id" @input="quickRelate"/>
          </q-item-side>
          <q-item-main
            @click.native="$router.push(`/content/edit/${item.id}`)">
            <strong style="color: #0071bc;">- {{ item.name }}</strong>
          </q-item-main>
          <q-item-side>
          </q-item-side>
        </q-item>
      </q-list>
      <q-btn class="q-ma-lg absolute-top-right" round color="negative" @click="createRelation = false" icon="fa-times" size="xs"></q-btn>
    </q-modal>
  </q-collapsible>
</template>

<script>
import Connection from '../../Connection'
import Notifications from '../notifications.js'
export default {
  name: 'Relations',
  mounted () {
    this.getRelations()
  },
  props: {
    entity: {
      default: () => {
        return {}
      },
      type: Object
    },
    kind: {},
    tags: {},
    childrenOf: {
      default: ''
    },
    reload: {}
  },
  data () {
    return {
      loading: false,
      disable: true,
      createRelation: false,
      checkDeleteRelation: [],
      relations: [],
      selectableTags: [],
      availableChildren: []
    }
  },
  methods: {
    getRelations: async function () {
      let relationsResult
      let data
      let tag
      for (let i = 0; i < this.kind.length; i++) {
        relationsResult = await Connection.get(`/entity/${this.entity.id}/relations/${this.kind[i]}?fields=e.id,e.name,r.tags,r.kind`)
        if (relationsResult) {
          for (let r = 0; r < relationsResult.data.length; r++) {
            data = {'id': relationsResult.data[r].id, 'name': relationsResult.data[r].name, 'tags': relationsResult.data[r].relation.tags, 'kind': relationsResult.data[r].relation.kind}
            this.relations.push(data)
          }
        }
      }
      for (let t = 0; t < this.tags.length; t++) {
        tag = {'label': this.tags[t], 'value': this.tags[t]}
        this.selectableTags.push(tag)
      }

      // CHILDREN OF
      let child
      let availableChildrenResult = await Connection.get(`/entity/${this.childrenOf}/children?fields=e.id,e.name`)
      if (availableChildrenResult) {
        for (let c = 0; c < availableChildrenResult.data.length; c++) {
          child = {'name': availableChildrenResult.data[c].name, 'id': availableChildrenResult.data[c].id}
          this.availableChildren.push(child)
        }
      }
      console.log(this.availableChildren)
    },
    deleteRelation: async function (entity) {
      for (let i = 0; i < entity.length; i++) {
        console.log(`/entity/${this.entity.id}/relations/${entity[i][0]}/${entity[i][1]}`)
        this.loading = true
        let deleteRelationResult = await Connection.delete(`/entity/${this.entity.id}/relations/${entity[i][0]}/${entity[i][1]}`)
        if (deleteRelationResult.success) {
          this.loading = false
          Notifications.notifySuccess(this.$t(`Relation deleted successfully`))
        } else {
          this.loading = false
          Notifications.notifyError(this.$t(`Couldn't delete the relation selected`))
        }
      }
      this.checkDeleteRelation = []
      this.disable = true
      setTimeout(() => this.reload(), 1500)
    },
    disableRelationButton: function () {
      this.checkDeleteRelation.length === 0 ? this.disable = true : this.disable = false
      console.log(this.checkDeleteRelation)
    },
    updateTag: async function (id, tags, kind) {
      // console.log(tags)
      let data = {
        'kind': kind,
        'id': id,
        'tags': tags
      }
      let updateTagsResult = await Connection.post(`/entity/${this.entity.id}/relations`, data)
      if (!updateTagsResult.success) {
        Notifications.notifyError(this.$t(`Fail at updating tags`))
      }
    },
    quickRelate: async function () {
    }
  }
}
</script>

<style scoped>

</style>
