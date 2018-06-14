export const resetUserData = ({commit}) => {
  commit('setAuthtoken', '')
  commit('setName', '')
  commit('setProfile', '')
  commit('setRelations', [])
}
