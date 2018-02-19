<template>
  <div>
    <el-card class="box-card login-card">
      <div slot="header">
        <img src="../assets/logo.svg" class="logo">
        <h2>{{ 'login.welcome' | translate }}</h2>
      </div>
      <el-form class="login-form">
        <el-input :placeholder="$t('login.email_placeholder')" v-model="form.email" prefix-icon="el-icon-fa-envelope"></el-input>
        <el-input ref="passwordField" :placeholder="$t('login.password_placeholder')" :type="passwordType" v-model="form.password" prefix-icon="el-icon-fa-lock">
          <i :class="{'el-icon-fa-eye': passwordType === 'password', 'el-icon-fa-eye-slash': passwordType !== 'password', 'el-input__icon': true}" slot="suffix" @click="handleShowPassword"></i>
        </el-input>
        <el-alert :title="message" type="error" v-if="message !== ''" :closable="false"></el-alert>
        <loading-button
          type="primary"
          :loading="loading"
          :label="$t('login.button')"
          @click="handleLogin"></loading-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>

import LoadingButton from './elements/LoadingButton'
import Connection from '@/Connection'
import { routes } from '@/router'

export default {
  components: {LoadingButton},
  name: 'Login',
  beforeCreate () {
    this.$store.dispatch('resetUserData')
  },
  data () {
    return {
      passwordType: 'password',
      form: {
        email: '',
        password: ''
      },
      loading: false,
      message: ''
    }
  },
  methods: {
    handleShowPassword: function () {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
    },
    handleLogin: async function () {
      var _this = this
      this.message = ''
      try {
        this.loading = true
        let loginResult = await Connection.post('/user/login', {
          'email': this.form.email,
          'password': this.form.password
        })
        this.loading = false
        if (loginResult.success) {
          _this.$store.commit('setAuthtoken', loginResult.data.token)
          _this.$store.commit('setName', loginResult.data.entity.data.name)
          _this.$store.commit('setProfile', loginResult.data.entity.data.profile)
          _this.$store.commit('setUserId', loginResult.data.entity.relations)
          this.$router.push({ name: routes.dashboard.name })
        } else {
          this.message = this.$t('login.invalid')
        }
      } catch (error) {
        console.error(error)
        this.loading = false
        if (error.response) {
          switch (error.response.status) {
            case 401:
              _this.message = this.$t('login.invalid')
              break
            default:
              _this.message = this.$t('login.error')
              break
          }
        }
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @keyframes down {
    from {margin-top: -6em;}
    to {margin-top: -3em;}
  }
  .el-card.login-card {
    max-width: 30em;
    margin: 4em auto;
    overflow: visible;
    h2 {
      text-align: center;
    }
    .header {
    }
    .logo {
      display: block;
      margin: -3em auto 0 auto;
      height: 6em;
      animation-name: down;
      animation-duration: 0.5s;
    }
    .login-form {
      .el-input, .el-alert {
        margin-bottom: 1em;
      }
      .el-button {
        display: block;
        margin: 0 auto;
      }
    }
  }
</style>
