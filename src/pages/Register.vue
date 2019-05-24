<template>
  <div class="register">
    <div class="close">
      <van-icon @click="skipHomeFn" name="close" size="0.5rem"/>
    </div>
    <!-- tab -->
    <div class="app-tab">
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
    <div class="form">
      <van-row type="flex" justify="center">
        <van-col span="22">
          <van-cell-group>
            <van-field
              v-model="phone"
              @input="checkPhone"
              type="tel"
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
            <van-field
              v-model="resPassword"
              :type="resPasswordEyeType"
              label="确认密码"
              placeholder="请再次输入密码"
              :right-icon="resPasswordEye"
              @click-right-icon="resPasswordEyeFn"
              :error-message="resPasswordError"
            />
            <van-cell-group>
              <van-field
                v-model="sms"
                center
                clearable
                label="手机验证码"
                placeholder="请输入手机验证码"
                :error-message="smsError"
              >
                <van-button
                  slot="button"
                  size="small"
                  type="primary"
                  round
                  @click="getCode"
                  :disabled="!isSms"
                >{{smsBtnTxt}}</van-button>
              </van-field>
            </van-cell-group>
            <!-- 下边框 -->
            <div class="line">
              <div class="van-hairline--bottom"></div>
            </div>
            <div class="van-cell user-agreement">
              <van-checkbox v-model="checked">
                我已看过并接受
                <span @click="showUserAgreementFn">《用户协议》</span>
                <img
                  slot="icon"
                  slot-scope="props"
                  :src="props.checked ? icon.active : icon.normal"
                >
              </van-checkbox>
            </div>
            <div class="van-cell register-btn">
              <van-button round block type="primary" @click="actionRegister">注 册</van-button>
            </div>
          </van-cell-group>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { apiCheckRegister, apiSendCode, apiRegister } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      active: 0,
      phone: "",
      phoneError: "",
      password: "",
      passwordError: "",
      passwordEye: "closed-eye",
      passwordEyeType: "password",
      resPassword: "",
      resPasswordError: "",
      resPasswordEye: "closed-eye",
      resPasswordEyeType: "password",
      isPhoneOk: false,
      sms: "",
      isSms: false,
      smsBtnTxt: "获取验证码",
      seconds: 60,
      smsError: "",
      checked: false,
      icon: {
        normal: require("../assets/images/icon-normal.png"),
        active: require("../assets/images/icon-active.png")
      }
    };
  },

  methods: {
    getCode() {
      apiSendCode({
        data: crypto.encrypt(
          JSON.stringify({
            phone: this.phone,
            type: 1001,
            tag: "gongxin"
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            Toast("手机验证码已经发送，请注意查收");
            this.isSms = false;
            let timer;
            timer = window.setInterval(() => {
              this.smsBtnTxt = this.seconds + "秒";
              this.seconds--;
              if (this.seconds < 1) {
                window.clearInterval(timer);
                this.smsBtnTxt = "获取验证码";
                this.seconds = 60;
                this.isSms = true;
              }
            }, 1000);
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast("数据请求失败");
        });
    },
    // 检测手机号码是否已经被注册
    checkPhone() {
      if (this.phone.length == 11) {
        apiCheckRegister({
          data: crypto.encrypt(
            JSON.stringify({
              phone: this.phone
            })
          )
        })
          .then(result => {
            if (result.code == 0) {
              this.phoneError = "手机号码已经被注册";
              this.isPhoneOk = false;
              this.isSms = false;
            } else if (result.code == 3122) {
              this.isPhoneOk = true;
              this.isSms = true;
            }
          })
          .catch(err => {
            Toast("数据请求失败");
          });
      } else {
        this.phoneError = "";
      }
    },
    // 注册数据判断
    actionRegister() {
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
      // 重复密码
      if (this.resPassword.length == "") {
        isTrue = false;
        this.resPasswordError = "请重复输入登录密码";
      } else if (this.password !== this.resPassword) {
        isTrue = false;
        this.resPasswordError = "两次输入登录密码不一致";
      } else {
        this.resPasswordError = "";
      }
      // 验证码
      if (this.sms.length == "") {
        isTrue = false;
        this.smsError = "请输入手机验证码";
      } else {
        this.smsError = "";
      }
      // 用户协议
      if (!this.checked) {
        isTrue = false;
        Toast("请仔细阅读用户协议，并勾选");
      }
      if (isTrue) this.actionRegisterAxios();
    },
    // 注册数据提交
    actionRegisterAxios() {
      apiRegister({
        data: crypto.encrypt(
          JSON.stringify({
            verificationCode: this.sms,
            regis_type: "mobile",
            user: {
              password: this.password,
              phone: this.phone,
              username: ""
            }
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            this.$store.commit("setToken", result.data.token);
            const toast = Toast.loading({
              duration: 0, // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              loadingType: "spinner",
              message: "注册成功，3 秒后自动跳到首页"
            });

            let second = 3;
            const timer = setInterval(() => {
              second--;
              if (second) {
                toast.message = `注册成功， ${second} 秒后自动跳到首页`;
              } else {
                clearInterval(timer);
                Toast.clear();
              }
            }, 1000);
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast("数据请求失败");
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
    resPasswordEyeFn() {
      if (this.resPasswordEye == "closed-eye") {
        this.resPasswordEye = "eye-o";
        this.resPasswordEyeType = "text";
      } else {
        this.resPasswordEye = "closed-eye";
        this.resPasswordEyeType = "password";
      }
    },
    showUserAgreementFn(e) {
      // 阻止事件冒泡
      e.stopPropagation();
    }
  }
};
</script>


<style lang="less">
.register {
  
  height: 100%;
  background-image: url("../assets/images/register_bg.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom center;
  background-color: #fff;
  .line {
    padding-left: 0.4rem;
    padding-right: 0.4re;
  }
  .close {
    padding-top: 14px;
    padding-right: 14px;
    box-sizing: border-box;
    text-align: right;
    i {
      padding: 10px;
    }
  }
  .app-tab {
    [class*="van-hairline"]::after {
      border: 0;
    }
  }
  .van-tab--active {
    font-weight: 700;
  }
  .form {
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
  }
  .van-checkbox__icon img {
    width: 12px;
    height: 12px;
    margin-top: 5px;
    display: inline-block;
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
}
</style>