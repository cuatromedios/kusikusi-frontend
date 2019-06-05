<template>
  <main class="q-pb-xl">
    <q-card flat bordered class="my-card q-mb-lg entity-card" v-if="!ready">
      <q-card-section>
        <q-banner dense rounded class="bg-grey-2 q-mb-xs placeholder ph-subtitle"></q-banner>
        <q-banner rounded class="bg-grey-4 q-mb-xs placeholder ph-title"></q-banner>
        <q-banner dense rounded class="bg-grey-2 placeholder ph-summary"></q-banner>
      </q-card-section>
      <div class="fade-screen"></div>
    </q-card>
    <div v-if="ready">
      <div v-for="item in $store.state.ui.config.models[$store.state.content.entity.model].display"
           v-bind:key="item.index"
           :is="item.component"
           :settings="item.settings"
           @edit="editEntity"
           class="q-mb-lg">
      </div>
    </div>
  </main>
</template>
<script>
import EntityCard from '../components/display/EntityCard'
import Children from '../components/display/Children'
import FieldWrapper from '../components/FieldWrapper'
export default {
  components: { EntityCard, Children, FieldWrapper },
  name: 'Content',
  data () {
    return {
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
  methods: {
    async getEntity () {
      this.ready = false
      let entityId = this.$route.params.entity_id || this.$store.getters['session/firstEntityWithWithWritePermissions'] || 'home'
      await this.$store.dispatch('content/getEntity', entityId)
      this.ready = true
    },
    editEntity () {
      this.$router.push({ name: 'contentEdit', params: { entity_id: this.$route.params.entity_id } })
    }
  }
}
</script>
<style>
</style>
