<template>
  <div id="app">
    <router-view/>
    <footer>
      <p>Powered by <a href="http://kusikusi.cuatromedios.com/" target="_blank">KusiKusi</a></p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  @import "./styles/variables";
  #app {
  }
  footer {
    font-size: 80%;
    text-align: center;
    color: rgba(0,0,0,0.5);
    a, a:link, a:visited {
      color: rgba(0,0,0,0.33);
    }
  }
</style>
