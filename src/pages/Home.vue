<template>
  <div class="q-py-xl text-center">
    <router-link to="login">
      <img
         src="~assets/logo.svg"
         style="width:25vw;max-width:125px;"
    ><br/>
    {{ $t('login.title') }}</router-link>
  </div>
</template>
<script>
export default {
  name: 'Home',
  mounted () {
    if (this.$store.getters['session/hasAuthtoken']) {
      this.$router.push({ name: 'login' })
    } else {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
<style>
</style>
