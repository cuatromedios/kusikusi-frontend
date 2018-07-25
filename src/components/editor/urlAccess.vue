<template>
  <q-field label="Direccion de acceso:" class="q-mt-md">
    <q-input v-model="entity.contents.url" type="url" rows=1 class="q-mt-md" label="si" :disable="check" />
    <q-checkbox v-model="check" left-label label="Url automatica:" color="primary" @input="automaticUrl" />
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
      // Set automatic self url
      let title = this.entity.contents.title.replace(/ /g, '-')
      this.autoUrl = `/${title.toLowerCase()}`
      this.check ? this.entity.contents.url = this.parentUrl + this.autoUrl : this.entity.contents.url = this.entity.contents.url
    }
  }
}
</script>

<style scoped>

</style>
