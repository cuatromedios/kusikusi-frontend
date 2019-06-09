<template>
  <q-card flat bordered class="my-card q-mb-lg entity-card">
    <q-card-section>
      <h2><q-icon :name="$store.state.ui.config.models[$store.state.content.entity.model].icon || 'note' "/> {{ $store.state.ui.config.models[$store.state.content.entity.model].name }}</h2>
      <h1>{{ title }}</h1>
      <div>{{ summary }}</div>
    </q-card-section>
    <q-card-section>
      <div class="row wrap q-col-gutter-sm q-pa-xs">
        <div class="col-xs-4 col-sm-3 col-md-2 col-lg-1 col-xl-1"
             v-for="entity in $store.getters['content/getRelationsByKind']('medium')"
             :key="entity.id">
          <q-card>
            <q-img
                src="https://cdn.quasar.dev/img/parallax2.jpg"
                basic
            >
            </q-img>
          </q-card>
        </div>
      </div>
    </q-card-section>
    <div class="fade-screen"></div>
  </q-card>
</template>

<script>
export default {
  name: 'EntityCard',
  props: {
    title_field: {
      type: String,
      default: 'contents.title'
    },
    summary_field: {
      type: String,
      default: 'contents.summary'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    title () {
      return this.decideFieldValue(this.title_field)
    },
    summary () {
      return this.decideFieldValue(this.summary_field)
    }
  },
  methods: {
    decideFieldValue (field) {
      let value = ''
      let fieldParts = field.split('.')
      if (fieldParts.length === 2) {
        if (fieldParts[0] === 'contents') {
          if (this.$store.state.content.entity.contents && this.$store.state.content.entity.contents[this.$store.getters['ui/defaultLang']]) {
            value = this.$store.state.content.entity.contents[this.$store.getters['ui/defaultLang']][fieldParts[1]]
          }
        } else {

        }
      } else {
        value = this.$store.state.content.entity[fieldParts[0]]
      }
      return value
    }
  }
}
</script>

<style lang="stylus">
.entity-card
  height 12rem
  overflow hidden
.fade-screen
  background-image linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1));
  height 3rem
  width 100%
  position absolute
  bottom 0
  left 0
</style>
