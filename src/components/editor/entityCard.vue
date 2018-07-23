<template>
  <q-list>
    <q-item>
      <q-item-main style="color: black;">
        <q-item-tile>
          <div :is="tag">{{ entity.contents.title }}</div>
        </q-item-tile>
        <q-item-tile>
          <p>{{ entity.contents.summary }}</p>
        </q-item-tile>
      </q-item-main>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'EntityCard',
  props: {
    titleSize: {
      type: Number,
      default: 3
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
      let headerLevel = this.titleSize
      if (isNaN(this.titleSize) || this.titleSize < 2) {
        headerLevel = 2
      }
      return ('h' + String(headerLevel))
    }
  }
}
</script>

<style scoped>

</style>
