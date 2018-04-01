<template>
  <div class="main-menu-container">
    <div class="logo-container">
      <img src="../../assets/logo.svg">
    </div>
    <el-menu :default-active="this.$route.name" @select="handleSelect" >
      <el-menu-item :index="item.id" :key="item.id"  v-for="item in menu">
        <i :class=" 'el-icon-fa-' + item.icon "></i>
        <span slot="title">{{ item.id+'.title' | translate }}</span>
      </el-menu-item >
    </el-menu>
  </div>
</template>

<script>
import { routes } from '@/router'

export default {
  props: {
  },
  data () {
    return {
      menu: [
        { id: routes.dashboard.name, icon: 'tachometer' },
        { id: routes.content.name, icon: 'pencil-square-o' },
        { id: routes.sample.name, icon: 'pencil-square-o' },
        { id: routes.media.name, icon: 'picture-o' },
        { id: routes.users.name, icon: 'users' },
        { id: routes.logout.name, icon: 'sign-out' }
      ]
    }
  },
  methods: {
    handleSelect (index) {
      this.$router.push({ name: index })
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
