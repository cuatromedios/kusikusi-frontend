<template>
  <div>
    <q-field label="Nombre:" class="q-mt-md">
      <q-input v-model="entity.data.name" type="text" class="q-mt-md"/>
    </q-field>
    <q-field label="Correo:" class="q-mt-md">
      <q-input v-model="entity.data.email" type="email" class="q-mt-md"/>
    </q-field>
    <q-field label="Contraseña:" class="q-mt-md">
      <q-input v-model="entity.data.password" type="password" class="q-mt-md"/>
    </q-field>
  </div>
</template>

<script>
export default {
  name: 'UserBasicData',
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
    }
  }
}
</script>

<style scoped>

</style>
