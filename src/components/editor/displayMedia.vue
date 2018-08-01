<template>
  <div class="q-my-md">
    <img :src="src" :title="entity.name">
  </div>
</template>

<script>
import config from '../../config'
export default {
  name: 'DisplayMedia',
  mounted () {
    this.getSRC()
  },
  props: {
    entity: {
      default: () => {
        return {}
      },
      type: Object
    },
    filter: {}
  },
  data () {
    return {
      src: ''
    }
  },
  methods: {
    getSRC: async function () {
      this.src = `${config.media.url}/${this.entity.id}/thumb`
    }
  }
}
</script>

<style scoped>

</style>
