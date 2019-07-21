<template>
  <div>
    <q-card flat bordered class="my-card q-mb-lg">
      <q-card-section>
        <div class="text-h5">{{ title }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'Settings',
  data () {
    return {
    }
  },
  computed: {
    title () {
      return this.$t('settings.title')
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
  }
}
</script>
<style>
</style>
