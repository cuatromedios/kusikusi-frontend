import Api from '../../tools/Api'
import { LocalStorage } from 'quasar'

export const setAuthtoken = (state, newToken) => {
  Api.setHeader('Authorization', 'Bearer ' + newToken)
  LocalStorage.set('authtoken', newToken)
  state.authtoken = newToken
  state.logged = newToken === ''
}
export const setUser = (state, newUser) => {
  LocalStorage.set('user', newUser)
  state.user = newUser
}
