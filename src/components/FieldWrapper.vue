<template>
  <div>
    <div v-for="lang in langs"
         class="relative-position"
         v-bind:key="lang">
      <div v-show="lang === '' || lang === $store.state.ui.editorLang || langs.length === 1">
        <div
            :is="component"
            :label="label"
            :field="field"
            :lang="lang"
            :props="props"
        >
        </div>
        <q-badge v-if="lang && lang !== ''" color="info" floating class="langBadge"  >
          <q-icon name="language" />&ensp;<span>{{ lang }}</span>
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
    props: {
      type: Object,
      default: () => { return {} }
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
.langBadge
  font-size 1.1em
  span
    font-size 1.1em
    position relative
    bottom .075em
</style>
