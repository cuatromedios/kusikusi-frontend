<template>
  <div>
    <q-select class="q-mb-sm"
             :filled="true"
             v-model="fieldReference"
             :label="$t(label)"
              emit-value
              map-options
             v-bind="props"
    />
  </div>
</template>

<script>
import FieldBase from '../FieldBase.js'
export default {
  name: 'TextField',
  mixins: [FieldBase],
  props: ['label', 'props']
}
</script>

<style lang="stylus">
</style>
