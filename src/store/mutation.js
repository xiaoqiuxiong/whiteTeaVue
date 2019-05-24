import { ifError } from "assert";
import router from '@/router';

export default {
  // token
  setToken(state,token) {
    state.token = token
    localStorage.token = state.token
    if(!token){
      localStorage.removeItem('token');
    }
  },
  // userInfo
  setUserInfo(state,userInfo) {
    state.userInfo = userInfo
    localStorage.userInfo = state.userInfo
  }
}
