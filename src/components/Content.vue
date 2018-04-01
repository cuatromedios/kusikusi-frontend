<template>
  <article v-loading="loading">
    <h1>{{ title }}</h1>
    <EntityBreadcrumb :entity="this.entity" :ancestors="this.ancestors" />
    <el-form label-width="100px" :model="this.entity" >
      <div v-for="item in this.formItems"
           v-bind:key="item.label"
           :is="item.component"
           :field="item.field"
           :label="item.label"
           :params="item.params"
           :entity="entity" ></div>
      <el-form-item label="">
        <loading-button label="Save" type="primary" @click="saveEntity" :loading="loading"></loading-button>
      </el-form-item>
    </el-form>
  </article>
</template>

<script>
import Connection from '@/Connection'
import EntityBreadcrumb from './elements/EntityBreadcrumb'
import LoadingButton from './elements/LoadingButton'

/* eslint-disable */
import kkInput from './formItems/kkInput'
import kkUrl from './formItems/kkUrl'
import kkInputNumber from './formItems/kkInputNumber'
import ElButton from '../../node_modules/element-ui/packages/button/src/button'
/* eslint-enable */

export default {
  components: {
    EntityBreadcrumb, LoadingButton, kkInput, kkInputNumber, ElButton
  },
  name: 'Content',
  mounted () {
    this.getEntity()
  },
  watch: {
    '$route' (to, from) {
      this.getEntity()
    }
  },
  data () {
    return {
      loading: true,
      ancestors: [],
      entity: {
        contents: {},
        data: {},
        relations: []
      },
      formItems: []
    }
  },
  computed: {
    title: function () {
      return this.entity.name
    }
  },
  methods: {
    getEntity: async function () {
      // Get Entity
      let entityId
      if (!this.$route.params.id) {
        let relations
        let relationsResult
        if (this.$store.state.user.id) {
          // TODO: If not entity id is set in the url
          relationsResult = await Connection.get(`/entity/${this.$store.state.user.id}/relations?fields=e.id,r.kind`)
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
      } else {
        entityId = this.$route.params.id
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
      this.formItems = modelsEditor[this.entity.model]

      this.loading = false
    },
    saveEntity: async function () {
      this.loading = true
      console.log(this.entity)
      let saveResult = await Connection.patch(`/entity/${this.entity.id}`, this.entity)
      this.loading = false
      if (saveResult.success) {
        this.$message({message: 'The entity was saved.', type: 'success'
        })
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
        this.$message({message: 'The entity was created.', type: 'success'})
        this.getEntity()
      } else {
        this.$message.error({message: 'There was a problem creating the entity.'})
      }
    }
  }
}
const modelsEditor = {
  home: [
    { label: 'Título', field: 'contents.title', component: kkInput },
    { label: 'Reseña', field: 'contents.summary', component: kkInput, params: {type: 'textarea', rows: 3} },
    { label: 'Posición', field: 'position', component: kkInputNumber, params: {min: 5, max: 8} },
    { label: 'Posición2', field: 'position', component: kkInput },
    { label: 'Url', field: 'contents.url', component: kkUrl, params: {reference: 'contents.title'} }
  ]
}
</script>

<style scoped>
 .related-image {
   width: 32px; height: 32px;
 }
</style>
