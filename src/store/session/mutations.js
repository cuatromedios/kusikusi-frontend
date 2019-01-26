import Connection from '../../Connection'
import store from 'store' // Browser storage

export const setAuthtoken = (state, newToken) => {
  Connection.setHeader('Authorization', 'Bearer ' + newToken)
  store.set('authtoken', newToken) // local data in the browser
  state.authtoken = newToken
  if (newToken === '') {
    state.logged = false
  } else {
    state.logged = true
  }
}
export const setUser = (state, newUser) => {
  store.set('user', newUser) // local data in the browser
  state.user = newUser
}
