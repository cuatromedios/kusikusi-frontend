<template>
  <div>
    <q-toggle class="q-mb-sm"
             :filled="true"
             v-model="fieldReference"
             :label="$t(label)"
             :debounce="500"
             v-bind="props"
    />
  </div>
</template>

<script>
import FieldBase from '../FieldBase.js'
export default {
  name: 'BooleanField',
  mixins: [FieldBase],
  props: ['label', 'props']
}
</script>

<style lang="stylus">
</style>
