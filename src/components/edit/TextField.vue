<template>
  <div>
    <q-input class="q-mb-sm" filled v-model="fieldReference" :label="$t(label)" />
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
    lang: {
      type: String,
      default: null
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="stylus">
</style>
