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
           v-bind="item.props"
           class="q-mb-lg">
      </div>
    </div>
    <q-page-sticky position="top-right" :offset="[0,0]">
      <q-btn color="primary"
             class="q-ma-md "
             icon="edit" type="a"
             :label="$t('general.edit')"
             :to="{ name: 'contentEdit', params: { entity_id: this.entityId } }"
      />
    </q-page-sticky>
  </main>
</template>
<script>
import EntityHeader from '../components/display/EntityHeader'
import Children from '../components/display/Children'
import Media from '../components/display/Media'
import FieldWrapper from '../components/FieldWrapper'
export default {
  components: { EntityHeader, Children, Media, FieldWrapper },
  name: 'Content',
  data () {
    return {
      ready: false,
      entityId: undefined
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
  watch: {
    '$route' (to, from) {
      this.getEntity()
    }
  },
  methods: {
    async getEntity () {
      this.ready = false
      this.entityId = this.$route.params.entity_id || this.$store.getters['session/firstEntityWithWithWritePermissions'] || 'home'
      await this.$store.dispatch('content/getEntity', this.entityId)
      this.ready = true
    }
  }
}
</script>
<style>
</style>
