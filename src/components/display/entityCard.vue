<template>
  <q-card flat bordered class="my-card q-mb-lg entity-card">
    <q-card-section>
      <h2><q-icon :name="$store.state.ui.config.models[$store.state.content.entity.model].icon || 'note' "/> {{ $store.state.ui.config.models[$store.state.content.entity.model].name }}</h2>
      <h1>{{ $store.state.content.entity.name ||  $store.state.content.entity.model }}</h1>
      <div>{{ $store.state.content.entity.contents['en'].summary }}</div>
      <q-btn class="absolute-top-right q-ma-md" outline color="primary" icon="edit" :label="$t('general.edit')" />
    </q-card-section>
    <div class="fade-screen"></div>
  </q-card>
</template>

<script>
export default {
  name: 'EntityCard',
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="stylus">
.entity-card
  height 8rem
  overflow hidden
.fade-screen
  background-image linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1));
  height 3rem
  width 100%
  position absolute
  bottom 0
  left 0
</style>
