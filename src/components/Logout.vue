<template>
  <h1>{{ 'logout.title' | translate }}</h1>
</template>

<script>
import { routes } from '@/router'
export default {
  name: 'Logout',
  beforeCreate () {
    this.$router.push({ name: routes.login.name })
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
