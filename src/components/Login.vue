<template>
  <div>
    <el-card class="box-card login-card">
      <div slot="header">
        <img src="../assets/logo.svg" class="logo">
        <h1>{{ 'login.welcome' | translate }}</h1>
      </div>
      <el-form class="login-form">
        <el-input :placeholder="$t('login.email_placeholder')" v-model="form.email" prefix-icon="el-icon-fa-envelope"></el-input>
        <el-input ref="passwordField" :placeholder="$t('login.password_placeholder')" :type="passwordType" v-model="form.password" prefix-icon="el-icon-fa-lock">
          <i :class="{'el-icon-fa-eye': passwordType === 'password', 'el-icon-fa-eye-slash': passwordType !== 'password', 'el-input__icon': true}" slot="suffix" @click="handleShowPassword"></i>
        </el-input>
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

export default {
  components: {LoadingButton},
  name: 'Login',
  data () {
    return {
      passwordType: 'password',
      form: {
        email: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    handleShowPassword: function () {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
    },
    handleLogin: function () {
      this.loading = true
      console.log('Login!')
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
    h1 {
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
      animation-delay: 0.5s;
    }
    .login-form {
      .el-input {
        margin-bottom: 1em;
      }
      .el-button {
        display: block;
        margin: 0 auto;
      }
    }
  }
</style>
