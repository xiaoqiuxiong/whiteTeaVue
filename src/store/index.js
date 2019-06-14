import Vue from 'vue'
import vuex from 'vuex'
import mutation from './mutation';

Vue.use(vuex);

export default new vuex.Store({
  state: {
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    userInfo: (localStorage.getItem('userInfo') && JSON.stringify(localStorage.getItem('userInfo')) == "{}") ? JSON.parse(localStorage.getItem('userInfo')) : {},
    hasMask: localStorage.getItem('hasMask') ? localStorage.getItem('hasMask') : false,
    allAddress: localStorage.getItem('allAddress') ? JSON.parse(localStorage.getItem('allAddress')) : [],
    editAddress: localStorage.getItem('editAddress') ? JSON.parse(localStorage.getItem('editAddress')) : {},
    wechatData: localStorage.getItem('wechatData') ? JSON.parse(localStorage.getItem('wechatData')) : {},
    searchHistory: localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [],
  },
  mutations: mutation
})