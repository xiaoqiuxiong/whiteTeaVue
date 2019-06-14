exports.install = function (Vue, options) {
  Vue.prototype.CHECKBOXICON = {
    normal: require('@/assets/images/icon-normal.png'),
    active: require('@/assets/images/icon-active.png')
  }
  Vue.prototype.RADIOICON = {
    normal: require('@/assets/images/radio_normal.png'),
    active: require('@/assets/images/radio_active.png')
  }
  Vue.prototype.ERRORNETWORK = '网络故障，请刷新重试'
  Vue.prototype.APPNAME = '共信新零售：'
  Vue.prototype.APPID = 'wx0e598afa34c6496d'
  Vue.prototype.isWeiXin = navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
  Vue.prototype.returnPrePage = function () {
    window.history.go(-1);
  };
};
