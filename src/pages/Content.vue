<template>
  <main class="q-pb-xl">
    <lang-tabs />
    <q-card flat bordered class="my-card q-mb-lg entity-card" v-if="!edit && !ready">
      <q-card-section>
        <q-banner dense rounded class="bg-grey-2 q-mb-xs placeholder ph-subtitle"></q-banner>
        <q-banner rounded class="bg-grey-4 q-mb-xs placeholder ph-title"></q-banner>
        <q-banner dense rounded class="bg-grey-2 placeholder ph-summary"></q-banner>
      </q-card-section>
      <div class="fade-screen"></div>
    </q-card>
    <div v-if="!edit && ready">
      <div v-for="item in $store.state.ui.config.models[$store.state.content.entity.model].display"
           v-bind:key="item.index"
           :is="item.component"
           v-bind="item.props"
           @edit="edit = true"
           class="q-mb-lg">
      </div>
    </div>
    <div v-if="edit && ready">
      <div v-for="item in $store.state.ui.config.models[$store.state.content.entity.model].editor"
           v-bind:key="item.index"
           :is="item.component"
           v-bind="item.props"
           @edit="edit = true"
           class="q-mb-lg">
      </div>
      <q-card flat bordered class="q-mb-sm"
              v-for="group in $store.state.ui.config.models[$store.state.content.entity.model].editor"
              v-bind:key="group.index"
              v-bind="group.props"
              >
        <q-card-section>
          <h2>{{ $t(group.groupName) }}</h2>
          <field-wrapper v-for="field in group.fields"
               v-bind:key="field.index"
               :label="field.label"
               :field="field.field"
               :component="field.component"
               :settings="field.settins"
               >
          </field-wrapper>
        </q-card-section>
      </q-card>
    </div>
    <transition
        appear
        enter-active-class="animated slideInUp"
        leave-active-class="animated slideOutDown"
        >
      <div v-if="edit && ready"
           transition-show="jump-down"
           class="bg-grey-8 q-py-md row justify-center fixed-bottom inset-shadow"
           >
      <q-btn flat class="q-mx-lg" @click="cancelEdit" color="grey-6">{{ $t('general.cancel') }}</q-btn>
      <q-btn color="positive" class="q-px-xl q-mx-lg">{{ $t('general.save') }}</q-btn>
    </div>
    </transition>
  </main>
</template>
<script>
import EntityCard from '../components/display/EntityCard'
import Children from '../components/display/Children'
import FieldWrapper from '../components/FieldWrapper'
import LangTabs from '../components/LangTabs'
export default {
  components: { EntityCard, Children, FieldWrapper, LangTabs },
  name: 'Content',
  data () {
    return {
      edit: false,
      ready: false,
      showLangMenu: true
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
    },
    async cancelEdit () {
      this.edit = false
      this.getEntity()
    }
  }
}
</script>
<style>
</style>
