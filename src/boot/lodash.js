import lodash from 'lodash'

export default ({ Vue }) => {
  console.log('lodash')
  Vue.prototype._ = lodash
}
