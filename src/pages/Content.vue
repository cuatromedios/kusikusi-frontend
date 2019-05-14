<template>
  <main>
    <div v-if="!edit && ready">
      <div v-for="item in $store.state.ui.config.models[$store.state.content.entity.model].display"
           v-bind:key="item.index"
           :is="item.component"
           v-bind="item.props"
           class="q-mb-lg">
      </div>
    </div>
    <div v-if="edit && ready">
      edit
    </div>
  </main>
</template>
<script>
import entityCard from '../components/display/entityCard'
import children from '../components/display/children'
export default {
  components: { entityCard, children },
  name: 'Content',
  data () {
    return {
      edit: false,
      ready: false
    }
  },
  computed: {
    title () {
      return this.$t('content.title')
    }
  },
  meta () {
    return {
      title: this.title
    }
  },
  async mounted () {
    await this.getEntity()
  },
  async beforeRouteUpdate (to, from, next) {
    await this.getEntity()
    next()
  },
  watch: {
    '$route' (to, from) {
      this.getEntity()
    }
  },
  methods: {
    async getEntity () {
      this.ready = false
      this.$store.dispatch('content/clear')
      let entityId = this.$route.params.entity_id || this.$store.getters['session/firstEntityWithWithWritePermissions'] || 'home'
      let call = await this.$api.get(`/entity/${entityId}/forEdit`)
      if (call.success) {
        let groupedContents = {}
        for (let c = 0; c < call.result.entity.contents.length; c++) {
          if (!groupedContents[call.result.entity.contents[c].lang]) {
            groupedContents[call.result.entity.contents[c].lang] = {}
          }
          groupedContents[call.result.entity.contents[c].lang][call.result.entity.contents[c].field] = call.result.entity.contents[c].value
        }
        call.result.entity.contents = groupedContents
        this.$store.commit('content/setEntity', call.result.entity)
        this.$store.commit('content/setRelations', call.result.relations)
        this.$store.commit('content/setAncestors', call.result.ancestors)
        this.$store.commit('content/setChildren', call.result.children)
      }
      this.ready = true
    }
  }
}
</script>
<style>
</style>
