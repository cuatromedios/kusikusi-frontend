<template>
  <article>
    <h1>{{ title }}</h1>
    <div v-loading="loading">

      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="ancestor in this.ancestors"
          :key="ancestor.id"
          :to="{ name: 'content', params: { id: ancestors.id }}">
          {{ ancestor.name }}
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'content', params: { id: entity.id }}">{{ entity.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <br>

      <h2>Update</h2>
      <el-form label-width="100px" :model="entity" :inline="true">
        <el-form-item label="Title">
          <el-input v-model="entity.contents.title"></el-input>
        </el-form-item>
        <el-form-item label="">
          <loading-button label="Save" type="primary" @click="saveEntity" :loading="loading"></loading-button>
        </el-form-item>
      </el-form>

      <h2>Children</h2>
      <ul>
        <li v-for="child in this.children" :key="child.id">
          <router-link :to="{ name: 'content', params: { id: child.id }}">{{ child.name }}</router-link>
          <small><el-button size="mini" @click="deleteEntity(child.id)">delete</el-button></small>
        </li>
      </ul>

      <h3>Create</h3>
      <el-form label-width="100px" :model="newEntity" :inline="true">
        <el-form-item label="Title">
          <el-input v-model="newEntity.contents.title"></el-input>
        </el-form-item>
        <el-form-item label="Model">
          <el-input v-model="newEntity.model"></el-input>
        </el-form-item>
        <el-form-item >
          <loading-button label="Create" type="primary" @click="createEntity" :loading="loading"></loading-button>
        </el-form-item>
      </el-form>

      <h2>Relations</h2>
      <ul>
        <li v-for="relation in this.relations" :key="relation.id + '-' + relation.relation.kind">
          {{ relation.relation.kind }} | <router-link :to="{ name: 'content', params: { id: relation.id }}">{{ relation.name }}</router-link>
          <small><el-button size="mini" @click="deleteRelation(relation.id, relation.relation.kind)">delete relation</el-button></small>
        </li>
      </ul>
      <h3>Create</h3>
      <el-form label-width="100px" :model="newRelation" :inline="true">
        <el-form-item label="ID">
          <el-input v-model="newRelation.id"></el-input>
        </el-form-item>
        <el-form-item label="Kind">
          <el-input v-model="newRelation.kind"></el-input>
        </el-form-item>
        <el-form-item >
          <loading-button label="Create" type="primary" @click="createRelation" :loading="loading"></loading-button>
        </el-form-item>
      </el-form>
    </div>
  </article>
</template>

<script>
import Connection from '@/Connection'
import LoadingButton from './elements/LoadingButton'
import { routes } from '@/router'
export default {
  components: {LoadingButton},
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
      title: this.$t('content.title'),
      loading: true,
      entity: {
        contents: {},
        data: {},
        relations: []
      },
      children: [],
      relations: [],
      ancestors: [],
      newEntity: {
        model: 'page',
        parent: '',
        contents: {},
        data: {},
        relations: []
      },
      newRelation: {
        id: '',
        kind: 'relation'
      }
    }
  },
  methods: {
    getEntity: async function () {
      // Get Entity
      let entityId
      if (!this.$route.params.id) {
        let relations
        if (this.$store.state.user.id) {
          // TODO: If not entity id is set in the url
          let relationsResult = await Connection.get(`/entity/${this.$store.state.user.id}/relations?fields=e.id,r.kind`)
          relations = relationsResult.data
        }
        for (let r = 0; r < relations.length; r++) {
          if (relations[r].relation.kind === 'home') {
            entityId = relations[r].id
          }
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
        this.title = this.entity.name
      }

      // Get children
      let childrenResult = await Connection.get(`/entity/${this.entity.id}/children`)
      if (childrenResult.success) {
        this.children = childrenResult.data
      }

      // Get relations
      let relationResult = await Connection.get(`/entity/${this.entity.id}/relations`)
      if (relationResult.success) {
        this.relations = relationResult.data
      }

      // Get ancestors
      let ancestorsResult = await Connection.get(`/entity/${this.entity.id}/ancestors`)
      if (ancestorsResult.success) {
        this.ancestors = ancestorsResult.data
      }

      this.loading = false
    },
    saveEntity: async function () {
      this.loading = true
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
    },
    deleteEntity: async function (id) {
      this.loading = true
      let createResult = await Connection.delete(`/entity/${id}`)
      this.loading = false
      if (createResult.success) {
        this.$message({message: 'The entity was delete', type: 'success'})
        this.getEntity()
      } else {
        this.$message.error({message: 'There was a problem deleting the entity.'})
      }
    },
    deleteRelation: async function (id, kind) {
      this.loading = true
      let createResult = await Connection.delete(`/entity/${this.entity.id}/relations/${id}/${kind}`)
      this.loading = false
      if (createResult.success) {
        this.$message({message: 'The relation was delete', type: 'success'})
        this.getEntity()
      } else {
        this.$message.error({message: 'There was a problem deleting the relation.'})
      }
    },
    createRelation: async function () {
      this.loading = true
      let createResult = await Connection.post(`/entity/${this.entity.id}/relations`, this.newRelation)
      this.loading = false
      if (createResult.success) {
        this.$message({message: 'The relation', type: 'success'})
        this.getEntity()
      } else {
        this.$message.error({message: 'There was a problem creating the relation.'})
      }
    },
    goContent: function (id) {
      this.$router.push({ name: routes.content.name }, id)
    }
  }
}
</script>

<style scoped>

</style>
