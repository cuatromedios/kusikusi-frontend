<template>
  <main class="q-pb-xl">
    <lang-tabs v-if="ready" />
    <div v-if="ready">
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
               :settings="field.settings"
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
      <div transition-show="jump-down"
           class="bg-grey-8 q-py-md row justify-center fixed-bottom inset-shadow"
           >
      <q-btn flat class="q-mx-lg" @click="cancelEdit" color="grey-6">{{ $t('general.cancel') }}</q-btn>
      <q-btn color="positive" class="q-px-xl q-mx-lg" @click="saveEntity">{{ $t('general.save') }}</q-btn>
    </div>
    </transition>
  </main>
</template>
<script>
import FieldWrapper from '../components/FieldWrapper'
import LangTabs from '../components/LangTabs'
export default {
  components: { FieldWrapper, LangTabs },
  name: 'Content',
  data () {
    return {
      showLangMenu: true,
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
  watch: {
  },
  methods: {
    async getEntity () {
      let entityId = this.$route.params.entity_id
      if (entityId === 'new') {
        this.$store.dispatch('content/newEntity', { model: this.$route.params.model, parent_id: this.$route.params.parent_id })
      } else if (entityId !== this.$store.state.content.entity.id) {
        await this.$store.dispatch('content/getEntity', entityId)
      }
      this.ready = true
    },
    async saveEntity () {
      let call
      if (this.$store.state.ui.config.langs[0] && this.$store.state.content.entity.contents[this.$store.state.ui.config.langs[0]] && this.$store.state.content.entity.contents[this.$store.state.ui.config.langs[0]].title) {
        this.$store.commit('content/setEntityValue', {
          field: 'name',
          value: this.$store.state.content.entity.contents[this.$store.state.ui.config.langs[0]].title
        })
      }
      if (this.$route.params.entity_id === 'new') {
        this.$store.dispatch('content/clearId')
        call = await this.$api.post(`/entity`, this.$store.state.content.entity)
        if (call.success) {
          this.$router.push({ name: 'contentEdit', params: { entity_id: call.result.id } })
        }
      } else {
        call = await this.$api.patch(`/entity/${this.$route.params.entity_id}`, this.$store.state.content.entity)
        if (call.success) {
          this.cancelEdit()
        }
      }
    },
    async cancelEdit () {
      if (this.$route.params.entity_id === 'new') {
        this.$router.back()
      } else {
        let whereToGo
        if (this.$store.state.content.entity.parent_id === 'root') {
          whereToGo = 'home'
        } else {
          whereToGo = this.$store.state.content.entity.parent_id
        }
        this.$router.push({ name: 'content', params: { entity_id: whereToGo } })
      }
    }
  }
}
</script>
<style>
</style>
