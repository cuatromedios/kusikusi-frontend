<template>
  <div class="main-menu-container">
    <div class="logo-container">
      <img src="../../assets/logo.svg">
    </div>
    <el-menu default-active="1" >
      <el-menu-item  index="1">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ 'dashboard.title' | translate }}</span>
      </el-menu-item >
      <el-menu-item index="2">
        <i class="el-icon-fa-pencil-square-o"></i>
        <span slot="title">{{ 'content.title' | translate }}</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-fa-picture-o"></i>
        <span slot="title">{{ 'media.title' | translate }}</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-fa-users"></i>
        <span slot="title">{{ 'users.title' | translate }}</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-fa-sign-out"></i>
        <span slot="title">{{ 'logout.title' | translate }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
  },
  methods: {
    handleClick: function () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped="" lang="scss">
  @import "../../styles/variables";
  .el-menu {
    background-color: $--color-primary;
    border-right: none;
  }
  .main-menu-container {
    background-color: $--color-primary;
  }
  .logo-container {
    background-color: darken($--color-primary, 10%);
    padding: 0.5em 0;
  }
  .logo-container img {
    display: block;
    height: 4em;
    margin: 0 auto;
  }
  .el-menu-item {
    color: white;
    font-size: 16px;
    font-weight: 800;
  }
  .el-menu-item.is-active {
    background-color: lighten($--color-primary, 10%);
  }
  .el-menu-item:hover {
    background-color: lighten($--color-primary, 15%);
  }
  .el-menu-item i {
    color: darken($--color-primary, 15%);
    font-size: 16px;
  }
</style>
