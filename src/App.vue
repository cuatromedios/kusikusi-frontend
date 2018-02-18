<template>
  <div id="app">
    <main-menu class="main-menu"></main-menu>
    <main>
      <router-view/>
    </main>
    <footer>
      <p>Powered by <a href="http://kusikusi.cuatromedios.com/" target="_blank">KusiKusi</a></p>
    </footer>
  </div>
</template>

<script>
import MainMenu from './components/elements/MainMenu'
export default {
  name: 'App',
  components: {MainMenu}
}
</script>

<style lang="scss">
  @import "./styles/variables";
  #app {
    display: grid;
    height: 100vh;
    grid-template-columns: 12em auto;
    grid-template-areas:
      'menu main'
      'menu footer';
    grid-gap: 0px;
    .main-menu {
      grid-area: menu;
    }
    main {
      grid-area: main;
      padding: 1em;
    }
    footer {
      grid-area: footer;
      font-size: 80%;
      text-align: center;
      color: #999;
      a, a:link, a:visited {
        color: #999;
      }
    }
  }
</style>
