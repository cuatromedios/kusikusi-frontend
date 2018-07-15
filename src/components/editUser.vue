<template>
  <q-page class="q-pa-md">
    <q-item>
      <q-item-main style="color: #2e3436;">
        <div>
          <strong style="font-size: 25px;" v-if="this.$route.params.id">{{ user.data.name }}</strong>
          <strong style="font-size: 25px;" v-if="!this.$route.params.id">Nuevo Usuario</strong>
          <q-field>
            <div v-for="item in this.formItems"
                 v-bind:key="item.label"
                 :is="item.component"
                 :field="item.field"
                 :label="item.label"
                 :params="item.params"
                 :entity="user"></div>
          </q-field>
          <q-field label="Perfil:" style="width: 500px; max-width: 50vw;">
            <q-select
                style="width: 500px; max-width: 50vw; color: black; -webkit-text-fill-color: #2e3436;"
                dark
                class="q-mt-md"
                v-model="user.data.profile"
                separator
                :options="this.profiles"
              />
          </q-field>
          <q-btn color="primary" @click="Save" :loading="loading" class="q-ma-md" v-if="this.$route.params.id">Actualizar</q-btn>
          <q-btn color="negative" @click="Delete" :loading="loading" class="q-ma-md" v-if="this.$route.params.id">Desactivar</q-btn>
          <q-btn color="primary" @click="Create" :loading="loading" class="q-ma-md" v-if="!this.$route.params.id">Crear</q-btn>
        </div>

          <div>
            <q-input v-model="permission.entity_id" float-label="Permiso sobre:" :label="permission" style="width: 300px; max-width: 80vw;"/>
            Derechos de lectura:
            <q-btn-toggle
              v-model="permission.read"
              toggle-color="primary"
              :options="[
        {label: 'No', value: 'none'},
        {label: 'Propios', value: 'own'},
        {label: 'Cualquiera', value: 'any'}
      ]"
              class="q-ma-md"
            />
            Derechos de edicion:
            <q-btn-toggle
              v-model="permission.write"
              toggle-color="primary"
              :options="[
        {label: 'No', value: 'none'},
        {label: 'Propios', value: 'own'},
        {label: 'Cualquiera', value: 'any'}
      ]"
              class="q-ma-md"
            />
            <q-btn color="primary" @click="UpdatePermissions" :loading="loading" v-if="this.kind === 'update'">Actualizar Permisos</q-btn>
            <q-btn color="primary" @click="CreatePermissions" :loading="loading" v-if="this.kind === 'recent'">Otorgar Permisos</q-btn>
          </div>
      </q-item-main>
    </q-item>
  </q-page>
</template>

<style>
</style>

<script>
import Input from './formItems/input'
import Connection from '../Connection'
import { routes } from '../router/routes'
import Notifications from './notifications.js'
export default {
  name: 'editUser',
  mounted () {
    this.load()
  },
  beforeRouteUpdate (to, from, next) {
    // console.log(to.params.id)
    this.load(to.params.id)
    next()
  },
  data () {
    return {
      loading: false,
      kind: '',
      formItems: {},
      user: {
        name: '',
        model: 'user',
        parent: 'users',
        data: {
          name: '',
          profile: '',
          email: '',
          password: ''
        }
      },
      permission: {
        user_id: '',
        entity_id: '',
        get: '',
        post: ''
      },
      profiles: [
        {
          value: 'admin',
          label: 'Administrador'
        },
        {
          value: 'editor',
          label: 'Editor'
        },
        {
          value: 'user',
          label: 'Usuario'
        }
      ]
    }
  },
  methods: {
    load: function (id) {
      if (id) {
        this.getUserData(id)
      } else {
        this.getUserData()
      }
    },
    getUserData: async function (id) {
      let userId
      if (!id) {
        userId = this.$route.params.id
      } else {
        userId = id
      }
      let userResult = await Connection.get(`/entity/${userId}/`)
      if (userResult.success) {
        this.user = userResult.data
        this.getPermission(userId)
      } else {
        this.kind = 'new'
      }
      this.formItems = kindEditor[this.kind]
    },
    getPermission: async function (userId) {
      let permissionResult = await Connection.get(`/user/permissions/${userId}`)
      if (permissionResult.success) {
        this.kind = 'update'
        this.permission = permissionResult.data
      } else {
        this.kind = 'recent'
      }
      this.formItems = kindEditor[this.kind]
    },
    Save: async function () {
      this.loading = true
      let saveResult = await Connection.patch(`/entity/${this.user.id}`, this.user)
      this.loading = false
      if (saveResult.success) {
        Notifications.notifySuccess(this.$t(`${this.user.name} updated succesfully`))
        setTimeout(() => this.getUserData(), 1500)
      } else {
        Notifications.notifyError(this.$t(`${this.user.name} failed at update`))
      }
    },
    Create: async function () {
      this.loading = true
      let createResult = await Connection.post(`/entity`, this.user)
      this.loading = false
      if (createResult.success) {
        Notifications.notifySuccess(this.$t(`${this.user.name} created succesfully`))
        setTimeout(() => this.$router.push({name: routes.usersEdit.name, params: {id: createResult.data.id}}), 1500)
      } else {
        Notifications.notifyError(this.$t(`${this.user.name} failed at create`))
      }
    },
    Delete: async function () {
      this.loading = true
      let deleteResult = await Connection.delete(`/entity/${this.user.id}`)
      this.loading = false
      if (deleteResult.success) {
        Notifications.notifySuccess(this.$t(`${this.user.name} deactivated succesfully`))
        setTimeout(() => this.$router.push(`/users`), 1500)
      } else {
        Notifications.notifyError(this.$t(`${this.user.name} failed at delete`))
      }
    },
    UpdatePermissions: async function () {
      this.loading = true
      let updateResult = await Connection.patch(`/user/permissions/${this.user.id}`, this.permission)
      this.loading = false
      if (updateResult.success) {
        Notifications.notifySuccess(this.$t(`${this.user.name}'s permissions were updated succesfully`))
        setTimeout(() => this.load(), 1500)
      } else {
        Notifications.notifyError(this.$t(`failed at updating permissions for ${this.user.name} `))
      }
    },
    CreatePermissions: async function () {
      this.loading = true
      this.permission.user_id = this.user.id
      let createResult = await Connection.post(`/user/permissions`, this.permission)
      this.loading = false
      if (createResult.success) {
        Notifications.notifySuccess(this.$t(`${this.user.name} was given permissions succesfully`))
        setTimeout(() => this.load(), 1500)
      } else {
        Notifications.notifyError(this.$t(`failed at creating permissions for ${this.user.name} `))
      }
    }
  }
}
const kindEditor = {
  recent: [
    { label: 'Titulo', field: 'name', component: Input },
    { label: 'Nombre', field: 'data.name', component: Input },
    { label: 'Correo', field: 'data.email', component: Input }
  ],
  new: [
    { label: 'Titulo', field: 'name', component: Input },
    { label: 'Nombre', field: 'data.name', component: Input },
    { label: 'Correo', field: 'data.email', component: Input },
    { label: 'Contraseña', field: 'data.password', component: Input, params: {type: 'password'} }
  ],
  update: [
    { label: 'Titulo', field: 'name', component: Input },
    { label: 'Nombre', field: 'data.name', component: Input },
    { label: 'Correo', field: 'data.email', component: Input }
  ]
}
</script>
