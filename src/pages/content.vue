<template>
  <q-page class="flex flex-center">
  </q-page>
</template>

<style>
</style>

<script>
import { routes } from '../router/routes'
// import Edit from '../components/editEntity'

export default {
  components: {},
  name: 'Content',
  mounted () {
  },
  data () {
    return {
    }
  },
  methods: {
    redirect: async function () {
      this.$router.push({name: routes.editEntity.name, params: {id: 'home'}})
    }
  }
}
</script>
