<template>
  <q-page class="flex flex-center">
    <h1>. . .</h1>
  </q-page>
</template>
<script>
import { routes } from '../router/routes'
export default {
  name: 'PageIndex',
  mounted () {
    if (this.$store.state.main.user && this.$store.state.main.user.authtoken !== '') {
      this.$router.push('/home')
    } else {
      this.$router.push({name: routes.login.name})
    }
  }
}
</script>
