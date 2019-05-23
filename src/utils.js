
exports.install = function (Vue, options) {
  Vue.prototype.isWeiXin = navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
  Vue.prototype.returnPrePage = function () {
    window.history.go(-1);
  };
  
};
