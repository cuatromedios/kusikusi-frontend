<template>
  <div>
    <q-card flat bordered class="my-card q-mb-lg">
      <q-card-section>
        <div class="text-h5">{{ $t('dashboard.yourcontent') }}</div>
        <p>{{ $t('dashboard.yourcontentdescription') }}</p>
      </q-card-section>
      <q-card-section>
        <q-list bordered separator>
          <q-item clickable v-ripple
                  v-for="entity in $store.getters['session/entitiesWithPermissions']"
                  :key="entity.id"
                  :to="{name: 'contentDisplay', params: {entity_id: entity.id}}">
            <q-item-section>
              <div class="row justify-between">
                <div class="text-h6">
                  {{ entity.name || entity.model }}
                </div>
                <q-chip :color="entity.write === 'none' ? 'negative' : (entity.write === 'own' ? 'warning' : 'positive')" text-color="white" dense :icon="`lock${entity.write === 'none' ? '' : '_open'}`">{{ $t('security.'+entity.write)}}</q-chip>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
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
    // console.log('dashboard', this.$store.getters['session/hasAuthtoken'])
  }
}
</script>
<style>
</style>
