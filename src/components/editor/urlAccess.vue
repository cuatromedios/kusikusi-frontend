<template>
  <q-field label="Direccion de acceso:" class="q-mt-md">
    <q-input v-model="entity.contents.url" type="url" rows=1 class="q-mt-md" :disable="check" />
    <q-checkbox v-model="check" left-label label="Url automatica:" color="primary" @input="automaticUrl"/>
  </q-field>
</template>

<script>
import Connection from '../../Connection'
export default {
  name: 'UrlAccess',
  mounted () {
    this.getParentUrl()
  },
  props: {
    entity: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      parentUrl: '',
      autoUrl: '',
      check: false
    }
  },
  methods: {
    getParentUrl: async function () {
      let parentUrlResult = await Connection.get(`/entity/${this.entity.parent}?fields=c.url`)
      if (parentUrlResult.data.contents.url) {
        this.parentUrl = parentUrlResult.data.contents.url
      } else {
        this.parentUrl = ''
      }
      this.automaticUrl()
    },
    automaticUrl: async function () {
      // áíóúñÑÜÖÿùûòöôÉÅÄìîïèëêçåàäâéü
      let trim = this.entity.contents.title.trim()
      let noAccents = trim.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      let onlyAlphanumericAndSpace = noAccents.replace(/[^0-9a-zA-Z\s]+/g, '')
      let noMultiSpace = onlyAlphanumericAndSpace.replace(/\s\s+/g, ' ')
      let spaceAsLine = noMultiSpace.replace(/ /g, '-')
      let filterFinal = spaceAsLine.toLowerCase()
      this.autoUrl = `/${filterFinal}`
      this.check ? this.entity.contents.url = this.parentUrl + this.autoUrl : this.entity.contents.url = this.entity.contents.url
    }
  }
}
</script>

<style scoped>

</style>
