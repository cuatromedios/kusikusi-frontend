<template>
  <q-page class="q-pa-md">
    <q-item>
      <q-item-main style="color: #2e3436;">
        <div>
          <strong style="font-size: 25px;" v-if="this.$route.params.id">{{ user.data.name }}</strong>
          <strong style="font-size: 25px;" v-if="!this.$route.params.id">Nuevo Usuario</strong>
          <q-field label="Modelo:" style="width: 500px; max-width: 50vw;">
            <q-input :autofocus="true" v-model="user.model" label="user" readonly="readonly" style="width: 500px; max-width: 80vw;"/>
          </q-field>
          <q-field label="Nombre:" style="width: 500px; max-width: 50vw;">
            <q-input v-model="user.name" :label="user.name" style="width: 500px; max-width: 80vw;"/>
          </q-field>
          <q-field label="Padre:" style="width: 500px; max-width: 50vw;">
            <q-input v-model="user.parent" label="users" readonly="readonly" style="width: 500px; max-width: 80vw;"/>
          </q-field>
          <q-field label="Nombre:" style="width: 500px; max-width: 50vw;">
            <q-input v-model="user.data.name" :label="user.data.name" style="width: 500px; max-width: 80vw;"/>
          </q-field>
          <q-field label="Correo:" style="width: 500px; max-width: 50vw;">
            <q-input v-model="user.data.email" :label="user.data.email" style="width: 500px; max-width: 80vw;"/>
          </q-field>
          <q-field label="Contraseña:" style="width: 500px; max-width: 50vw;" v-if="!this.$route.params.id">
            <q-input type="password" v-model="user.data.password" :label="user.data.password" style="width: 500px; max-width: 80vw;"/>
          </q-field>
          <q-btn color="primary" @click="Save" :loading="loading" class="q-ma-md" v-if="this.$route.params.id">Actualizar</q-btn>
          <q-btn color="negative" @click="Delete" :loading="loading" class="q-ma-md" v-if="this.$route.params.id">Desactivar</q-btn>
          <q-btn color="primary" @click="Create" :loading="loading" class="q-ma-md" v-if="!this.$route.params.id">Crear</q-btn>
        </div>
        <q-collapsible icon="fa-user" label="Permisos" v-if="this.$route.params.id" style="color: #2e3436; -webkit-text-fill-color: #2e3436;" color="primary">
          <div>
            {{ this.permission.get }}
            <q-input v-model="this.permission.entity_id" float-label="Permiso sobre:" :label="this.permission.entity_id" style="width: 300px; max-width: 80vw;"/>
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
            <q-btn color="primary" @click="UpdatePermissions" :loading="loading" v-if="this.new">Actualizar Permisos</q-btn>
            <q-btn color="primary" @click="CreatePermissions" :loading="loading" v-if="!this.new">Otorgar Permisos</q-btn>
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
    if (this.$route.params.id) {
      this.getUserData()
      this.getPermission()
    }
  },
  data () {
    return {
      loading: false,
      new: false,
      user: {
        name: '',
        model: 'user',
        parent: 'users',
        data: {
          name: '',
          email: '',
          password: ''
        }
      },
      permission: {
        entity_id: '',
        get: '',
        post: ''
      }
    }
  },
  methods: {
    getUserData: async function () {
      let userResult = await Connection.get(`/entity/${this.$route.params.id}/`)
      if (userResult.success) {
        this.user = userResult.data
      }
    },
    getPermission: async function () {
      let permissionResult = await Connection.get(`/user/permissions/${this.$route.params.id}`)
      if (permissionResult.success) {
        this.permission = permissionResult.data[0]
        console.log(permissionResult.data.length)
        if (permissionResult.data.length > 0) {
          this.new = true
          console.log(this.new)
        } else {
          this.new = false
          console.log(this.new)
        }
      }
    },
    Save: async function () {
      this.loading = true
      let saveResult = await Connection.patch(`/entity/${this.user.id}`, this.user)
      this.loading = false
      if (saveResult.success) {
        this.notifySuccess(this.$t(`${this.user.name} updated succesfully`))
        setTimeout(() => this.getUserData(), 1500)
      } else {
        this.notifyError(this.$t(`${this.user.name} failed at update`))
      }
    },
    Create: async function () {
      this.loading = true
      let createResult = await Connection.post(`/entity`, this.user)
      this.loading = false
      if (createResult.success) {
        this.notifySuccess(this.$t(`${this.user.name} created succesfully`))
        setTimeout(() => this.$router.push(`/users/edit/${createResult.data.id}`), 1500)
      } else {
        this.notifyError(this.$t(`${this.user.name} failed at create`))
      }
    },
    Delete: async function () {
      this.loading = true
      let deleteResult = await Connection.delete(`/entity/${this.user.id}`)
      this.loading = false
      if (deleteResult.success) {
        this.notifySuccess(this.$t(`${this.user.name} deactivated succesfully`))
        setTimeout(() => this.$router.push(`/users`), 1500)
      } else {
        this.notifyError(this.$t(`${this.user.name} failed at delete`))
      }
    },
    UpdatePermissions: async function () {
      this.loading = true
      let updateResult = await Connection.patch(`/user/${this.user.id}/permissions`)
      this.loading = false
      if (updateResult.success) {
        this.notifySuccess(this.$t(`${this.user.name} deactivated succesfully`))
        setTimeout(() => this.$router.push(`/users`), 1500)
      } else {
        this.notifyError(this.$t(`${this.user.name} failed at delete`))
      }
    },
    CreatePermissions: async function () {
      this.loading = true
      let createResult = await Connection.post(`/user/permissions`)
      this.loading = false
      if (createResult.success) {
        this.notifySuccess(this.$t(`${this.user.name} was given permissions succesfully`))
        setTimeout(() => this.$router.push(`/users/edit/${createResult.data.id}`), 1500)
      } else {
        this.notifyError(this.$t(`failed at creating permissions for ${this.user.name} `))
      }
    },
    notifySuccess: function (message) {
      this.$q.notify({
        message: message,
        timeout: 1500,
        type: 'positive',
        textColor: 'white',
        icon: 'fa-check',
        position: 'top',
        actions: [
          {
            label: '',
            icon: 'fa-times', // optional
            handler: () => {
            }
          }
        ]
      })
    },
    notifyError: function (message) {
      this.$q.notify({
        message: message,
        timeout: 1500,
        type: 'negative',
        textColor: 'white',
        icon: 'fa-exclamation-triangle',
        position: 'top',
        actions: [
          {
            label: '',
            icon: 'fa-times', // optional
            handler: () => {
            }
          }
        ]
      })
    }
  }
}
</script>
