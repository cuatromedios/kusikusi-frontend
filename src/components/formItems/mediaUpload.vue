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
  name: 'Input',
  props: {
    label: {
      default: '',
      type: String
    },
    action: {},
    trigger: {}
  },
  data () {
    return {
      extensions: ['.jpg', '.png', '.gif']
    }
  }
}
</script>

<style>
</style>
