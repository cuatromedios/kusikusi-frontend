<template>
  <div class="q-my-md">
    <q-field label="Posición:" class="q-mt-md">
      <q-input v-model="entity.position" type="number" class="q-mt-md"/>
    </q-field>
    <q-field label="Publicado" class="q-mt-md">
      <q-field label="Desde:" class="q-mt-md">
        <q-datetime
           type="datetime"
           v-model="entity.publicated_at"
           color="primary"
           format="YYYY-MM-DD hh:mm:ss"
        />
      </q-field>
      <q-field label="Hasta:" class="q-mt-md">
        <q-datetime
           v-if="!check"
           type="datetime"
           v-model="entity.unpublicated_at"
           color="primary"
           format="YYYY-MM-DD hh:mm:ss"
        />
        <q-checkbox v-model="check" left-label label="Nunca:" color="primary" @input="unPublishedNever"/>
    </q-field>
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
    this.entity.unpublicated_at === '9999-12-31 23:59:59' ? this.check = true : this.check = false
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
      toggle: 'Activo',
      check: false
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
    },
    unPublishedNever: function () {
      if (this.check) {
        this.entity.unpublicated_at = '9999-12-31 23:59:59'
      }
    }
  }
}
</script>

<style scoped>

</style>
