export default {
  // token
  setToken(state,token) {
    state.token = token
    localStorage.token = state.token
  },
  // userInfo
  setUserInfo(state,userInfo) {
    state.userInfo = userInfo
    localStorage.userInfo = state.userInfo
  }
}
