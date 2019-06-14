<template>
  <div class="register">
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- 手机验证码表单 -->
    <div v-if="type == 0" class="form">
      <van-row type="flex" justify="center">
        <van-col span="22">
          <van-cell-group>
            <van-field v-model="phone" clearable label="手机号码" placeholder="请输入手机号码"/>
            <van-cell-group>
              <van-field v-model="sms" center clearable label="手机验证码" placeholder="请输入手机验证码">
                <van-button
                  slot="button"
                  @click="getCode"
                  :disabled="!isSms"
                  size="small"
                  type="primary"
                  round
                >{{smsBtnTxt}}</van-button>
              </van-field>
            </van-cell-group>
            <!-- 下边框 -->
            <div class="line">
              <div class="van-hairline--bottom"></div>
            </div>
            <div class="van-cell register-btn">
              <van-button round block type="primary" @click="verifyCode">下一步</van-button>
            </div>
          </van-cell-group>
        </van-col>
      </van-row>
    </div>
    <!-- 密码修改表单 -->
    <div v-if="type == 1" class="form">
      <van-row type="flex" justify="center">
        <van-col span="22">
          <van-cell-group>
            <van-field
              v-model="password"
              :type="passwordEyeType"
              label="登录密码"
              placeholder="请输入登陆密码(6-20个字符)"
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
            <!-- 下边框 -->
            <div class="line">
              <div class="van-hairline--bottom"></div>
            </div>
            <div class="van-cell register-btn">
              <van-button round block type="primary" @click="changePwd">找回密码</van-button>
            </div>
          </van-cell-group>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import {
  apiSendCode,
  apiFindBackPwByPhone1,
  apiFindBackPwByPhone2
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      type: 0,
      active: 0,
      phone: "",
      sms: "",
      password: "",
      passwordEye: "closed-eye",
      passwordEyeType: "password",
      resPassword: "",
      resPasswordEye: "closed-eye",
      resPasswordEyeType: "password",
      isSms: true,
      smsBtnTxt: "获取验证码",
      seconds: 60,
      token: ""
    };
  },
  methods: {
    getCode() {
      // 判断手机号
      if (this.phone.length == 0) {
        Toast(this.APPNAME+"请输入手机号码");
        return false;
      } else if (this.phone.length != 11) {
        Toast(this.APPNAME+"请输入正确的手机号码");
        return false;
      }
      apiSendCode({
        data: crypto.encrypt(
          JSON.stringify({
            phone: this.phone,
            type: 1002,
            tag: "gongxin"
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            Toast(this.APPNAME+"手机验证码已经发送，请注意查收");
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
            Toast(this.APPNAME+result.msg);
          }
        })
        .catch(err => {
          Toast(this.APPNAME+this.ERRORNETWORK);
        });
    },
    verifyCode() {
      // 判断手机号
      if (this.phone.length == 0) {
        Toast(this.APPNAME+"请输入手机号码");
        return false;
      } else if (this.phone.length != 11) {
        Toast(this.APPNAME+"请输入正确的手机号码");
        return false;
      }
      // 手机验证码
      if (this.sms.length == 0) {
        Toast(this.APPNAME+"请输入手机验证码");
        return false;
      }
      apiFindBackPwByPhone1({
        data: crypto.encrypt(
          JSON.stringify({
            type: "mobile",
            phone: this.phone,
            code: this.sms
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            this.type = 1;
            this.token = result.data;
          } else {
            Toast(this.APPNAME+result.msg);
          }
        })
        .catch(err => {
          Toast(this.APPNAME+this.ERRORNETWORK);
        });
    },
    changePwd() {
      // 判断数据
      // 密码
      if (this.password.length == "") {
        Toast(this.APPNAME+"请输入登录密码");
        return false;
      } else if (this.password.length < 6 || this.password.length > 20) {
        Toast(this.APPNAME+"登录密码不能少于 6位/密码不能超过20位");
        return false;
      }
      // 重复密码
      if (this.resPassword.length == "") {
        Toast(this.APPNAME+"请重复输入登录密码");
        return false;
      } else if (this.password !== this.resPassword) {
        Toast(this.APPNAME+"两次输入登录密码不一致");
        return false;
      }
      apiFindBackPwByPhone2({
        data: crypto.encrypt(
          JSON.stringify({
            type: "mobile",
            phone: this.phone,
            passwords: {
              token: this.token,
              new_password1: md5(this.password),
              new_password2: md5(this.resPassword)
            }
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            Toast(this.APPNAME+"密码修改成功！");
            this.$router.replace({ name: "Login" });
          } else {
            Toast(this.APPNAME+result.msg);
          }
        })
        .catch(err => {
          Toast(this.APPNAME+this.ERRORNETWORK);
        });
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
    }
  }
};
</script>


<style lang="less">
.register {
  background-color: #fff;
  height: 100vh;
  background-image: url("../assets/images/register_bg.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom center;
  .register-btn {
    button {
      margin-top: 40px;
    }
  }
  .line {
    padding-left: 0.4rem;
    padding-right: 0.4re;
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
}
</style>