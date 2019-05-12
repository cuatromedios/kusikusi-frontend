<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'KusikusiFrontend',
  mounted () {
    console.log('Kusikusi Front End App mounted')
    this.$store.dispatch('ui/getCmsConfig')
    this.$store.dispatch('session/getLocalSession')
  }
}
</script>

<style>
</style>
