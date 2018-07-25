<template>
  <div class="q-my-md">
    <q-field :label="label" class="q-mt-md">
      <q-toggle
         v-model="toggle"
         color="primary"
         :true-value="trueValue.label"
         :false-value="falseValue.label"
         :label="toggle"
         @input="updateValue"
      />
    </q-field>
  </div>
</template>

<script>
export default {
  name: 'ToggleButton',
  mounted () {
    this.fieldReference = this.trueValue.value
  },
  props: {
    label: {
      default: '',
      type: String
    },
    field: {
      default: '',
      type: String
    },
    trueValue: {},
    falseValue: {},
    entity: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      toggle: this.trueValue.label
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
  },
  methods: {
    updateValue: function () {
      this.toggle === this.trueValue.label ? this.fieldReference = this.trueValue.value : this.fieldReference = this.falseValue.value
    }
  }
}
</script>

<style scoped>

</style>
