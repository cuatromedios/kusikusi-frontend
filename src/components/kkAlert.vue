<template>
  <transition
    enter-active-class="animated shake"
    leave-active-class="animated fadeOut"
    appear >
    <q-alert
        v-if="message !== ''"
        :type="type"
        class="q-mb-sm" >
      {{ message }}
    </q-alert>
  </transition>
</template>
<script>
export default {
  components: {},
  name: 'kkAlert',
  data () {
    return {
    }
  },
  props: {
    type: {
      type: String,
      default: 'negative'
    },
    message: {
      type: String,
      default: ''
    },
    dismissText: {
      type: String,
      default: ''
    }
  }
}
</script>
<style>

</style>
