<template>
  <q-collapsible icon="fa-vector-square" :label="label" opened header-class="bg-primary text-white icon-white" class="q-my-md">
    <q-btn push color="tertiary" @click="createRelation = true" class="q-ma-lg absolute-top-right">{{ 'content.media' | translate }}</q-btn>
    <q-modal v-model="createRelation" :content-css="{minWidth: '80vw', minHeight: '80vh'}" @hide="createRelation = false">
      <q-list>
        <q-item
          v-for="relation in this.relations"
          v-bind:key="relation.id"
          class="dark">
          <q-item-side>
            <q-btn color="red" round icon="fa-times" size="xs" @click="quickDelete(relation.id, relation.kind)" />
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
              @input="updateRelation(relation.id, relation.position, relation.depth, relation.kind, relation.tags)"
            />
          </q-item-side>
          <q-item-side>
            <q-field label="Posicion:" class="q-mt-md">
              <q-input v-model="relation.position" type="number" class="q-mt-md" @input="updateRelation(relation.id, relation.position, relation.depth, relation.kind, relation.tags)" />
            </q-field>
          </q-item-side>
          <q-item-side>
            <q-field label="Profundidad:" class="q-mt-md">
              <q-input v-model="relation.depth" type="number" class="q-mt-md" @input="updateRelation(relation.id, relation.position, relation.depth, relation.kind, relation.tags)" />
            </q-field>
          </q-item-side>
        </q-item>
        <q-item-separator />
        <q-item>
          <q-item-side>
            <q-field label="Id:" class="q-mt-md">
              <q-input v-model="newRelation.id" type="text" class="q-mt-md" />
            </q-field>
            <q-btn push color="tertiary" @click="createNewRelation" :loading="loading" class="q-ma-lg">CREAR RELACION</q-btn>
          </q-item-side>
          <q-item-main>
            <q-select
              inverted
              dark
              color="primary"
              float-label="Tipo:"
              v-model="newRelation.kind"
              :options="selectableKinds"
            />
          </q-item-main>
          <q-item-main>
            <q-select
              multiple
              chips
              inverted
              dark
              color="primary"
              float-label="Etiquetas:"
              v-model="newRelation.tags"
              :options="selectableTags"
            />
          </q-item-main>
          <q-item-side>
            <q-field label="Posicion:" class="q-mt-md">
              <q-input v-model="newRelation.position" type="number" class="q-mt-md" />
            </q-field>
          </q-item-side>
          <q-item-side>
            <q-field label="Profundidad:" class="q-mt-md">
              <q-input v-model="newRelation.depth" type="number" class="q-mt-md" />
            </q-field>
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
    label: {
      default: 'Relaciones',
      type: String
    },
    entity: {
      default: () => {
        return {}
      },
      type: Object
    },
    kind: {},
    tags: [],
    childrenOf: {
      default: ''
    },
    reload: {}
  },
  data () {
    return {
      loading: false,
      createRelation: false,
      relations: [],
      selectableTags: [],
      selectableKinds: [],
      availableChildren: [],
      newRelation: {
        id: '',
        kind: '',
        tags: [],
        position: 0,
        depth: 0
      }
    }
  },
  methods: {
    getRelations: async function () {
      this.relations = []
      this.selectableTags = []
      this.selectableKinds = []
      this.newRelation = {
        id: '',
        kind: '',
        tags: [],
        position: 0,
        depth: 0
      }
      let relationsResult
      let data
      let tag
      let kind
      for (let i = 0; i < this.kind.length; i++) {
        relationsResult = await Connection.get(`/entity/${this.entity.id}/relations/${this.kind[i]}?fields=e.id,e.name,r.tags,r.kind,r.position,r.depth`)
        if (relationsResult) {
          for (let r = 0; r < relationsResult.data.length; r++) {
            data = {'id': relationsResult.data[r].id, 'name': relationsResult.data[r].name, 'tags': relationsResult.data[r].relation.tags, 'kind': relationsResult.data[r].relation.kind, 'position': relationsResult.data[r].relation.position, 'depth': relationsResult.data[r].relation.depth}
            this.relations.push(data)
          }
        }
      }
      for (let t = 0; t < this.tags.length; t++) {
        tag = {'label': this.tags[t], 'value': this.tags[t]}
        this.selectableTags.push(tag)
      }
      for (let k = 0; k < this.kind.length; k++) {
        kind = {'label': this.kind[k], 'value': this.kind[k]}
        this.selectableKinds.push(kind)
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
    },
    updateRelation: async function (id, position, depth, kind, tags) {
      let data = {
        'kind': kind,
        'id': id,
        'position': position,
        'depth': depth,
        'tags': tags
      }
      let updatePositionDepthResult = await Connection.post(`/entity/${this.entity.id}/relations`, data)
      if (!updatePositionDepthResult.success) {
        Notifications.notifyError(this.$t(`Fail at updating tags`))
      }
    },
    createNewRelation: async function () {
      this.loading = true
      let newRelationResult = await Connection.post(`/entity/${this.entity.id}/relations`, this.newRelation)
      this.loading = false
      if (newRelationResult.success) {
        Notifications.notifySuccess(this.$t(`Relation created successfully`))
        setTimeout(() => this.getRelations(), 1500)
      } else {
        Notifications.notifyError(this.$t(`Couldn't create the relation`))
      }
    },
    quickDelete: async function (id, kind) {
      let deleteRelation = await Connection.delete(`/entity/${this.entity.id}/relations/${id}/${kind}`)
      if (deleteRelation.success) {
        Notifications.notifySuccess(this.$t(`Relation deleted successfully`))
        setTimeout(() => this.getRelations(), 1500)
      } else {
        Notifications.notifyError(this.$t(`Couldn't delete the relation`))
      }
    }
  }
}
</script>

<style scoped>

</style>
