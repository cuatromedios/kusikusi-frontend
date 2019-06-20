<template>
  <q-tabs
      v-if="this.$store.state.ui.config.langs.length > 1"
      v-model="editorLang"
      class="q-mb-lg"
  >
    <q-tab v-for="lang in langs"
           :key="lang" :name="lang">
      {{ lang }}
    </q-tab>
  </q-tabs>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    if (this.$store.state.ui.config.langs.indexOf(this.$store.state.ui.editorLang) === -1) {
      this.editorLang = this.$store.state.ui.config.langs[0]
    }
  },
  computed: {
    langs () {
      return this.$store.state.ui.config.langs
    },
    editorLang: {
      get: function () {
        return this.$store.state.ui.editorLang
      },
      set: function (value) {
        this.$store.commit('ui/setEditorLang', value)
      }
    }
  }
}
</script>
<style>

</style>
