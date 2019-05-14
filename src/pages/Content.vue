<template>
  <div>
    <q-card flat bordered class="my-card q-mb-lg">
      <q-card-section>
        <div class="text-h5">{{ entity.name || entity.model }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'Content',
  data () {
    return {
      entity: {
        contents: {}
      },
      relations: [],
      ancestors: []
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
    // TODO: A single call?
    await this.getEntity()
  },
  beforeMount () {
    this.$store.commit('ui/setTitle', this.title)
  },
  methods: {
    async getEntity () {
      this.$store.dispatch('content/clear')
      let entityId = this.$route.params.entity_id || this.$store.getters['session/firstEntityWithWithWritePermissions'] || 'home'
      let call = await this.$api.get(`/entity/${entityId}?select=contents.*,entity.*,data.*`)
      if (call.success) {
        this.$store.commit('content/setEntity', call.result)
        await this.getRelations()
        await this.getAncestors()
        await this.getChildren()
      }
    },
    async getRelations () {
      let call = await this.$api.get(`/entity/${this.$store.state.content.entity.id}/relations`)
      if (call.success) {
        this.$store.commit('content/setRelations', call.result)
      }
    },
    async getAncestors () {
      let call = await this.$api.get(`/entity/${this.$store.state.content.entity.id}/ancestors`)
      if (call.success) {
        this.$store.commit('content/setAncestors', call.result)
      }
    },
    async getChildren () {
      let call = await this.$api.get(`/entity/${this.$store.state.content.entity.id}/children`)
      if (call.success) {
        this.$store.commit('content/setChildren', call.result)
      }
    }
  }
}
</script>
<style>
</style>
