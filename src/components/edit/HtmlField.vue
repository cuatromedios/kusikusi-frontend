<template>
  <div>
    <q-editor class="q-mb-sm"
              :filled="true"
              v-model="fieldReference"
              :label="$t(label)"
              :debounce="1000"
              v-bind="props"
              min-height="5rem"
    />
  </div>
</template>

<script>
import FieldBase from '../FieldBase.js'
export default {
  name: 'HtmlField',
  mixins: [FieldBase],
  props: {
    label: {
      type: String,
      default: ''
    },
    props: {
      type: Object,
      default: () => { return {} }
    }
  }
}
</script>

<style lang="stylus">
</style>
