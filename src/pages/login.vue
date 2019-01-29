<template>
  <div class="fixed-center">
    <q-card class="shadow-4 q-pa-md q-ma-md round-borders">
      <q-card-main>
        <div class="card-title text-center">
          <p>
            <img
              src="~assets/logo.svg"
              style="width:25vw;max-width:125px;"
            >
          </p>
          <p class="q-display-1 text-primary">{{ $t('login.welcome') }}</p>
        </div>
          <div class="card-content" style="width: 650px; max-width: 90vw;">
            <q-input :autofocus="true"
                     v-model="form.email"
                     :float-label="$t('login.email')"
                     :error="$v.form.email.$error" />
            <q-input v-model="form.pass"
                     type="password"
                     :float-label="$t('login.password')"
                     :error="$v.form.pass.$error"
                     @keyup.enter="handleLogin" />
            <kk-alert :message="message" dismiss-text="OK" />
            <q-btn class="q-ma-lg" color="primary" @click="handleLogin">{{ $t('login.button') }}</q-btn>
          </div>
        </q-card-main>
        <q-inner-loading :visible="loading" />
      </q-card>
  </div>
</template>
<script>
import Connection from '../Connection'
import kkAlert from '../components/kkAlert'
import { routes } from '../router/routes'
import { required, email } from 'vuelidate/lib/validators'

export default {
  components: { kkAlert },
  name: 'Login',
  beforeCreate () {
    this.$store.dispatch('session/resetUserData')
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
      loading: false,
      message: ''
    }
  },
  validations: {
    form: {
      email: { required, email },
      pass: { required }
    }
  },
  methods: {
    handleLogin: async function () {
      this.message = ''
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        return
      }
      try {
        this.loading = true
        let loginResult = await Connection.post('/user/login', {
          'email': this.form.email,
          'password': this.form.pass
        })
        this.loading = false
        if (loginResult.success) {
          this.$store.commit('session/setAuthtoken', loginResult.result.token)
          this.$store.commit('session/setUser', loginResult.result.user)
          this.loading = true
          let configResult = await Connection.get('/config/cms')
          this.loading = false
          this.$store.commit('main/setConfig', configResult.result)
          this.$router.push({name: routes.dashboard.name})
        } else {
          this.message = this.$t('login.invalid')
        }
      } catch (error) {
        this.loading = false
        if (error.response) {
          switch (error.response.status) {
            case 401:
              this.message = this.$t('login.invalid')
              break
            default:
              this.message = this.$t('general.serverError')
              break
          }
        }
      }
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
