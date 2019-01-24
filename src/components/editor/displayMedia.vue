<template>
  <div class="q-my-md">
    <img :src="src" :title="entity.name">
  </div>
</template>

<script>
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
      this.src = `${process.env.MEDIA_URL}/${this.entity.id}/thumb`
    }
  }
}
</script>

<style scoped>

</style>
