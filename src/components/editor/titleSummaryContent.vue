<template>
  <div>
    <q-field label="Titulo" class="q-mt-md">
      <q-input ref="field" v-model="fieldReference" :type="params.type" :rows="params.rows" class="q-mt-md" style="width: 500px; max-width: 90vw;"/>
    </q-field>
    <q-field label="Summary" class="q-mt-md">
      <q-input ref="field" v-model="fieldReference" :type="params.type" :rows="params.rows" class="q-mt-md" style="width: 500px; max-width: 90vw;"/>
    </q-field>
    <q-field label="Content" class="q-mt-md">
      <q-input ref="field" v-model="fieldReference" :type="params.type" :rows="params.rows" class="q-mt-md" style="width: 500px; max-width: 90vw;"/>
    </q-field>
  </div>
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
    entity: {
      default: () => {
        return {}
      },
      type: Object
    },
    params: {
      default: () => {
        return {
          type: 'text',
          rows: 3
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
