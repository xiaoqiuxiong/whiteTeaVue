<template>
  <div>
    <!-- 导航栏 area -->
    <van-nav-bar class="nav-area addaddress" :title="$route.meta.title">
      <van-icon name="weapp-nav" slot="right"/>
    </van-nav-bar>
    <!-- 顶部状态 area -->
    <div v-if="status" class="status-area">{{status}}</div>
    <div v-if="!status" class="status-area">支付成功</div>
    <!-- 装饰 area -->
    <div class="line-area"></div>
    <!-- 内容 area -->
    <div class="cont-area">
      <div>订单编号：{{order_sn}}</div>
    </div>
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
      info: {}
    };
  },
  created() {
    if (JSON.stringify(this.$route.query).indexOf("alipay") != -1) {
      this.alipay = true;
      this.order_sn
    }
    this.info = this.getUrlParams(location.search);
    this.order_sn = this.$route.query.order_sn || this.info.trade_no;
    this.status = this.$route.query.status;
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
      font-size: 14px;
      color: #ff6312;
    }
  }
}
</style>