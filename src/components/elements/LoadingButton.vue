<template>
  <el-button
    :type="type"
    @click="handleClick"
    :disabled="loading"
  ><i class="el-icon-loading" v-if="loading"></i> {{ label }}</el-button>
</template>

<script>
export default {
  props: {
    label: String,
    loading: Boolean,
    type: String
  },
  methods: {
    handleClick: function () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
</style>
