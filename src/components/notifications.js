import { Notify } from 'quasar'

class Notifications {
  static notifySuccess (message) {
    Notify.create({
      message: message,
      timeout: 1500,
      type: 'positive',
      textColor: 'white',
      icon: 'fa-check',
      position: 'top',
      actions: [
        {
          label: '',
          icon: 'fa-times', // optional
          handler: () => {
          }
        }
      ]
    })
  }
  static notifyWarning (message) {
    Notify.create({
      message: message,
      timeout: 1500,
      type: 'yellow',
      textColor: 'black',
      icon: 'fa-exclamation-triangle',
      position: 'top',
      actions: [
        {
          label: '',
          icon: 'fa-times', // optional
          handler: () => {
          }
        }
      ]
    })
  }
  static notifyError (message) {
    Notify.create({
      message: message,
      timeout: 1500,
      type: 'negative',
      textColor: 'white',
      icon: 'fa-exclamation-triangle',
      position: 'top',
      actions: [
        {
          label: '',
          icon: 'fa-times', // optional
          handler: () => {
          }
        }
      ]
    })
  }
}
export default Notifications
