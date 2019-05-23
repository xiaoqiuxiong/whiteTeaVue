// 在http.js中引入axios
import axios from 'axios'; // 引入axios
// vant的toast提示框组件，大家可根据自己的ui组件更改。
import {
  Toast
} from 'vant';
// 环境的切换
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = 'apis/';
} else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = 'apis/';
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = 'apis/';
}
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      if (res.data.code == 0) {
        resolve(res.data);
      } else {
        reject(res.msg)
      }
    }).catch(err => {
      reject(err.data)
    })
  });
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        // if (res.data.code == 0 || res.data.code == 3122) {
        //   resolve(res.data);
        // } else {
        //   reject(res.msg)
        // }
          resolve(res.data);
      })
      .catch(err => {
        Toast({
          type: 'fail',
          message: '网络故障,请刷新重试',
          mask: true,
          duration: 0
        })
        reject(err.data)
      })
  });
}
