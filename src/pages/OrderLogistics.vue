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
    <div class="order-msg-area">
      <div>订单编号：</div>
      <div>物流公司：</div>
      <div>物流单号：</div>
    </div>
    <!-- 物流信息 area -->
    <div class="logis-msg-area">
      <van-steps direction="vertical" :active="0">
        <van-step>
          <h3>【城市】物流状态1</h3>
          <p>2016-07-12 12:40</p>
        </van-step>
        <van-step>
          <h3>【城市】物流状态2</h3>
          <p>2016-07-11 10:00</p>
        </van-step>
        <van-step>
          <h3>快件已发货</h3>
          <p>2016-07-10 09:30</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script>
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
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast(this.ERRORNETWORK);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.order-msg-area{
  background-color: #fff;
  div{
    height: 30px;
    line-height: 30px;
  }
}
</style>