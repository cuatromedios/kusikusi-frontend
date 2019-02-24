<template>
  <q-card class="login-card shadow-4 q-my-lg q-mx-auto">
    <q-card-section>
      <h1 class="text-primary text-center q-pa-none q-ma-none">
        <img class="text-center"
          src="~assets/logo.svg"
          style="width:25vw;max-width:125px;"
        >
      </h1>
      <h5 class="text-weight-bold text-primary text-center q-pa-none q-ma-none">
        {{ $t('login.welcome') }}
      </h5>
    </q-card-section>
    <q-card-section class="q-pa-md">
      <q-input :autofocus="true"
               outlined class="q-my-sm"
               v-model="form.email"
               :label="$t('login.email')"
               :error="$v.form.email.$error" />
      <q-input v-model="form.pass"
               outlined class="q-my-sm"
               :type="isPwd ? 'password' : 'text'"
               :label="$t('login.password')"
               :error="$v.form.pass.$error"
               @keyup.enter="handleLogin">
              <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
              </template>
      </q-input>
      <feedback :message="message" dismiss-text="OK" />
    </q-card-section>
    <q-separator dark />
    <q-card-actions class="q-pa-md">
      <q-btn class="full-width" color="primary" :disabled="$v.form.$error" @click="handleLogin">{{ $t('login.button') }}</q-btn>
    </q-card-actions>
    <q-inner-loading :visible="loading" />
  </q-card>
</template>
<script>
import Feedback from '../components/Feedback'
import { required, email } from 'vuelidate/lib/validators'

export default {
  components: { Feedback },
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
      message: '',
      isPwd: true
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
        let loginResult = await this.$api.post('/user/login', {
          'email': this.form.email,
          'password': this.form.pass
        })
        this.loading = false
        if (loginResult.success) {
          this.$store.commit('session/setAuthtoken', loginResult.result.token)
          this.$store.commit('session/setUser', loginResult.result.user)
          this.loading = true
          let configResult = await this.$api.get('/config/cms')
          this.loading = false
          this.$store.commit('main/setConfig', configResult.result)
          this.$router.push({ name: 'dashboard' })
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
  .login-card {
    max-width: 40em;
  }
</style>
