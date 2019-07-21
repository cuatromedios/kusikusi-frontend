export default {
  name: 'FieldBase',
  props: {
    field: {
      type: String,
      default: null
    },
    lang: {
      type: String,
      default: null
    },
    settingsObject: {
      type: Object,
      default: () => { return {} }
    }
  },
  computed: {
    fieldReference: {
      get: function () {
        let fieldParts = this.field.split('.')
        let field
        if (fieldParts.length === 1) {
          field = this.$store.state.content.entity[fieldParts[0]]
        } else if (fieldParts[0] === 'contents') {
          if (!this.$store.state.content.entity[fieldParts[0]][this.lang]) {
            this.$store.commit('content/addLanguage', this.lang)
          }
          if (this.$store.getters['content/getField'](`${fieldParts[0]}.${this.lang}.${fieldParts[1]}`) === undefined) {
            this.$store.commit('content/setEntityValue', {
              field: this.field,
              lang: this.lang,
              value: ''
            })
          }
          field = this.$store.state.content.entity[fieldParts[0]][this.lang][fieldParts[1]]
        } else {
          field = this.$store.state.content.entity[fieldParts[0]][fieldParts[1]]
        }
        return field
      },
      set: function (value) {
        this.$store.commit('content/setEntityValue', {
          field: this.field,
          lang: this.lang,
          value: value
        })
      }
    },
    settings () {
      return this.settingsObject || {}
    }
  }
}
