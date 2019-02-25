<template>
  <div>
    <q-card flat bordered class="my-card q-mb-lg">
      <q-card-section>
        <div class="text-h5">{{ $t('content.title') }}</div>
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
    this.$store.commit('main/setTitle', this.title)
  },
  async mounted () {
    let entityId = 'root'
    let apiCall = await this.$api.get(`/entity/${entityId}`)
    if (apiCall.success) {
      this.entity = apiCall.result
    }
  }
}
</script>
<style>
</style>
