<template>
  <q-tabs
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
      checkedLangs: {
        fr: true,
        de: false
      }
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
