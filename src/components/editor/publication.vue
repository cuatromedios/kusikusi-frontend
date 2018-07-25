<template>
  <div class="q-my-md">
    <q-field label="Posición:" class="q-mt-md">
      <q-input v-model="entity.position" type="number" class="q-mt-md"/>
    </q-field>
    <q-field label="Creado en:" class="q-mt-md">
      <q-datetime
         type="datetime"
         v-model="entity.created_at"
         color="primary"
         format="YYYY-MM-DD hh:mm:ss"
      />
    </q-field>
    <q-field label="Actualizado en:" class="q-mt-md">
      <q-datetime
         type="datetime"
         v-model="entity.updated_at"
         color="primary"
         format="YYYY-MM-DD hh:mm:ss"
      />
    </q-field>
    <q-field label="Estado:" class="q-mt-md">
      <q-toggle
         v-model="toggle"
         color="primary"
         true-value="Activo"
         false-value="Inactivo"
         :label="toggle"
         @input="updateActiveValue"
      />
    </q-field>
  </div>
</template>

<script>
export default {
  name: 'Publication',
  mounted () {
    this.entity.isActive === 1 ? this.toggle = 'Activo' : this.toggle = 'Inactivo'
  },
  props: {
    entity: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      toggle: 'Activo'
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
    updateActiveValue: function () {
      this.toggle === 'Activo' ? this.entity.isActive = 1 : this.entity.isActive = 0
    }
  }
}
</script>

<style scoped>

</style>
