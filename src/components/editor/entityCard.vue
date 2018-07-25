<template>
  <q-list>
  <q-btn color="tertiary" size="md" class="q-ma-md float-right" v-model="localEdit" @click="localEdit = true"><q-icon name="fa-edit" color="white" /></q-btn>
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
    edit: {},
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
    },
    localEdit: {
      get: function () {
        return this.edit
      },
      set: function (update) {
        this.$emit('update:edit', update)
      }
    }
  }
}
</script>

<style scoped>

</style>
