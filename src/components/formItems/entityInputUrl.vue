<template>
  <el-form-item :label="label">
    <el-input ref="field" v-model="fieldModel" />
  </el-form-item>
</template>

<script>
// import getSlug from 'speakingurl'
export default {
  name: 'kkInput',
  props: {
    field: {
      default: '',
      type: String
    },
    label: {
      default: '',
      type: String
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
          reference: 'contents.title'
        }
      },
      type: Object
    }
  },
  data () {
    return {
    }
  },
  watch: {
    fieldReference: function (val) {
      // let friendly = getSlug(val)
      // this.fieldModel = friendly
    }
  },
  computed: {
    fieldReference: {
      get: function () {
        let fieldParts = this.params.reference.split('.')
        if (fieldParts.length === 1) {
          return (this.entity[fieldParts[0]]).toLowerCase()
        } else {
          return this.entity[fieldParts[0]][fieldParts[1]].toLowerCase()
        }
      }
    },
    fieldModel: {
      // TODO: There must be a better way to do this
      get: function () {
        let fieldParts = this.field.split('.')
        if (fieldParts.length === 1) {
          return (this.entity[fieldParts[0]]).toLowerCase()
        } else {
          return this.entity[fieldParts[0]][fieldParts[1]].toLowerCase()
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
