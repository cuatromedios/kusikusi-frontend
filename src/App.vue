<template>
  <el-container id="app">
    <aside v-if="this.$store.state.logged">
      <main-menu class="main-menu"></main-menu>
    </aside>
    <main>
      <router-view/>
      <footer>
        <p>Powered by <a href="http://kusikusi.cuatromedios.com/" target="_blank">KusiKusi</a></p>
      </footer>
    </main>
  </el-container>
</template>

<script>
import MainMenu from './components/elements/MainMenu'
import ElCol from 'element-ui/packages/col/src/col'
export default {
  name: 'App',
  components: {
    ElCol,
    MainMenu}
}
</script>

<style lang="scss">
  @import "./styles/variables";
  #app.el-container {
    aside {
      width: 15rem;
      height: 100vh;
      background-color: $--color-primary;
      position: fixed;
      top: 0;
      left: 0;
    }
    main {
      margin-left: 15rem;
      width: 100%;
      padding: 1em;
    }
    footer {
      padding: 2em 0;
      font-size: 80%;
      text-align: center;
      color: #999;
      a, a:link, a:visited {
        color: #999;
      }
    }
  }
</style>
