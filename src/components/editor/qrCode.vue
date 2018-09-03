<template>
  <q-field label="Código QR" class="q-mt-md">
     <q-checkbox
      v-model="checked"
      color="primary"
    />
    <VueQrcode v-if="checked == true" :value="qrCode" :options="{ size: 200 }" tag="img" id="myid" ref="myid"></VueQrcode>
    <div> </div>
  </q-field>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode'
export default {
  components: {
    VueQrcode
  },
  name: 'QRCode',
  mounted () {
    this.setQRCode()
  },
  props: {
    entity: {
      default: () => {
        return {}
      },
      type: Object
    },
    prefix: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      checked: false,
      qrCode: ''
    }
  },
  methods: {
    setQRCode: function () {
      this.qrCode = this.prefix + this.entity.id
      // setTimeout(() => console.log(this.$refs.myid.$el.src), 200)
    }
  }
}
</script>

<style scoped>

</style>
