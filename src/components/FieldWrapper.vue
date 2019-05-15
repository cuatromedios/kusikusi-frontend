<template>
  <div>
    <div v-for="lang in langs"
         class="relative-position"
         v-bind:key="lang">
      <q-badge v-if="lang && lang !== ''" color="info" class="absolute-top-right q-ma-xs">
        <q-icon name="language" />&ensp;{{ lang }}
      </q-badge>
      <div
           :is="component"
           :label="label"
           :field="field"
           :lang="lang"
           :settings="settings"
      >
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
      multilanguage: null
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
</style>
