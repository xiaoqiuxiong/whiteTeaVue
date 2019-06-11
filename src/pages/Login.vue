<template>
  <div class="register">
    <div class="close-area">
      <van-icon @click="skipHomeFn" name="close" size="0.5rem"/>
    </div>
    <!-- tab -->
    <div class="app-tab-area">
      <van-row type="flex" justify="center">
        <van-col span="10">
          <van-tabs v-model="active" @click="onClick">
            <van-tab title="用户注册"></van-tab>
            <van-tab title="用户登录"></van-tab>
          </van-tabs>
        </van-col>
      </van-row>
    </div>
    <!-- 表单 -->
    <div class="form-area">
      <van-row type="flex" justify="center">
        <van-col span="22">
          <van-cell-group>
            <van-field
              v-model="phone"
              clearable
              label="手机号码"
              placeholder="请输入手机号码"
              :error-message="phoneError"
            />
            <van-field
              v-model="password"
              :type="passwordEyeType"
              label="登录密码"
              placeholder="请输入登录密码"
              :right-icon="passwordEye"
              @click-right-icon="passwordEyeFn"
              :error-message="passwordError"
            />

            <div class="van-cell register-btn">
              <van-button round block type="primary" @click="actionLogin">登 录</van-button>
            </div>
            <div class="forget-password">
              <router-link :to="{name: 'FindPwd'}">忘记密码？</router-link>
            </div>
          </van-cell-group>
        </van-col>
      </van-row>
    </div>
    <!-- 第三方登录 -->
    <div v-if="isWeiXin" class="other-area">
      <div class="top">
        <div class="line"></div>
        <div class="txt">第三方登录</div>
        <div class="line"></div>
      </div>
      <div class="bottom">
        <div @click="wxLogin" class="item" v-if="isWeiXin"></div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { apiLogin, apiWxLogin, apiGetWebAccessToken } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      active: 1,
      phone: "",
      phoneError: "",
      password: "",
      passwordError: "",
      passwordEye: "closed-eye",
      passwordEyeType: "password",
      code: ""
    };
  },
  created() {
    // 判断是否存有token
    if (this.$store.state.token) {
      this.$router.push({ name: "Home" });
    }
    this.code = this.getUrlCode().code;
    alert(location.search)
    if (this.code != null || this.code !== "") {
      // this.getGetWebAccessToken();
    }
  },
  methods: {
    wxLogin() {
      if (this.code == null || this.code === "") {
        let local = window.location.href; // 获取页面url
        // 如果没有code，则去请求
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
          local
        )}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
      }
    },
    getUrlCode() {
      // 截取url中的code方法
      var url = location.search;
      this.winUrl = url;
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
      }
      return theRequest;
    },
    getCode() {
      // 非静默授权，第一次有弹框
      this.code = "";
      let local = window.location.href; // 获取页面url
      this.code = this.getUrlCode().code; // 截取code
      if (this.code == null || this.code === "") {
        // 如果没有code，则去请求
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
          local
        )}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
      } else {
        // 你自己的业务逻辑
        this.getGetWebAccessToken();
      }
    },
    getGetWebAccessToken() {
      apiGetWebAccessToken({
        data: crypto.encrypt(JSON.stringify({ code: this.code }))
      })
        .then(result => {
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));
            this.open_id = result.openid;
            this.access_token = result.access_token;
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast(this.ERRORNETWORK);
        });
    },
    // 登录数据判断
    actionLogin() {
      // 数据判断
      let isTrue = true;
      // 手机号码
      if (this.phone.length == 0) {
        isTrue = false;
        this.phoneError = "请输入手机号码";
      } else if (this.phone.length != 11) {
        isTrue = false;
        this.phoneError = "请输入正确的手机号码";
      } else {
        this.phoneError = "";
      }
      // 密码
      if (this.password.length == "") {
        isTrue = false;
        this.passwordError = "请输入登录密码";
      } else if (this.password.length < 6 || this.password.length > 20) {
        isTrue = false;
        this.passwordError = "登录密码不能少于 6位/密码不能超过20位";
      } else {
        this.passwordError = "";
      }
      if (isTrue) this.actionLoginAxios();
    },
    // 登录数据提交
    actionLoginAxios() {
      apiLogin({
        data: crypto.encrypt(
          JSON.stringify({
            loginType: 1,
            user: {
              user_id: 0,
              password: md5(this.password),
              phone: this.phone,
              username: ""
            }
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));
            this.$store.commit("setToken", result.token);
            Toast({
              type: "success",
              message: "登录成功",
              duration: 1500,
              onClose: () => {
                this.$router.push({ name: "Home" });
              }
            });
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast("登录失败，请刷新重试");
        });
    },
    onClick(index, title) {
      if (index == 0) {
        this.$router.push({ name: "Register" });
      } else {
        this.$router.push({ name: "Login" });
      }
    },
    skipHomeFn() {
      this.$router.push({ name: "Home" });
    },
    passwordEyeFn() {
      if (this.passwordEye == "closed-eye") {
        this.passwordEye = "eye-o";
        this.passwordEyeType = "text";
      } else {
        this.passwordEye = "closed-eye";
        this.passwordEyeType = "password";
      }
    },
    showUserAgreementFn(e) {
      // 阻止事件冒泡
      e.stopPropagation();
    }
  }
};
</script>


<style lang="less" scope>
html,
body,
#app {
  height: 100%;
}
.register {
  background-color: #fff;
  height: 100%;
  background-image: url("../assets/images/register_bg.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom center;
  .forget-password {
    margin-top: 10px;
    text-align: right;
    padding: 0 0.4rem;
    a {
      color: #999;
    }
  }
  .line {
    padding-left: 0.4rem;
    padding-right: 0.4re;
  }
  .close-area {
    padding-top: 14px;
    padding-right: 14px;
    box-sizing: border-box;
    text-align: right;
    i {
      padding: 10px;
    }
  }
  .app-tab-area {
    [class*="van-hairline"]::after {
      border: 0;
    }
  }
  .van-tab--active {
    font-weight: 700;
  }
  .form-area {
    margin-top: 40px;
    .van-cell {
      margin-top: 10px;
      &:first-child {
        margin-top: 0;
      }
    }
    .van-cell-group {
      margin-top: 10px;
    }
    .van-hairline--top-bottom::after {
      border-color: #fff;
    }
    .register-btn {
      margin-top: 20px;
    }
    .register-btn:after {
      border-width: 0 !important;
    }
  }
  .user-agreement {
    &:after {
      border-width: 0 !important;
    }
    .van-checkbox__label {
      color: #999;
      span {
        color: #fd751e;
      }
    }
  }
  .other-area {
    margin-top: 40px;
    .top {
      width: 70%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .line {
        height: 1px;
        flex: 1;
        background-color: #333;
      }
      .txt {
        display: inline-block;
        padding: 0 10px;
        color: #333;
      }
    }
    .bottom {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      .item {
        height: 64px;
        width: 64px;
        background-image: url("../assets/images/wechat_login.png");
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
      }
    }
  }
}
</style>