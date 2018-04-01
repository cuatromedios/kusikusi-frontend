<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
            v-for="ancestor in this.ancestors"
            :key="ancestor.id"
            :to="{ name: routeName, params: { id: ancestors.id }}">
      {{ ancestor.name }}
    </el-breadcrumb-item>
    <el-breadcrumb-item :to="{ name: routeName, params: { id: entity.id }}">{{ entity.name }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    entity: {
      default: () => { return {} },
      type: Object
    },
    ancestors: {
      default: () => { return [] },
      type: Array
    },
    routeName: {
      default: 'entity',
      type: String
    },
    routeEntityIdParam: {
      default: 'id',
      type: String
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .el-breadcrumb {
    margin-bottom: 1em;
  }
</style>
