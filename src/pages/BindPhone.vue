<template>
  <div class="register">
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="$router.replace({naem: 'Login'})"
    />
    <!-- 表单 -->
    <div class="form">
      <van-row type="flex" justify="center">
        <van-col span="22">
          <van-cell-group>
            <van-field v-model="phone" clearable label="手机号码" placeholder="请输入手机号码"/>
            <van-cell-group>
              <van-field v-model="sms" center clearable label="手机验证码" placeholder="请输入手机验证码">
                <van-button
                  slot="button"
                  size="small"
                  type="primary"
                  @click="getCode"
                  :disabled="!isSms"
                  round
                >{{smsBtnTxt}}</van-button>
              </van-field>
            </van-cell-group>
            <!-- 下边框 -->
            <div class="line">
              <div class="van-hairline--bottom"></div>
            </div>
            <div class="van-cell register-btn">
              <van-button round block type="primary" @click="submitfn">立即绑定</van-button>
            </div>
          </van-cell-group>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { apiSendCode, apiBindWxAppVersion } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      sms: "",
      isSms: true,
      smsBtnTxt: "获取验证码",
      seconds: 60,
      phone: "",
      open_id: "",
      nickname: "",
      headurl: "",
      token: "",
      invite_phone: ""
    };
  },
  created() {
    let querys = this.$route.query;
    if (querys.token == "") {
      this.$router.push({ name: "Login" });
      return false;
    }
    this.open_id = querys.open_id;
    this.nickname = querys.nickname;
    this.headurl = querys.headurl;
    this.token = querys.token;
  },
  methods: {
    getCode() {
      // 判断手机号
      if (this.phone.length == 0) {
        this.$toast("请输入手机号码");
        return false;
      } else if (this.phone.length != 11) {
        this.$toast("请输入正确的手机号码");
        return false;
      }
      apiSendCode({
        data: crypto.encrypt(
          JSON.stringify({
            phone: this.phone,
            type: 1003,
            tag: "gongxin"
          })
        )
      })
        .then(result => {
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
          this.$toast(this.ERRORNETWORK);
        });
    },
    submitfn() {
      // 判断手机号
      if (this.phone.length == 0) {
        this.$toast("请输入手机号码");
        return false;
      } else if (this.phone.length != 11) {
        this.$toast("请输入正确的手机号码");
        return false;
      }
      if (this.sms.length == 0) {
        this.$toast("请输入验证码");
        return false;
      }
      apiBindWxAppVersion({
        data: crypto.encrypt(
          JSON.stringify({
            phone: this.phone,
            ver_code: this.sms,
            open_id: this.open_id,
            nickname: this.nickname,
            headurl: this.headurl,
            token: this.token,
            invite_phone: ""
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
                this.$router.replace({ name: "Home" });
              }
            });
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
    }
  }
};
</script>


<style lang="less">
.register {
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