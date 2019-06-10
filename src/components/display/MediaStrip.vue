<template>
  <q-card flat bordered class="my-card q-mb-lg media-strip">
    <q-card-section>
      <h2><q-icon name="photo_library"/> {{ $t('media.title') }}</h2>
    </q-card-section>
    <q-card-section>
      <div class="row no-wrap q-col-gutter-sm q-pa-xs">
        <div class="media-container col-2 col-xs-4 col-sm-3 col-md-2 col-lg-1 col-xl-1"
             v-for="entity in $store.getters['content/getRelationsByKind']('medium')"
             :key="entity.id">
          <q-img
              src="https://cdn.quasar.dev/img/parallax2.jpg"
              class=""
              basic
              :ratio="1"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
              </div>
            </template>
          </q-img>
        </div>
      </div>
    </q-card-section>
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
.media-strip
  overflow hidden
</style>
