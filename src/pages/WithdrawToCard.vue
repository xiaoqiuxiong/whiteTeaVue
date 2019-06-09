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
    <div class="card">
      <div class="left">
        <van-image width="48" height="48" lazy-load :src="cardInfo.card_logo"/>
        <div class="left-right">
          <div class="top">{{cardInfo.card_name}}</div>
          <div class="bottom" v-if="cardInfo.card_num">{{formatStar(cardInfo.card_num)}}</div>
        </div>
      </div>

      <div class="right">
        <van-icon name="arrow"/>
      </div>
    </div>
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
import { apiUserIndex, apiUserWithdraw, apiUserBanks } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      userInfo: {},
      amount: null,
      real_amount: 0,
      card_id: "",
      name: "",
      cardInfo: {}
    };
  },
  created() {
    if (!this.$route.query.id) {
      this.$router.push({ name: "Home" });
      return false;
    }
    this.card_id = this.$route.query.id;
    this.getUserInfo();
    this.getApiUserBanks();
  },
  methods: {
    formatStar(name) {
      let newStr;
      let char = "";
      let length = name.length;
      for (let i = 1, len = length - 4; i < len; i++) {
        char += "*";
        if ((i / 4) % 1 == 0) {
          char += " ";
          length++;
        }
      }
      newStr = char + name.substr(name.length - 4, 4);
      return newStr;
    },
    getApiUserBanks() {
      apiUserBanks({
        data: crypto.encrypt(
          JSON.stringify({
            get_banks_info: true
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            let list = JSON.parse(crypto.decrypt(result.data));
            list.filter((e, i) => {
              this.cardInfo = e;
            });
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast(this.ERRORNETWORK);
        });
    },
    changeAmount() {
      this.real_amount = parseFloat(
        (this.amount - this.amount * 0.02).toFixed(2)
      );
    },
    userWithdraw() {
      // 判断数据
      if (!this.amount) {
        Toast("请输入提现金额");
        return false;
      }
      if (this.amount > this.userInfo.user_info.user_money) {
        Toast("提现金额不能大于可提现金额");
        this.amount = this.userInfo.user_info.user_money;
        return false;
      }
      this.amount = parseFloat(this.amount) || 0;
      apiUserWithdraw({
        data: crypto.encrypt(
          JSON.stringify({
            amount: this.amount,
            real_amount: this.real_amount,
            card_id: this.card_id,
            type: "bank"
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            Toast("提现成功");
            this.$router.push({ name: "MyProperty" });
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast(this.ERRORNETWORK);
        });
    },
    getUserInfo() {
      apiUserIndex()
        .then(result => {
          if (result.code == 0) {
            this.userInfo = result.data;
          } else {
            Toast(result.msg);
          }
        })
        .catch(error => {
          Toast(this.ERRORNETWORK);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.card {
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 18px 0.4rem;
  box-sizing: border-box;
  justify-content: space-between;
  border-top: 1px solid #f5f5f5;
  .left {
    display: flex;
    .left-right {
      padding-left: 10px;
      box-sizing: border-box;
      div:last-child {
        margin-top: 8px;
        color: #999;
      }
    }
  }
}
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