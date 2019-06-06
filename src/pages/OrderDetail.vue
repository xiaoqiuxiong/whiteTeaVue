<template>
  <div class="sureOrder" v-if="JSON.stringify(orderInfo) != '{}'">
    <!-- 导航栏 area -->
    <van-nav-bar
      fixed
      class="nav-area addaddress"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    >
      <van-icon name="weapp-nav" slot="right"/>
    </van-nav-bar>
    <!-- 订单状态 area -->
    <div class="status-area">
      <!-- <div class="left"></div> -->
      <div class="right">{{orderInfo.order.combine.order_status_desc}}</div>
    </div>
    <!-- 地址栏 area -->
    <router-link :to="{name: 'Address'}" class="address-area">
      <div class="left">
        <div
          class="top"
        >{{orderInfo.order.order_info.consignee}}&nbsp;&nbsp;&nbsp;{{orderInfo.order.order_info.mobile}}</div>
        <div
          class="bottom"
        >{{orderInfo.address.province}} {{orderInfo.address.city}} {{orderInfo.address.dist}} {{orderInfo.order.order_info.address}}</div>
      </div>
      <div class="right">
        <van-icon name="arrow" size="18"/>
      </div>
    </router-link>
    <!-- 装饰线 area -->
    <div class="line-area"></div>
    <!-- 商品 area -->
    <div class="goods-area">
      <div class="platform">商品将由平台为您打包寄出</div>
      <div class="cont" v-for="(item, index) in orderInfo.goods" :key="index">
        <div class="left">
          <van-image fit="cover" lazy-load :src="item.goods_thumb"/>
        </div>
        <div class="right">
          <div class="top">
            <div class="goods-name">{{item.goods_name}}</div>
            <div class="goods-attr">{{item.goods_attr}}</div>
          </div>
          <div class="bottom">
            <div class="bottom-left">¥ {{item.goods_price | moneyFilter}}</div>
            <div class="bottom-right">×{{item.goods_number}}</div>
          </div>
        </div>
      </div>
      <!-- 订单信息 area -->
      <div class="order-tip-area">
        <van-cell
          title="订单备注："
          :icon="remarkIcon"
          :value="orderInfo.order.order_info.card_message"
        />
        <van-cell
          v-if="orderInfo.order.order_info.coins"
          title="使用积贝进行抵扣："
          :icon="isPayJibeiIcon"
        >- {{orderInfo.order.order_info.coins | moneyFilter}}</van-cell>
        <van-cell
          v-if="orderInfo.order.order_info.surplus"
          title="使用账户余额抵扣："
          :icon="isPayYueIcon"
        >- {{orderInfo.order.order_info.surplus | moneyFilter}}</van-cell>
        <van-cell
          class="realy-pay"
          title="实际付款"
        >¥{{orderInfo.order.order_info.total_fee | moneyFilter}}</van-cell>
      </div>
    </div>
    <!-- 支付方式 area -->
    <div
      class="pay-type-area"
      v-if="orderInfo.order.order_info.pay_id == 1 || orderInfo.order.order_info.pay_id == 11"
    >
      <div class="title">支付方式</div>
      <van-cell v-if="orderInfo.order.order_info.pay_id == 11" title="微信支付" :icon="payWechatIcon"/>
      <van-cell v-if="orderInfo.order.order_info.pay_id == 1" title="支付宝支付" :icon="payAlipayIcon"/>
    </div>

    <!-- 订单号信息 area -->
    <div class="order-msg-area">
      <div class="title">
        <div class="left"></div>
        <div class="right">订单信息</div>
      </div>
      <div class="item">
        <div class="item-left">
          <div class="left">订单编号：</div>
          <div class="center">{{orderInfo.order.order_info.order_sn}}</div>
        </div>
        <div class="item-right">复制</div>
      </div>
      <div class="item">
        <div class="item-left">
          <div class="left">创建时间：</div>
          <div class="center">{{orderInfo.order.order_info.add_time | timeFilter}}</div>
        </div>
      </div>
    </div>
    <div class="bottom-tip-area"></div>
    <div class="bottom-box-area" v-if="orderInfo.order.order_info.order_status == 0">
      <van-button class="cancal-btn" size="small" round plain @click="del(orderInfo.order.order_info.order_id)">取消订单</van-button>
      <van-button class="primary-btn" size="small" round plain>立即支付</van-button>
    </div>
    <div class="bottom-box-area" v-if="orderInfo.order.order_info.order_status == 1">
      <van-button class="cancal-btn" size="small" round plain @click="remindDelivery">提醒发货</van-button>
      <van-button
        class="primary-btn"
        size="small"
        round
        plain
        @click="$router.push({name: 'Home'})"
      >再来一单</van-button>
    </div>
    <div class="bottom-box-area" v-if="orderInfo.order.order_info.order_status == 2">
      <van-button class="cancal-btn" size="small" round plain @click="orderLogistics(orderInfo.order.order_info.order_id)">查看物流</van-button>
      <van-button class="primary-btn" size="small" round plain @click="takeGoods(orderInfo.order.order_info.order_id)">确认收货</van-button>
    </div>
    <div class="bottom-box-area" v-if="orderInfo.order.order_info.order_status == 3">
      <van-button
        class="primary-btn"
        size="small"
        round
        plain
        @click="$router.push({name: 'Home'})"
      >再来一单</van-button>
    </div>
    <div class="bottom-box-area" v-if="orderInfo.order.order_info.order_status == 5">
      <van-button class="primary-btn" size="small" round plain>立即评价</van-button>
    </div>
  </div>
