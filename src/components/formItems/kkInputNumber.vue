<template>
    <el-form-item :label="label">
        <el-input-number ref="field" v-model="fieldReference" :min="params.min" :max="params.max" />
    </el-form-item>
</template>

<script>
export default {
  name: 'kkInput',
  props: {
    label: {
      default: '',
      type: String
    },
    entity: {
      default: () => { return {} },
      type: Object
    },
    field: {
      default: '',
      type: String
    },
    params: {
      default: () => {
        return {
          min: 0,
          max: 10
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
      // TODO: There must be a better way to do this
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
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
