export const resetUserData = ({commit}) => {
  commit('setAuthtoken', '')
  commit('setUser', {})
}
