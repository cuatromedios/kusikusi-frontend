<template>
  <q-page class="q-pa-md">
    <q-item>
      <q-item-main style="color: #2e3436;">
        <div>
          <q-field :label="user.data.name" style="width: 500px; max-width: 50vw;">
            <q-input :autofocus="true" v-model="user.model" :label="user.model" style="width: 500px; max-width: 80vw;"/>
            <q-input v-model="user.name" :label="user.name" style="width: 500px; max-width: 80vw;"/>
            <q-input v-model="user.parent" :label="user.parent" style="width: 500px; max-width: 80vw;"/>
            <q-input v-model="user.data.name" :label="user.data.name" style="width: 500px; max-width: 80vw;"/>
            <q-input v-model="user.data.email" :label="user.data.email" style="width: 500px; max-width: 80vw;"/>
          </q-field>
        </div>
        <q-collapsible icon="fa-user" label="Permisos" v-if="this.$route.params.id" style="color: #2e3436; -webkit-text-fill-color: #2e3436;" color="primary">
          <div>
            <q-input v-model="permission.entityId" float-label="Permiso sobre:" style="width: 300px; max-width: 80vw;"/>
            Derechos de lectura:
            <q-btn-toggle
              v-model="permission.get"
              toggle-color="primary"
              :options="[
        {label: 'none', value: 'none'},
        {label: 'own', value: 'own'},
        {label: 'any', value: 'any'}
      ]"
              class="q-ma-md"
            />
            Derechos de edicion:
            <q-btn-toggle
              v-model="permission.post"
              toggle-color="primary"
              :options="[
        {label: 'none', value: 'none'},
        {label: 'own', value: 'own'},
        {label: 'any', value: 'any'}
      ]"
              class="q-ma-md"
            />
            <q-btn color="primary" @click="nuevoUsuario" :loading="loading">Agregar Usuario</q-btn>
          </div>
        </q-collapsible>
      </q-item-main>
    </q-item>
  </q-page>
</template>

<style>
</style>

<script>
import Connection from '../Connection'
export default {
  name: 'editUser',
  mounted () {
    this.getPermission()
  },
  data () {
    return {
      loading: false,
      user: {
        name: '',
        model: '',
        parent: '',
        data: {
          name: '',
          email: ''
        }
      },
      permission: {}
    }
  },
  methods: {
    getPermission: async function () {
      let permissionResult = await Connection.get(`/user/${this.$route.params.id}/permission`)
      if (permissionResult.success) {
        this.user = permissionResult.data
      }
    }
  }
}
</script>
