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
            <van-field v-model="phone" clearable label="手机号码" placeholder="请输入手机号码"/>
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
              type="password"
              label="确认密码"
              placeholder="请再次输入登录密码"
              :right-icon="resPasswordEye"
              @click-right-icon="resPasswordEyeFn"
            />
            <van-cell-group>
              <van-field v-model="sms" center clearable label="手机验证码" placeholder="请输入手机验证码">
                <van-button slot="button" size="small" type="primary" round>获取验证码</van-button>
              </van-field>
            </van-cell-group>
            <!-- 下边框 -->
            <div class="line">
              <div class="van-hairline--bottom"></div>
            </div>
            <div class="van-cell user-agreement">
              <van-checkbox v-model="checked">
                我已看过并接受 <span @click="showUserAgreementFn">《用户协议》</span>
                <img
                  slot="icon"
                  slot-scope="props"
                  :src="props.checked ? icon.active : icon.normal"
                >
              </van-checkbox>
            </div>
           <div class="van-cell register-btn">
              <van-button round block type="primary">注 册</van-button>
           </div>
          </van-cell-group>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      active: 0,
      phone: "",
      password: "",
      passwordEye: "closed-eye",
      passwordEyeType: "password",
      resPassword: "",
      resPasswordEye: "closed-eye",
      resPasswordEyeType: "password",
      sms: "",
      checked: true,
      icon: {
        normal: require("../assets/images/icon-normal.png"),
        active: require("../assets/images/icon-active.png")
      }
    };
  },
  methods: {
    onClick(index, title) {
      if(index == 0){
        this.$router.push({ name: "Register" });
      }else{
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
    showUserAgreementFn(e){
      // 阻止事件冒泡
      e.stopPropagation();
    }
  }
};
</script>


<style lang="less">

.register {
  height: 100%;
  background-image: url('../assets/images/register_bg.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom center;
  .line{
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
      .van-cell {
      }
    }
    .van-hairline--top-bottom::after {
      border-color: #fff;
    }
  }
  .van-checkbox__icon img{
    width: 12px;
    height: 12px;
    margin-top: 5px;
    display: inline-block;
  }
  .user-agreement{
    &:after{
      border-width: 0 !important
    };
    .van-checkbox__label{
      color: #999; 
      span{
        color: #FD751E;
      }
    }
  }
}
</style>