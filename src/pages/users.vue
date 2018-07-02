<template>
  <q-page class="flex flex-center q-pa-md">
    <q-item class="absolute-top-left q-ma-md">
      <q-item-main
        v-for="user in this.users"
        v-bind:key="user.id"
        @click.native="$router.push(`/users/edit/${user.id}`)"
        style="color: #2e3436; cursor: pointer;">
        {{ user.data.name }}
      </q-item-main>
    </q-item>
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
      users: []
    }
  },
  methods: {
    getUsers: async function () {
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
        this.users = userResult.data
      }
    }
  }
}
</script>
<style>
</style>
