<template>
  <q-field label="Código QR" class="q-mt-md">
     <q-toggle
      v-model="checked"
      color="primary"
    />
    <div v-if="checked == true">
      <q-field class="q-mt-md">
        <VueQrcode :value="qrCode" :options="{ size: 200 }" tag="img" id="myid" ref="myid"></VueQrcode>
        <q-checkbox
          v-model="select"
          color="tertiary"
          @input="fullCode"
        />
        <q-input v-if="select == true" v-model="generatedCode" readonly class="q-mt-md" />
      </q-field>
    </div>
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
      select: false,
      qrCode: '',
      generatedCode: ''
    }
  },
  methods: {
    setQRCode: function () {
      this.qrCode = this.prefix + this.entity.id
    },
    fullCode: function () {
      this.generatedCode = this.$refs.myid.$el.src
    }
  }
}
</script>

<style scoped>

</style>
