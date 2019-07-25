<template>
  <q-card flat bordered class="my-card q-mb-lg ">
    <q-card-section>
      <h2><q-icon name="dashboard"/> {{ label }}</h2>
      <div class="row q-col-gutter-lg" ref="qrcode">
        <div class="col-xs-6 col-sm-3 col-md-2">
          <qr-code class="qr" error-level="Q" :text="code"></qr-code>
        </div>
        <div class="col-auto">
          <h3>{{ $store.state.content.entity.contents[$store.state.ui.lang].title }}</h3>
          <p><small>{{ code }}</small></p>
          <q-btn outline class="print-hide" @click="print" icon="print" :label="$t('qr.print')" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  components: { },
  name: 'QR',
  props: {
    label: {
      type: String,
      default: 'QR Code'
    },
    prefix: {
      type: String,
      default: 'Prefix'
    },
    sufix: {
      type: String,
      default: 'Sufix'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    code () {
      return `${this.prefix}${this.$store.state.content.entity.id}${this.sufix}`
    }
  },
  methods: {
    print () {
      let printWindow = window.open('', 'PRINT', 'height=400,width=600')

      printWindow.document.write('<html><head><title>QR code</title><style>body {font-family: arial, helvetica, sans-serif; text-align: center} .qr img {margin: 0 auto} .container {width: 65%; margin: 0 auto;} small {font-size: 50%; font-family: Courier, "Courier New", monospace} .print-hide {display: none}</style></head>')
      printWindow.document.write('<body><div class="container">')
      printWindow.document.write(this.$refs.qrcode.innerHTML)
      printWindow.document.write('</div></body></html>')

      printWindow.document.close() // necessary for IE >= 10
      printWindow.focus() // necessary for IE >= 10*/

      printWindow.print()
      printWindow.close()

      return true
    }
  }
}
</script>

<style lang="stylus">
  .qr
    canvas, img
      width 100%
      height auto
</style>
