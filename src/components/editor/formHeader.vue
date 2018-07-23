<template>
  <div :is="tag">{{ text }}</div>
</template>

<script>
export default {
  name: 'formHeader',
  props: {
    text: String,
    level: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
    }
  },
  computed: {
    tag: function () {
      let headerLevel = this.level
      if (isNaN(this.level) || this.level < 2) {
        headerLevel = 2
      }
      return ('h' + String(headerLevel))
    }
  }
}
</script>

<style scoped>

</style>
