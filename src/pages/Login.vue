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
            <van-field v-model="phone" clearable label="手机号码" placeholder="请输入手机号码"/>
            <van-field
              v-model="password"
              :type="passwordEyeType"
              label="登录密码"
              placeholder="请输入登录密码"
              :right-icon="passwordEye"
              @click-right-icon="passwordEyeFn"
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
import axios from "axios";
export default {
  data() {
    return {
      loading: "",
      active: 1,
      phone: "",
      password: "",
      passwordEye: "closed-eye",
      passwordEyeType: "password",
      code: "",
      open_id: "",
      nickname: "",
      headurl: ""
    };
  },
  created() {
    // 判断是否存有token
    if (this.$store.state.token) {
      this.$router.push({ name: "Home" });
    }
    this.code = this.getUrlCode().code;
    if (this.code) {
      this.getGetWebAccessToken();
    }
  },
  methods: {
    wxLogin() {
      let local = window.location.href; // 获取页面url
      // 如果没有code，则去请求
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        this.APPID
      }&redirect_uri=${encodeURIComponent(
        local
      )}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
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
    getGetWebAccessToken() {
      apiGetWebAccessToken({
        data: crypto.encrypt(JSON.stringify({ code: this.code }))
      })
        .then(result => {
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));
            this.open_id = result.openid;
            this.access_token = result.access_token;
            axios
              .get(
                `/api/sns/userinfo?access_token=${this.access_token}&openid=${
                  this.open_id
                }&lang=zh_CN`
              )
              .then(result => {
                if (result.data.errcode) {
                  Toast({
                    mask: true,
                    message: this.APPNAME + "微信登录失败，请刷新重试",
                    duration: 1500,
                    onClose: () => {
                      this.$router.replace({ name: "Login" });
                    }
                  });
                } else {
                  this.open_id = result.data.openid;
                  this.nickname = result.data.nickname;
                  this.headurl = result.data.headimgurl;
                  apiWxLogin({
                    data: crypto.encrypt(
                      JSON.stringify({
                        open_id: this.open_id.toString(),
                        nickname: this.nickname,
                        headurl: this.headurl
                      })
                    )
                  })
                    .then(result => {
                      if (result.code == 0) {
                        result = JSON.parse(crypto.decrypt(result.data));
                        this.$store.commit("setToken", result.token);
                        this.$store.commit("setUserInfo", result.info);
                        this.$store.commit(
                          "setHasMask",
                          result.mask_info.can_show
                        );
                        Toast({
                          type: "success",
                          message: "登录成功",
                          duration: 1500,
                          onClose: () => {
                            this.$router.replace({ name: "Home" });
                          }
                        });
                      } else if (
                        result.code == -10086 &&
                        result.ret == "success"
                      ) {
                        result = crypto.decrypt(result.data);
                        this.$router.replace({
                          path: "/bindPhone",
                          query: {
                            open_id: this.open_id,
                            nickname: this.nickname,
                            headurl: this.headurl,
                            token: result
                          }
                        });
                      } else {
                        Toast({
                          mask: true,
                          message: this.APPNAME + "微信登录失败，请刷新重试",
                          duration: 1500,
                          onClose: () => {
                            this.$router.replace({ name: "Login" });
                          }
                        });
                      }
                    })
                    .catch(err => {
                      Toast({
                        mask: true,
                        message: this.APPNAME + "微信登录失败，请刷新重试",
                        duration: 1500,
                        onClose: () => {
                          this.$router.replace({ name: "Login" });
                        }
                      });
                    });
                }
              })
              .catch(err => {
                Toast({
                  mask: true,
                  message: this.APPNAME + "微信登录失败，请刷新重试",
                  duration: 1500,
                  onClose: () => {
                    this.$router.replace({ name: "Login" });
                  }
                });
              });
            return false;
          } else {
            Toast({
              mask: true,
              message: this.APPNAME + result.msg,
              duration: 1500,
              onClose: () => {
                this.$router.replace({ name: "Login" });
              }
            });
          }
        })
        .catch(err => {
          Toast({
            mask: true,
            message: this.APPNAME + this.ERRORNETWORK,
            duration: 1500,
            onClose: () => {
              this.$router.replace({ name: "Login" });
            }
          });
        });
    },
    // 登录数据判断
    actionLogin() {
      // 手机号码
      if (this.phone.length == 0) {
        this.$toast("请输入手机号码");
        return false;
      } else if (this.phone.length != 11) {
        this.$toast("请输入正确的手机号码");
        return false;
      }
      // 密码
      if (this.password.length == "") {
        this.$toast("请输入登录密码");
        return false;
      } else if (this.password.length < 6 || this.password.length > 20) {
        this.$toast("登录密码不能少于6位/密码不能超过20位");
        return false;
      }
      this.actionLoginAxios();
    },
    // 登录数据提交
    actionLoginAxios() {
      this.loading = Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: "spinner",
        message: "loading..."
      });
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
          this.loading.clear()
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));

            this.$store.commit("setToken", result.token);
            this.$store.commit("setUserInfo", {});
            this.$store.commit("setHasMask", result.mask_info.can_show);
            Toast({
              type: "success",
              message: "登录成功",
              duration: 1500,
              onClose: () => {
                this.$router.push({ name: "Home" });
              }
            });
          } else {
            this.$toast(result.msg);
          }
        })
        .catch(err => {
          this.loading.clear()
          this.$toast("登录失败，请刷新重试");
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
.register {
  background-color: #fff;
  height: 100vh;
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