<template>
  <q-page class="q-ma-md">
    <q-btn class="q-ma-lg" color="primary" @click="redirect">Editar</q-btn>
    <q-btn class="q-ma-lg" color="primary" @click="redirect2">Editar (section)</q-btn>
    <q-btn class="q-ma-lg" color="primary" @click="redirect3">Editar (pages)</q-btn>
    <q-btn class="q-ma-lg" color="warning">Usuarios</q-btn>
    <q-btn class="q-ma-lg" color="warning">Medios</q-btn>
  </q-page>
</template>

<style>
</style>

<script>
import { routes } from '../router/routes'

export default {
  components: {},
  name: 'Content',
  mounted () {
  },
  data () {
    return {
    }
  },
  methods: {
    redirect: async function () {
      this.$router.push({name: routes.editEntity.name, params: {id: 'home'}})
    },
    redirect2: async function () {
      this.$router.push({name: routes.editEntity.name, params: {id: '1fbf9ee6-2399-44c7-a849-43e880fe4ce0'}})
    },
    redirect3: async function () {
      this.$router.push({name: routes.editEntity.name, params: {id: '0b41cf44-7d53-45e9-ab49-267b6bc82838'}})
    }
    // handleEntity: async function () {
    //   this.message = ''
    //   try {
    //     this.loading = true
    //     let entityResult = await Connection.get('/entity/0c819314-0189-4433-8348-1ae867e83516')
    //     this.loading = false
    //     if (entityResult.success) {
    //       this.entities.id = entityResult.data.id
    //       this.entities.model = entityResult.data.model
    //       this.entities.name = entityResult.data.name
    //       this.entities.parent = entityResult.data.parent
    //     } else {
    //       this.notifyError(this.$t('Fail to retrieve entity'))
    //     }
    //   } catch (error) {
    //     this.loading = false
    //     if (error.response) {
    //       switch (error.response.status) {
    //         case 401:
    //           this.notifyError(this.$t('The other fail'))
    //           break
    //         default:
    //           this.notifyError(this.$t('general.serverError'))
    //           break
    //       }
    //     }
    //   }
    // },
    // notifyError: function (message) {
    //   this.$q.notify({
    //     message: message,
    //     timeout: 3000,
    //     type: 'warning',
    //     textColor: 'black',
    //     icon: 'error',
    //     position: 'top',
    //     actions: [
    //       {
    //         label: '',
    //         icon: 'close', // optional
    //         handler: () => {
    //         }
    //       }
    //     ]
    //   })
    // }
  }
}
</script>
