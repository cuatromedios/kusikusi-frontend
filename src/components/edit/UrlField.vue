<template>
  <div>
    <q-input class="q-mb-sm"
             :filled="true"
             v-model="fieldReference"
             :label="$t(label)"
             :debounce="1000"
             v-bind="props"
             :readonly="auto"
    >
      <template v-slot:after>
        <div class="q-gutter-sm">
          <q-checkbox v-model="auto" label="Auto" />
        </div>
      </template>
    </q-input>
  </div>
</template>

<script>
import FieldBase from '../FieldBase.js'
export default {
  name: 'TextField',
  mixins: [FieldBase],
  props: ['label', 'lang', 'props'],
  data () {
    return {
      auto: false
    }
  },
  mounted () {
    if (this.$route.params.entity_id === 'new') {
      this.auto = true
    }
    this.$store.watch(
      (state, getters) => getters['content/getField'](`contents.${this.lang}.title`),
      (newValue, oldValue) => {
        if (this.auto) {
          let parentUrl = this._.trimEnd(this.parentUrl, '/')
          let slug = this._.slugify(newValue, this.lang)
          this.$store.commit('content/setEntityValue', { field: `contents.url`, value: `${parentUrl}/${slug}`, lang: this.lang })
        }
      }
    )
  },
  methods: {
  },
  computed: {
    parentUrl () {
      if (this._.get(this.$store, 'state.content.ancestors')) {
        let parent = this.$store.state.content.ancestors[this.$store.state.content.ancestors.length - 1]
        return this._.get(parent, `contents.${this.lang}.url`, '')
      }
      return ''
    }
  }
}
</script>

<style lang="stylus">
</style>