</template>
<!-- 按钮 -->
<script>
import { apiWatchOrder, apiCancelOrder, apiConfirmOrder } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      orderInfo: {},
      remarkIcon: require("@/assets/images/order_tip.png"),
      isPayJibeiIcon: require("@/assets/images/order_jb.png"),
      isPayYueIcon: require("@/assets/images/order_yue.png"),
      payWechatIcon: require("@/assets/images/pay_wechat.png"),
      payAlipayIcon: require("@/assets/images/pay_alipay.png")
    };
  },
  created() {
    // 获取传过来的order_id,如果没有重定向到首页
    const orderidData = this.$route.query.order_id || null;
    if (!orderidData) {
      this.$router.replace({ name: "Home" });
      return false;
    }
    // 检查订单
    this.actionCheckOrder(Number(orderidData));
  },
  methods: {
    orderLogistics(order_id) {
      this.$router.push({
        name: "OrderLogistics",
        query: { order_id: order_id }
      });
    },
    takeGoods(order_id) {
      apiConfirmOrder({
        data: crypto.encrypt(
          JSON.stringify({
            order_id: order_id
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            Toast("已经确认收货");
            this.list.filter((e, i) => {
              if (e.order_id == order_id) {
                this.list[i].order_final_status = 4;
              }
            });
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast(this.ERRORNETWORK);
        });
      return false;
    },
    del(order_id) {
      Dialog.confirm({
        closeOnClickOverlay: true,
        message: "您确认取消该订单？"
      })
        .then(() => {
          // on confirm
          apiCancelOrder({
            data: crypto.encrypt(
              JSON.stringify({
                order_id: order_id
              })
            )
          })
            .then(result => {
              if (result.code == 0) {
                Toast("已经取消订单");
                this.list.filter((e, i) => {
                  if (e.order_id == order_id) {
                    this.list.splice(i, 1);
                  }
                });
              } else {
                Toast(result.msg);
              }
            })
            .catch(err => {
              Toast(this.ERRORNETWORK);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    remindDelivery() {
      Toast("已经提醒工作人员尽快安排发货，请耐心等待");
    },
    actionCheckOrder(order_id) {
      apiWatchOrder({
        data: crypto.encrypt(JSON.stringify({ order_id: order_id }))
      })
        .then(result => {
          if (result.code == 0) {
            this.orderInfo = result.data;
          } else {
            this.$router.replace({ name: "Home" });
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
.bottom-tip-area {
  height: 70px;
}
.bottom-box-area {
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  box-sizing: border-box;
  .cancal-btn {
    color: #999;
    margin-left: 6px;
  }
  .primary-btn {
    border: 1px solid #f66525;
    color: #f66525;
    margin-left: 6px;
  }
}
.order-msg-area {
  padding: 0 20px 14px 20px;
  background-color: #fff;
  margin-top: 6px;
  .title {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    .left {
      width: 2px;
      height: 14px;
      background-color: #fd7023;
    }
    .right {
      padding-left: 6px;
    }
  }
  .item {
    height: 24px;
    line-height: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #666;
    font-size: 12px;
    .item-left {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .item-right {
      color: #fd7023;
      padding: 4px 10px;
    }
  }
}
.realy-pay {
  .van-cell__title {
    font-size: 14px;
  }
  .van-cell__value {
    color: #fd7023 !important;
    font-size: 16px;
  }
}
.status-area {
  margin-top: 44px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(
    91deg,
    rgba(250, 166, 51, 1) 0%,
    rgba(255, 70, 10, 1) 100%
  );
  color: #ffffff;
  padding-left: 40px;
  .left {
    width: 20px;
    height: 20px;
    background-image: url(../assets/images/status.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
  }
  .right {
    padding-left: 10px;
  }
}
.pay-type-area {
  margin-top: 6px;
  background-color: #fff;
  padding: 0 20px;
  .title {
    line-height: 40px;
  }
  .van-cell {
    padding-left: 0;
    padding-right: 0;
    font-size: 12px;
    border-bottom: 1px solid #f5f5f5;
    &:last-child {
      border-bottom: 0;
    }
  }
  .van-hairline--top-bottom::after {
    display: none;
  }
  .van-cell:not(:last-child)::after {
    display: none;
  }
}
.goods-area {
  padding: 10px 20px;
  background-color: #fff;
  .platform {
    font-size: 12px;
    color: #666;
  }
  .cont {
    padding: 14px 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f5f5f5;
    .left {
      width: 96px;
      height: 96px;
    }
    .right {
      flex: 1;
      padding-left: 16px;
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;

      .top {
        flex: 0 0 100%;
        .goods-name {
          font-size: 12px;
        }
        .goods-attr {
          font-size: 12px;
          color: #666;
          margin-top: 10px;
        }
      }
      .bottom {
        flex: 0 0 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .bottom-left {
          font-size: 16px;
          color: #fe672c;
        }
        .bottom-right {
          font-size: 12px;
        }
      }
    }
  }
  .order-tip-area {
    .van-cell {
      padding-left: 0;
      padding-right: 0;
      font-size: 12px;
      border-bottom: 1px solid #f5f5f5;
      &:last-child {
        border-bottom: 0;
      }
      .van-cell__value {
        justify-content: flex-end;
        color: #333;
      }
    }
    .van-cell:not(:last-child)::after {
      display: none;
    }
    .van-hairline--top-bottom::after {
      display: none;
    }
  }
}
.address-area {
  padding: 20px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    .top {
      font-size: 14px;
    }
    .bottom {
      font-size: 12px;
      margin-top: 10px;
    }
    flex: 1;
  }
}
.line-area {
  height: 6px;
  width: 100%;
  background-image: url(../assets/images/line.png);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: #fff;
}
</style>