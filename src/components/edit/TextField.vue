<template>
  <div>
    <q-input class="q-mb-sm"
             :filled="true"
             v-model="fieldReference"
             :label="$t(label)"
             :debounce="1000"
             v-bind="props"
    />
  </div>
</template>

<script>
import FieldBase from '../FieldBase.js'
export default {
  name: 'TextField',
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
