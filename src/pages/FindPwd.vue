<template>
  <div class="register">
    <!-- 导航栏 -->
    <van-nav-bar class="nav-area" :title="$route.meta.title" left-arrow @click-left="returnPrePage"/>
    <!-- 手机验证码表单 -->
    <div v-if="type == 0" class="form">
      <van-row type="flex" justify="center">
        <van-col span="22">
          <van-cell-group>
            <van-field v-model="phone" clearable label="手机号码" placeholder="请输入手机号码"/>
            <van-cell-group>
              <van-field v-model="sms" center clearable label="手机验证码" placeholder="请输入手机验证码">
                <van-button slot="button" size="small" type="primary" round>获取验证码</van-button>
              </van-field>
            </van-cell-group>
            <!-- 下边框 -->
            <div class="line">
              <div class="van-hairline--bottom"></div>
            </div>
            <div class="van-cell register-btn">
              <van-button round block type="primary">下一步</van-button>
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
              type="password"
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
              <van-button round block type="primary">找回密码</van-button>
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
    };
  },
  methods: {
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
  .register-btn{
    button{
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
      .van-cell {
      }
    }
    .van-hairline--top-bottom::after {
      border-color: #fff;
    }
  }
}
</style>