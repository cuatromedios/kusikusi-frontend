import VueQRCodeComponent from 'vue-qrcode-component'

// leave the export, even if you don't use it
export default async ({ Vue }) => {
  Vue.component('qr-code', VueQRCodeComponent)
}
