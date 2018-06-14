<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { routes } from '../router/routes'
export default {
  name: 'LayoutNotlogged',
  data () {
    return {
    }
  },
  computed: {
    routes: function () {
      return routes
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
