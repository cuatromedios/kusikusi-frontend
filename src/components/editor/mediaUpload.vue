<template>
  <q-uploader
    url=""
    @add="action"
    @remove:cancel="trigger"
    :float-label="label"
    :extensions="extensions"
    hide-upload-button
    auto-expand
    style="width: 500px; max-width: 90vw;"
    class="q-mt-md"/>
</template>

<script>
export default {
  name: 'MediaUpload',
  mounted () {
    this.checkFilters()
  },
  props: {
    filter: {},
    label: {
      default: '',
      type: String
    },
    action: {},
    trigger: {}
  },
  data () {
    return {
      extensions: ''
    }
  },
  methods: {
    checkFilters: function () {
      if (this.filter !== {}) {
        this.extensions = this.filter
      }
    }
  }
}
</script>

<style>
</style>
