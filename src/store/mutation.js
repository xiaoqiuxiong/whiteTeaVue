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
  setHasMask(state,hasMask){
    state.hasMask = hasMask
    localStorage.hasMask = state.hasMask
  },
  // userInfo
  setUserInfo(state,userInfo) {
    state.userInfo = userInfo
    localStorage.userInfo = JSON.stringify(state.userInfo)
  },
  // allAddress
  setAllAddress(state,allAddress) {
    state.allAddress = allAddress
    localStorage.allAddress = JSON.stringify(state.allAddress)
  },
  // editAddress
  setEditAddress(state,editAddress) {
    state.editAddress = editAddress
    localStorage.editAddress = JSON.stringify(state.editAddress)
  },
  // editAddress
  setWechatData(state,wechatData) {
    state.wechatData = wechatData
    localStorage.wechatData = JSON.stringify(state.wechatData)
  },
  setSearchHistory(state,searchHistory) {
    state.searchHistory = searchHistory
    localStorage.searchHistory = JSON.stringify(state.searchHistory)
  }
}
