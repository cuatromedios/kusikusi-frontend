import moment from 'moment'

export default async ({ Vue }) => {
  moment.defaultFormat = 'YYYY-MM-DD HH:mm'
  Vue.prototype.$moment = moment
}
