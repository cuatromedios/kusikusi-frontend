<template>
  <div class="q-my-md" style="width: 5vw;">
    <q-select
      class="q-my-md"
      inverted
      dark
      v-model="localLang"
      separator
      placeholder="Lang"
      :options="languages"
      @input="reload($route.params.id)"
    />
  </div>
</template>

<script>
export default {
  name: 'MultiLang',
  mounted () {
    this.getLangs()
  },
  props: {
    lang: {},
    reload: {}
  },
  data () {
    return {
      languages: []
    }
  },
  computed: {
    localLang: {
      get: function () {
        return this.lang
      },
      set: function (update) {
        this.$emit('update:lang', update)
      }
    }
  },
  methods: {
    getLangs: function () {
      let data
      let langs = this.$store.state.main.config.langs
      for (let i = 0; i < langs.length; i++) {
        data = {'label': langs[i], 'value': langs[i]}
        this.languages.push(data)
      }
    }
  }
}
</script>

<style scoped>

</style>
