<template>
  <q-page class="flex flex-center">
    <q-btn class="q-ma-lg" color="primary" @click="handleEntity">GET</q-btn>
    <p>{{ entities }}</p>
  </q-page>
</template>

<style>
</style>

<script>
import Connection from '../Connection'

export default {
  components: {},
  name: 'Content',
  beforeCreate () {
    this.$store.dispatch('main/resetEntityData')
  },
  mounted () {
  },
  data () {
    return {
      loading: false,
      entities: {
        id: '',
        model: '',
        name: '',
        parent: ''
      }
    }
  },
  methods: {
    //  `/entity/${}`
    handleEntity: async function () {
      this.message = ''
      try {
        this.loading = true
        let entityResult = await Connection.get('/entity/home')
        this.loading = false
        if (entityResult.success) {
          this.entities.id = entityResult.data.id
          this.entities.model = entityResult.data.model
          this.entities.name = entityResult.data.name
          this.entities.parent = entityResult.data.parent
        } else {
          this.notifyError(this.$t('Fail to retrieve entity'))
        }
      } catch (error) {
        this.loading = false
        if (error.response) {
          switch (error.response.status) {
            case 401:
              this.notifyError(this.$t('The other fail'))
              break
            default:
              this.notifyError(this.$t('general.serverError'))
              break
          }
        }
      }
    },
    notifyError: function (message) {
      this.$q.notify({
        message: message,
        timeout: 3000,
        type: 'warning',
        textColor: 'black',
        icon: 'error',
        position: 'top',
        actions: [
          {
            label: '',
            icon: 'close', // optional
            handler: () => {
            }
          }
        ]
      })
    }
  }
}
</script>
