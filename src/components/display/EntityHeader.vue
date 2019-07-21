<template>
  <q-card flat bordered class="my-card q-mb-lg entity-card">
    <q-card-section>
      <div class="row">
        <div class="col">
          <h2><q-icon :name="$store.state.ui.config.models[$store.state.content.entity.model].icon || 'note' "/> {{ $store.state.ui.config.models[$store.state.content.entity.model].name }}</h2>
        </div>
        <div class="col-auto">
          {{ $moment($store.state.content.entity.publicated_at).fromNow() }}  <q-icon name="lens" :color="$store.state.content.entity.active ? ($store.state.content.entity.published ? 'positive' : 'warning') : 'negative'" />
          <q-icon name="info">
            <q-popup-proxy>
              <q-card>
                <q-card-section class="text-caption">
                  ID: <strong style="white-space: nowrap">{{ $store.state.content.entity.id }}</strong><br>
                  Model: <strong>{{ $store.state.content.entity.model }}</strong><br>
                  Active: <strong>{{ $store.state.content.entity.active }}</strong><br>
                  From: <strong>{{ $store.state.content.entity.publicated_at }}</strong><br>
                  To: <strong>{{ $store.state.content.entity.unpublicated_at }}</strong><br>
                  Created: <strong>{{ $store.state.content.entity.created_at }}</strong><br>
                  Updated: <strong>{{ $store.state.content.entity.updated_at }}</strong><br>
                </q-card-section>
              </q-card>
            </q-popup-proxy>
          </q-icon>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <h1>{{ title }}</h1>
      <div>{{ summary }}</div>
    </q-card-section>
    <div class="fade-screen"></div>
  </q-card>
</template>

<script>
export default {
  name: 'EntityHeader',
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
          if (this.$store.state.content.entity[fieldParts[0]]) {
            value = this.$store.state.content.entity[fieldParts[0]][fieldParts[1]]
          }
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
