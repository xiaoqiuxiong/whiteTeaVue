// 在http.js中引入axios
import axios from "axios";
import store from "../store"; // 引入axios
import router from "@/router";
// vant的toast提示框组件，大家可根据自己的ui组件更改。
import { Toast } from "vant";
axios.defaults.timeout = 5000;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
let toastLoading;
// 拦截请求
// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
  config => {
    if (store.state.token) {
      config.headers.Authorization = store.state.token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// 相应请求
axios.interceptors.response.use(
  response => {
    if (response.data.code == -9999) {
      store.commit("setToken", "");
      router.replace({
        name: "Login"
      });
      response.data.msg = "亲，需要登录才可以购物哦";
    }
    return response;
  },
  err => {
    if (err.response) {
      console.log(err.response.status);
      switch (err.response.status) {
        case 401:
          localStorage.removeItem("token");
          router.replace({
            name: "Login"
          });
        case 404:
          return Promise.reject("共信新零售：请求地址故障");
        default:
          return Promise.reject("共信新零售：网络故障");
      }
    }
    return Promise.reject(err);
  }
);
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        if (res.data.code == 0) {
          resolve(res.data);
        } else {
          reject(res.msg);
        }
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        Toast(err);
        return false;
      });
  });
}
