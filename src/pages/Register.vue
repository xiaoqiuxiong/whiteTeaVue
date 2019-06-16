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
            />
            <van-field
              v-model="password"
              :type="passwordEyeType"
              label="登录密码"
              placeholder="请输入登录密码"
              :right-icon="passwordEye"
              @click-right-icon="passwordEyeFn"
            />
            <van-field
              v-model="resPassword"
              :type="resPasswordEyeType"
              label="确认密码"
              placeholder="请再次输入密码"
              :right-icon="resPasswordEye"
              @click-right-icon="resPasswordEyeFn"
            />
            <van-cell-group>
              <van-field v-model="sms" center clearable label="手机验证码" placeholder="请输入手机验证码">
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
                <span @click.stop="showUserAgreementFn">《用户协议》</span>
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
import md5 from "js-md5";
import { apiCheckRegister, apiSendCode, apiRegister } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      loading: "",
      active: 0,
      phone: "",
      password: "",
      passwordEye: "closed-eye",
      passwordEyeType: "password",
      resPassword: "",
      resPasswordEye: "closed-eye",
      resPasswordEyeType: "password",
      isPhoneOk: false,
      sms: "",
      isSms: true,
      smsBtnTxt: "获取验证码",
      seconds: 60,
      checked: true,
      icon: {
        normal: require("../assets/images/icon-normal.png"),
        active: require("../assets/images/icon-active.png")
      }
    };
  },
  methods: {
    getCode() {
      this.loading = Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: "spinner",
        message: "数据加载"
      });
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
          this.loading.clear();
          if (result.code == 0) {
            this.$toast("手机验证码已经发送，请注意查收");
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
            this.$toast(result.msg);
          }
        })
        .catch(err => {
          this.loading.clear();
          this.$toast(this.ERRORNETWORK);
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
              this.$toast("手机号码已经注册");
              this.isPhoneOk = false;
              this.isSms = false;
            } else if (result.code == 3122) {
              this.$toast("手机号码可用");
              this.isPhoneOk = true;
              this.isSms = true;
            }
          })
          .catch(err => {
            this.$toast(this.ERRORNETWORK);
          });
      }
    },
    // 注册数据判断
    actionRegister() {
      // 手机号码
      if (this.phone.length == 0) {
        this.$toast('请输入手机号码');
        return false;
      } else if (this.phone.length != 11) {
        this.$toast('请输入正确的手机号码');
        return false;
      }
      // 密码
      if (this.password.length == "") {
        this.$toast('请输入登录密码');
        return false;
      } else if (this.password.length < 6 || this.password.length > 20) {
        this.$toast('登录密码不能少于6位/密码不能超过20位');
        return false;
      }
      // 重复密码
      if (this.resPassword.length == "") {
        this.$toast('请重复输入登录密码');
        return false;
      } else if (this.password !== this.resPassword) {
        this.$toast('请重复输入两次输入登录密码不一致登录密码');
        return false;
      }
      // 验证码
      if (this.sms.length == "") {
        this.$toast('请输入手机验证码');
        return false;
      }
      // 用户协议
      if (!this.checked) {
        this.$toast("请仔细阅读用户协议，并勾选");
        return false;
      }
      this.actionRegisterAxios();
    },
    // 注册数据提交
    actionRegisterAxios() {
      this.loading = Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: "spinner",
        message: "loading..."
      });
      apiRegister({
        data: crypto.encrypt(
          JSON.stringify({
            verificationCode: this.sms,
            regis_type: "mobile",
            user: {
              password: md5(this.password),
              phone: this.phone,
              username: ""
            }
          })
        )
      })
        .then(result => {
          this.loading.clear();
          if (result.code == 0) {
            Toast({
              type: "success",
              message: "注册成功",
              mask: true,
              duration: 1500,
              onClose: () => {
                this.$router.replace({ name: "Login" });
              }
            });
          } else {
            this.$toast(result.msg);
          }
        })
        .catch(err => {
          this.loading.clear();
          this.$toast(this.ERRORNETWORK);
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
      this.$router.push({ name: "RegisterRule" });
    }
  }
};
</script>


<style lang="less" scope>
.register {
  height: 100vh;
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