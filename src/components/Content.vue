<template>
  <article>
    <h1>{{ 'content.title' | translate }}</h1>
    <h2>{{ this.entity.contents.title }}</h2>
    <p>{{ this.entity.contents.description }}</p>
  </article>
</template>

<script>
import Connection from '@/Connection'
export default {
  name: 'Content',
  mounted () {
    this.getEntity()
  },
  data () {
    return {
      entity: {
        contents: {},
        data: {},
        relations: []
      }
    }
  },
  methods: {
    getEntity: async function () {
      let relations
      if (this.$store.state.user.id) { // TODO: If not entity id is set in the url
        let relationsResult = await Connection.get('/entity/' + this.$store.state.user.id + '/relations?fields=e.id,r.kind')
        relations = relationsResult.data
      }
      let entityId
      for (let r = 0; r < relations.length; r++) {
        if (relations[r].relation.kind === 'home') {
          entityId = relations[r].id
        }
      }
      if (!entityId) {
        return
      }
      let entityResult = await Connection.get('/entity/' + entityId)
      if (entityResult.success) {
        this.entity = entityResult.data
      }
    }
  }
}
</script>

<style scoped>

</style>
