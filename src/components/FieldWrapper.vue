<template>
  <div>
    <div v-for="lang in langs"
         class="relative-position"
         v-bind:key="lang">
      <div v-show="lang === '' || lang === $store.state.ui.editorLang">
        <div
            :is="component"
            :label="label"
            :field="field"
            :lang="lang"
            :settings="settings"
        >
        </div>
        <q-badge v-if="lang && lang !== ''" color="info" floating class="langBadge" @click="showLangMenu = true" >
          <q-icon name="language" />&ensp;{{ lang }}
        </q-badge>
      </div>
    </div>
  </div>
</template>

<script>
import TextField from './edit/TextField'
export default {
  components: { TextField },
  name: 'FieldWrapper',
  props: {
    label: {
      type: String,
      default: ''
    },
    field: {
      type: String,
      default: null
    },
    settings: {
      type: Object,
      default: () => {}
    },
    component: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      multilanguage: null,
      showLangMenu: false
    }
  },
  computed: {
    langs () {
      let fieldParts = this.field.split('.')
      if (fieldParts[0] === 'contents' && fieldParts.length > 1) {
        return this.$store.state.ui.config.langs
      } else {
        return ['']
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus">
.langBadge
  font-size 1.25em
</style>
