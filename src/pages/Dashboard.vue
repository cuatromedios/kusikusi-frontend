<template>
  <div>
    <q-card flat bordered class="my-card q-mb-lg">
      <q-card-section>
        <div class="text-h5">{{ $t('dashboard.whattodo') }}</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6 text-info">
          {{ $t('content.title') }}
          <q-icon class="text-grey" :name="$t('content.icon')" />
        </div>
        {{ $t('dashboard.content') }}
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'Dashboard',
  data () {
    return {
    }
  },
  computed: {
    title () {
      return this.$t('dashboard.title')
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
  mounted () {
    console.log('dashboard', this.$store.getters['session/hasAuthtoken'])
  }
}
</script>
<style>
</style>
