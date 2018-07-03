<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="absolute-top-left">
      <q-item class="q-ma-md"
              v-for="user in this.users"
              v-bind:key="user.id"
              @click.native="$router.push(`/users/edit/${user.id}`)"
              style="color: #2e3436; cursor: pointer;">
          {{ user.name }}
      </q-item>
    </div>
    <q-btn color="primary" @click="$router.push('/users/edit')" :loading="loading">Agregar Usuario</q-btn>
  </q-page>
</template>

<script>
import Connection from '../Connection'
export default {
  name: 'Users',
  mounted () {
    this.getUsers()
  },
  data () {
    return {
      loading: false,
      users: []
    }
  },
  methods: {
    getUsers: async function () {
      let data
      let usersContainer
      let containerResult = await Connection.get(`/entity/${this.$store.state.main.user.id}/ancestors`)
      if (containerResult.success) {
        for (let i = 0; i < containerResult.data.length; i++) {
          if (containerResult.data[i].model === 'container') {
            usersContainer = containerResult.data[1].id
          }
        }
      }
      let userResult = await Connection.get(`/entity/${usersContainer}/children`)
      if (userResult.success) {
        for (let i = 0; i < userResult.data.length; i++) {
          data = {'id': userResult.data[i].id, 'name': userResult.data[i].data.name}
          this.users.push(data)
        }
      }
    }
  }
}
</script>
<style>
</style>
