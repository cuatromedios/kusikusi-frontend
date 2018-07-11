<template>
  <q-uploader
    url=""
    @add="action"
    :float-label="label"
    :extensions="extensions"
    hide-upload-button
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
    action: {}
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
