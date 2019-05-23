import Vue from 'vue'
import vuex from 'vuex'
import mutation from './mutation';

Vue.use(vuex);

export default new vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    userInfo: localStorage.getItem('userInfo')|| null
  },
  mutations: mutation
})