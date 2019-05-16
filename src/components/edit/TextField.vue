<template>
  <div>
    <q-input class="q-mb-sm"
             :type="settings.type || 'text'"
             :filled="true"
             v-model="fieldReference"
             :label="$t(label)"
             :debounce="1000"
             :autogrow="settings.autogrow || false"
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
    }
  }
}
</script>

<style lang="stylus">
</style>
