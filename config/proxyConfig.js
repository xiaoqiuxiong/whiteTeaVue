module.exports = {
  proxy: {
    '/apis': { //将http://192.168.1.111:8886印射为/apis
      target: 'http://192.168.1.113:8886',  // 接口域名
      // target: 'http://test.gongxin.site:8886', // 接口域名
      secure: false, // 如果是https接口，需要配置这个参数
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '^/apis': '' //需要rewrite的,
      }
    },
    '/alipay': {
      target: 'https://openapi.alipay.com', // 接口域名
      secure: true, // 如果是https接口，需要配置这个参数
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '^/alipay': '' //需要rewrite的,
      }
    },
    '/openApi': {
      target: 'https://open.weixin.qq.com',
      secure: true,
      changeOrigin: true,
      pathRewrite: {
        '^/openApi': ''
      }
    },
    '/api': {
        target: 'https://api.weixin.qq.com', // 接口域名
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/api': '' //需要rewrite的,
        }
      }
  }
}
