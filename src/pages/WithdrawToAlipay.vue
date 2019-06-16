<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area"
      fixed
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- fundIntegral-area -->
    <div class="fundIntegral-area">
      可提现余额：
      <span v-if="userInfo.user_info">{{userInfo.user_info.user_money | moneyFilter}}</span>
    </div>
    <van-cell-group>
      <van-field v-model="card_id" clearable label="支付宝账号：" placeholder="请输入支付宝账号"></van-field>
      <van-field v-model="name" clearable label="姓名：" placeholder="请输入真实姓名"></van-field>
    </van-cell-group>
    <van-cell-group class="money">
      <van-field
        class="money-field"
        v-model="amount"
        clearable
        label="提现金额："
        type="number"
        @input="changeAmount"
        placeholder="提现金额1000元起受理"
      ></van-field>
      <span>手续费率2%</span>
    </van-cell-group>
    <div class="real-amount-area">
      实际到账：
      <span>{{real_amount | moneyFilter}}元</span>
    </div>
    <div class="btn-box">
      <van-button round type="primary" @click="userWithdraw">提 交</van-button>
    </div>
  </div>
</template>

<script>
import { apiUserIndex, apiUserWithdraw } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      userInfo: {},
      amount: null,
      real_amount: 0,
      card_id: "",
      type: 2,
      name: "",
      loadingMsg: ""
    };
  },
  created() {
    this.loadingMsg = Toast.loading({
      duration: 0,
      forbidClick: true,
      loadingType: "spinner",
      message: "loading..."
    });
    this.getUserInfo();
  },
  methods: {
    changeAmount() {
      this.real_amount = parseFloat(
        (this.amount - this.amount * 0.02).toFixed(2)
      );
    },
    userWithdraw() {
      // 判断数据
      if (!this.card_id) {
        this.$toast("请输入支付宝账号");
        return false;
      }
      if (!this.name) {
        this.$toast("请输入真实姓名");
        return false;
      }
      if (!this.amount) {
        this.$toast("请输入提现金额");
        return false;
      }
      if (this.amount > this.userInfo.user_info.user_money) {
        this.$toast("提现金额不能大于可提现金额");
        this.amount = this.userInfo.user_info.user_money;
        return false;
      }
      this.amount = parseFloat(this.amount) || 0;
      this.loadingMsg = Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: "spinner",
        message: "loading..."
      });
      apiUserWithdraw({
        data: crypto.encrypt(
          JSON.stringify({
            amount: this.amount,
            real_amount: this.real_amount,
            card_id: this.card_id,
            type: "alipay",
            name: this.name
          })
        )
      })
        .then(result => {
          this.loadingMsg.clear();
          if (result.code == 0) {
            this.$toast("提现成功");
            this.$router.push({ name: "MyProperty" });
          } else {
            this.$toast(result.msg);
          }
        })
        .catch(err => {
          this.loadingMsg.clear();
          this.$toast(this.ERRORNETWORK);
        });
    },
    getUserInfo() {
      apiUserIndex()
        .then(result => {
          this.loadingMsg.clear();
          if (result.code == 0) {
            this.userInfo = result.data;
          } else {
            this.$toast(result.msg);
          }
        })
        .catch(error => {
          this.loadingMsg.clear();
          this.$toast(this.ERRORNETWORK);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.real-amount-area {
  margin-top: 10px;
  padding: 0 0.4rem;
  box-sizing: border-box;
  color: #999;
  display: flex;
  align-items: center;
  span {
    color: #ff7612;
    font-size: 16px;
  }
}
.money {
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    padding-right: 0.4rem;
    box-sizing: border-box;
    font-size: 12px;
    color: #999;
  }
}
.money-field {
  flex: 1;
}
.dialog-box {
  padding: 20px 40px;
  box-sizing: border-box;
  .icon-box {
    display: block;
    text-align: center;
    span {
      display: inline-block;
      height: 34px;
      width: 34px;
      background-image: url(../assets/images/success.png);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  .txt {
    text-align: center;
    margin-top: 14px;
    font-size: 14px;
    line-height: 1.8;
    a {
      color: #ff7612;
    }
  }
}
.btn-box {
  width: 80%;
  margin: 0 auto;
  margin-top: 14px;
  .van-button--primary {
    width: 100%;
  }
}
.fundIntegral-area {
  margin-top: 52px;
  height: 48px;
  line-height: 48px;
  background-color: #fff;
  padding: 0 0.4rem;
  box-sizing: border-box;
  span {
    color: #ff7612;
  }
}
.all-btn {
  border: 1px solid #ff7612;
  color: #ff7612;
}
</style>