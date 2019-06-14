<template>
  <div>
    <!-- 导航栏 area -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="returnPrePage"
      class="nav-area addaddress"
      :title="$route.meta.title"
    >
      <van-icon name="weapp-nav" slot="right"/>
    </van-nav-bar>
    <div class="nav-bar-static-height"></div>
    <!-- 订单信息 area -->
    <div class="order-msg-area tag-read" :data-clipboard-text="data.invoice_no" @click="copy">
      <div>订单编号：{{data.delivery_id}}</div>
      <div>物流公司：{{data.shipping_name}}</div>
      <div class="copy-box">
        物流单号：{{data.invoice_no}}
        <span class="copy">复制</span>
      </div>
    </div>
    <!-- 物流信息 area -->
    <div class="logis-msg-area">
      <van-steps active-color="#FD7023" direction="vertical" :active="0">
        <van-step v-for="(item,index) in data.logs" :key="index">
          <div>{{item.context}}</div>
          <div>{{item.time}}</div>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import { apiWatchWuLiu } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      data: {},
      order_id: null
    };
  },
  created() {
    if (!this.$route.query.order_id) {
      this.$router.replace({ name: "Home" });
      return false;
    }
    this.order_id = this.$route.query.order_id;
    this.fn_watchLogistics(this.order_id);
  },
  methods: {
    copy() {
      let clipboard = new Clipboard(".tag-read");
      clipboard.on("success", e => {
        Toast(this.APPNAME+"复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        Toast(this.APPNAME+"该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    fn_watchLogistics(order_id) {
      const orderId = Number(order_id);
      apiWatchWuLiu({
        data: crypto.encrypt(
          JSON.stringify({
            order_id: orderId
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            this.data = result.data;
          } else {
            Toast(this.APPNAME+result.msg);
          }
        })
        .catch(err => {
          Toast(this.APPNAME+this.ERRORNETWORK);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.order-msg-area {
  background-color: #fff;
  padding: 14px;
  box-sizing: border-box;
  font-size: 12px;
  div {
    height: 24px;
    line-height: 24px;
  }
}
.logis-msg-area {
  margin-top: 6px;
}
.copy {
  color: #fd7023;
  float: right;
}
</style>