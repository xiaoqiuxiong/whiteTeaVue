<template>
  <div class="register">
    <!-- 导航栏 -->
    <van-nav-bar class="nav-area" :title="$route.meta.title" left-arrow @click-left="onClickLeft"/>
    <!-- 表单 -->
    <div class="form">
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
              <van-button round block type="primary">立即绑定</van-button>
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
      sms: "",
    };
  },
  methods: {
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