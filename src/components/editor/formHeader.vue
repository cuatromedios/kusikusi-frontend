<template>
  <div :is="tag">{{ text || entityData }}</div>
</template>

<script>
export default {
  name: 'FormHeader',
  props: {
    text: String,
    field: String,
    level: {
      type: Number,
      default: 2
    },
    entity: {
      default: () => {
        return {}
      },
      type: Object
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
    },
    entityData: {
      get: function () {
        let fieldParts = this.field.split('.')
        if (fieldParts.length === 1) {
          return this.entity[fieldParts[0]]
        } else {
          return this.entity[fieldParts[0]][fieldParts[1]]
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
