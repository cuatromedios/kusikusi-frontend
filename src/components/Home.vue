<template>
  <div>
    <img src="../assets/logo.svg">
  </div>
</template>

<script>
import { routes } from '@/router'
export default {
  name: 'Home',
  mounted () {
    if (this.$store.state.logged) {
      this.$router.push({ name: routes.dashboard.name })
    } else {
      this.$router.push({ name: routes.login.name })
    }
  },
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  display: block;
  width: 50%;
  margin: 1em auto;
}
</style>
