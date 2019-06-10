<template>
  <div>
    <!-- 导航栏 area -->
    <van-nav-bar class="nav-area addaddress" :title="$route.meta.title">
      <van-icon name="weapp-nav" slot="right"/>
    </van-nav-bar>
    <!-- 顶部状态 area -->
    <div class="status-area">支付成功</div>
    <!-- 装饰 area -->
    <div class="line-area"></div>
    <!-- 内容 area -->
    <!-- <div class="cont-area">
      <div>订单编号：{{order_sn}}</div>
      <div v-if="alipay">
        支付宝支付：
        <span>¥{{info.total_amount}}</span>
      </div>
      <div v-if="wechat">
        微信支付：
        <span>¥{{wechat | moneyFilter}}</span>
      </div>
      <div v-if="coins">
        积贝支付：
        <span>{{coins | moneyFilter}}</span>
      </div>
      <div v-if="balance">
        余额支付：
        <span>¥{{balance | moneyFilter}}</span>
      </div>
    </div> -->
    <!-- 按钮 area -->
    <div class="btn-area">
      <van-button type="primary" round @click="$router.push({name: 'Home'})">回到首页</van-button>
      <van-button round @click="$router.push({name: 'Orders'})">查看订单</van-button>
    </div>
  </div>
</template>

<script>
import sha1 from "js-sha1";
import wx from "weixin-js-sdk";
import axios from "axios";
import { apiGetAccessTokenr } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      order_sn: "",
      status: "",
      coins: false,
      balance: false,
      wechat: false,
      alipay: true,
      token: "",
      info: {}
    };
  },
  created() {
    
    if (this.$route.query.indexOf("alipay") != -1) {
      this.alipay = true;
    }
    if (!this.$route.query.order_sn || !this.$route.query.status) {
      // this.$router.push({ name: "Home" });
    }
    this.info = this.getUrlParams(location.search)
    this.order_sn = this.$route.query.order_sn;
    this.status = this.$route.query.status;
    this.coins = this.$route.query.coins || 0;
    this.balance = this.$route.query.balance || 0;
    this.wechat = this.$route.query.wechat || 0;
    this.alipay = this.$route.query.alipay || 0;
  },
  methods: {
    getUrlParams(search) {
      const queryList = search.split("&");
      let result = {};
      search &&
        queryList.map(item => {
          let keyValue = item.split("=");
          result[keyValue[0]] = decodeURIComponent(keyValue[1]);
          if (keyValue[0] == "timestamp") {
            result[keyValue[0]] = decodeURIComponent(keyValue[1]).replace(
              "+",
              " "
            );
          }
        });
      return result;
    }
  }
};
</script>

<style lang="less" scoped>
.btn-area {
  width: 80%;
  margin: 0 auto;
  margin-top: 18px;
  button {
    width: 100%;
    &:last-child {
      margin-top: 14px;
    }
  }
}
.status-area {
  height: 84px;
  line-height: 84px;
  color: #f5f5f5;
  background-color: #ff6312;
  padding-left: 34px;
}
.line-area {
  height: 6px;
  background-color: #fff;
  background-image: url(../assets/images/line.png);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.cont-area {
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 12px;
  div {
    padding: 4px 0;
    span {
      font-size: 16px;
      color: #ff6312;
    }
  }
}
</style>