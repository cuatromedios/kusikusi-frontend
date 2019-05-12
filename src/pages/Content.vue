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
      }
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
  methods: {
  },
  beforeMount () {
    this.$store.commit('ui/setTitle', this.title)
  },
  async mounted () {
    let entityId = this.$route.params.entity_id || this.$store.getters['session/firstEntityWithWithWritePermissions'] || 'home'
    let apiCall = await this.$api.get(`/entity/${entityId}`)
    if (apiCall.success) {
      this.entity = apiCall.result
    }
  }
}
</script>
<style>
</style>
