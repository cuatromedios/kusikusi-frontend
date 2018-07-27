<template>
  <q-field :label="label" class="q-my-md">
    <q-select
      class="q-my-md"
      inverted
      dark
      v-model="fieldReference"
      separator
      :placeholder="placeholder"
      :options="options"
    />
  </q-field>
</template>

<script>
export default {
  name: 'SelectInput',
  props: {
    field: {
      default: '',
      type: String
    },
    label: {
      default: '',
      type: String
    },
    placeholder: {
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
