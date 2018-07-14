<template>
  <q-field :label="label" style="width: 600px; max-width: 90vw;" class="q-my-md">
    <q-select
      style="width: 30vw; max-width: 90vw;"
      class="q-my-md"
      inverted
      dark
      v-model="fieldReference"
      separator
      :placeholder="params.placeholder"
      :options="options"
    />
  </q-field>
</template>

<script>
export default {
  name: 'Input',
  props: {
    field: {
      default: '',
      type: String
    },
    label: {
      default: '',
      type: String
    },
    options: {
      default: []
    },
    entity: {
      default: () => {
        return {}
      },
      type: Object
    },
    params: {
      default: () => {
        return {
          placeholder: '',
          options: []
        }
      },
      type: Object
    }
  },
  data () {
    return {
    }
  },
  computed: {
    fieldReference: {
      get: function () {
        let fieldParts = this.field.split('.')
        if (fieldParts.length === 1) {
          return this.entity[fieldParts[0]]
        } else {
          return this.entity[fieldParts[0]][fieldParts[1]]
        }
      },
      set: function (value) {
        let fieldParts = this.field.split('.')
        if (fieldParts.length === 1) {
          this.entity[fieldParts[0]] = value
        } else {
          this.entity[fieldParts[0]][fieldParts[1]] = value
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
