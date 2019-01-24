<template>
  <div class="fixed-center">
    <q-card class="shadow-4 q-pa-md q-ma-md round-borders">
      <q-card-main>
        <div class="card-title text-center">
          <p>
            <img
              src="~assets/logo.svg"
              style="width:30vw;max-width:150px;"
            >
          </p>
          <p class="q-display-1 text-primary">{{ 'login.welcome' | translate }}</p>
        </div>
          <div class="card-content" style="width: 650px; max-width: 90vw;">
            <q-input :autofocus="true" v-model="form.email" :float-label="'login.email' | translate" />
            <q-input v-model="form.pass" type="password"  :float-label="'login.password' | translate" />
            <q-btn class="q-ma-lg" color="primary" @click="handleLogin">{{ 'login.button' | translate }}</q-btn>
          </div>
        </q-card-main>
        <q-inner-loading :visible="loading" />
      </q-card>
  </div>
</template>
<script>
import Connection from '../Connection'
import { routes } from '../router/routes'

export default {
  components: {},
  name: 'Login',
  beforeCreate () {
    this.$store.dispatch('main/resetUserData')
  },
  mounted () {
    // this.$store.commit('main/setTitle', this.$t('login.title'))
  },
  data () {
    return {
      form: {
        email: '',
        pass: ''
      },
      loading: false
    }
  },
  methods: {
    handleLogin: async function () {
      this.message = ''
      try {
        this.loading = true
        let loginResult = await Connection.post('/user/login', {
          'email': this.form.email,
          'password': this.form.pass
        })
        this.loading = false
        if (loginResult.success) {
          let configResult = await Connection.get('/config/cms')
          this.$store.commit('main/setAuthtoken', loginResult.data.token)
          this.$store.commit('main/setName', loginResult.data.entity.data.name)
          this.$store.commit('main/setProfile', loginResult.data.entity.data.profile)
          this.$store.commit('main/setUserId', loginResult.data.entity.id)
          this.$store.commit('main/setConfig', configResult.data)
          this.$router.push({name: routes.home.name})
        } else {
          this.notifyError(this.$t('login.invalid'))
        }
      } catch (error) {
        this.loading = false
        if (error.response) {
          switch (error.response.status) {
            case 401:
              this.notifyError(this.$t('login.invalid'))
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
        timeout: 2000,
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
<style>
  .q-input{
    margin-bottom: 1em;
  }
  .q-btn {
    display: block;
    margin: 0 auto;
  }
</style>
