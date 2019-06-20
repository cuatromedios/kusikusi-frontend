<template>
  <q-card flat bordered class="my-card q-mb-lg entity-card-special">
    <q-card-section>
      <h2><q-icon :name="$store.state.ui.config.models[$store.state.content.entity.model].icon || 'note' "/> {{ $store.state.ui.config.models[$store.state.content.entity.model].name }}</h2>
    </q-card-section>
    <q-card-section class="row">
      <!-- <div class="col-4"> -->
        <!-- IMAGENES -->
      <!-- </div> -->
      <div class="col-12">
        <div v-for="(field, key) in fields" :key="key">
          <span>{{ field.label }}:</span> {{field.value}}
        </div>
      </div>
    </q-card-section>
    <!-- <div class="fade-screen"></div> -->
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
    },
    fields_array: {
      type: Array,
      default () {
        return []
      }
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
    },
    fields () {
      return this.createFieldArray(this.fields_array)
    }
  },
  methods: {
    decideFieldValue (field) {
      let fieldParts = field.split('.')
      let value = ''
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
    },
    createFieldArray (array) {
      let value = []
      let fieldParts = []
      for (let f = 0; f < array.length; f++) {
        fieldParts = array[f].split('.')
        if (fieldParts.length === 2) {
          if (fieldParts[0] === 'contents') {
            if (this.$store.state.content.entity.contents && this.$store.state.content.entity.contents[this.$store.getters['ui/defaultLang']]) {
              if (fieldParts[1] === '*') {
                value = Object.values(this.$store.state.content.entity.contents[this.$store.getters['ui/defaultLang']])
              } else {
                value.push(this.$store.state.content.entity.contents[this.$store.getters['ui/defaultLang']][fieldParts[1]])
              }
            }
          } else {
            if (this.$store.state.content.entity[fieldParts[0]]) {
              if (fieldParts[1] === '*') {
                value = Object.values(this.$store.state.content.entity[fieldParts[0]])
              } else {
                let data = {
                  'label': fieldParts[1],
                  'value': this.$store.state.content.entity[fieldParts[0]][fieldParts[1]]
                }
                value[f] = data
              }
            }
          }
        } else {
          value.push(this.$store.state.content.entity[fieldParts[0]])
        }
      }
      return value
    }
  }
}
</script>

<style lang="stylus">
.entity-card-special
  span
    font-weight: bold
.fade-screen
  background-image linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1));
  height 3rem
  width 100%
  position absolute
  bottom 0
  left 0
</style>
