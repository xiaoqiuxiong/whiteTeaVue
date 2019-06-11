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
      <van-icon @click="$refs.menu.isShow(true)" name="weapp-nav" slot="right"/>
    </van-nav-bar>
    <Menu ref="menu"></Menu>
    <!-- 订单状态 area -->
    <div class="status-area">
      <!-- <div class="left"></div> -->
      <div class="right">{{orderInfo.order.combine.order_status_desc}}</div>
    </div>
    <!-- 地址栏 area -->
    <div class="address-area">
      <div class="left">
        <div
          class="top"
        >{{orderInfo.order.order_info.consignee}}&nbsp;&nbsp;&nbsp;{{orderInfo.order.order_info.mobile}}</div>
        <div
          class="bottom"
        >{{orderInfo.address.province}} {{orderInfo.address.city}} {{orderInfo.address.dist}} {{orderInfo.order.order_info.address}}</div>
      </div>
    </div>
    <!-- <router-link :to="{name: 'Address'}" class="address-area">
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
    </router-link> -->
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
        <div
          class="item-right tag-read"
          :data-clipboard-text="orderInfo.order.order_info.order_sn"
          @click="copy"
        >复制</div>
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
      <van-button
        class="cancal-btn"
        size="small"
        round
        plain
        @click="del(orderInfo.order.order_info.order_id)"
      >取消订单</van-button>
      <van-button class="primary-btn" size="small" round plain @click="pay">立即支付</van-button>
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
      <van-button
        class="cancal-btn"
        size="small"
        round
        plain
        @click="orderLogistics(orderInfo.order.order_info.order_id)"
      >查看物流</van-button>
      <van-button
        class="primary-btn"
        size="small"
        round
        plain
        @click="takeGoods(orderInfo.order.order_info.order_id)"
      >确认收货</van-button>
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
      <van-button class="primary-btn" size="small" round plain @click="commentfn">立即评价</van-button>
    </div>
    <form class="alipayForm" id="pay_form" ref="form" action="alipay/gateway.do" method="post">
      <input type="hidden" name="timestamp" v-model="alipayData.timestamp">
      <input type="hidden" name="method" :value="alipayData.method">
      <input type="hidden" name="app_id" v-model="alipayData.app_id">
      <input type="hidden" name="sign_type" :value="alipayData.sign_type">
      <input type="hidden" name="biz_content" v-model="alipayData.biz_content">
      <input type="hidden" name="sign" v-model="alipayData.sign">
      <input type="hidden" name="version" :value="alipayData.version">
      <input type="hidden" name="format" :value="alipayData.format">
      <input type="hidden" name="charset" :value="alipayData.charset">
      <input type="hidden" name="notify_url" :value="alipayData.notify_url">
      <input type="hidden" name="return_url" :value="alipayData.return_url">
      <input type="submit" class="J-btn-submit">
    </form>
  </div>
</template>
<!-- 按钮 -->
<script>
import Menu from "../components/Menu.vue";
import sha1 from "js-sha1";
import wx from "weixin-js-sdk";
import "@/assets/js/ap.js";
import {
  apiWatchOrder,
  apiCancelOrder,
  apiConfirmOrder,
  apiGetWebAccessToken,
  apiGetWebAccessTicket,
  apiDoPay
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, Dialog } from "vant";
import Clipboard from "clipboard";
export default {
  components: {
    Menu
  },
  data() {
    return {
      orderInfo: {},
      remarkIcon: require("@/assets/images/order_tip.png"),
      isPayJibeiIcon: require("@/assets/images/order_jb.png"),
      isPayYueIcon: require("@/assets/images/order_yue.png"),
      payWechatIcon: require("@/assets/images/pay_wechat.png"),
      payAlipayIcon: require("@/assets/images/pay_alipay.png"),
      alipayData: {},
      wechatData: {},
      code: "",
      access_token: "",
      jsapi_ticket: "",
      open_id: "",
      datastr: "",
      signatureStr: "",
      signature: ""
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
    if (this.isWeiXin) {
      this.getWebAccessTicket();
      this.getCode();
    }
  },
  methods: {
    commentfn(){
      Toast('评论功能正在开发中')
    },
    copy() {
      let clipboard = new Clipboard(".tag-read");
      clipboard.on("success", e => {
        Toast("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        Toast("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    wxConfig() {
      return new Promise((resolve, reject) => {
        this.getWebAccessTicket();
        this.getCode();
      });
    },
    pay() {
      // 判断是微信还是支付宝
      if (this.orderInfo.order.order_info.pay_id == 11) {
        if (this.isWeiXin) {
          apiDoPay({
            data: crypto.encrypt(
              JSON.stringify({
                order_id: this.orderInfo.order.order_info.order_id,
                log_id: this.orderInfo.order.pay_option.log_id,
                pay_id: this.orderInfo.order.order_info.pay_id,
                open_id: this.open_id,
                is_web: true
              })
            )
          })
            .then(result => {
              if (result.code == 0) {
                result = JSON.parse(crypto.decrypt(result.data));
                this.wechatData = {
                  appId: result.appId,
                  nonceStr: result.nonceStr,
                  orderSn: result.order_sn,
                  paySign: result.paySign,
                  timeStamp: result.timestamp.toString(),
                  signType: result.signType,
                  package: result.package
                };
                this.wexinPay();
              } else {
                Toast(result.msg);
              }
            })
            .catch(err => {});
        } else {
          Toast("微信支付需要在微信浏览器上操作哦");
        }
        // 微信支付
      } else if (this.orderInfo.order.order_info.pay_id == 1) {
        // 支付宝支付
        apiDoPay({
          data: crypto.encrypt(
            JSON.stringify({
              order_id: this.orderInfo.order.order_info.order_id,
              log_id: this.orderInfo.order.pay_option.log_id,
              pay_id: this.orderInfo.order.order_info.pay_id,
              is_web: true
            })
          )
        })
          .then(result => {
            if (result.code == 0) {
              result = JSON.parse(crypto.decrypt(result.data));
              const alipayData = this.getUrlParams(result.keyValues);
              this.alipayData = {
                biz_content: alipayData.biz_content,
                app_id: alipayData.app_id,
                timestamp: alipayData.timestamp,
                sign: alipayData.sign,
                method: alipayData.method,
                version: alipayData.version,
                format: alipayData.format,
                charset: alipayData.charset,
                notify_url: alipayData.notify_url,
                return_url: alipayData.return_url,
                sign_type: alipayData.sign_type
              };
              if (this.isWeiXin) {
                setTimeout(() => {
                  let btn = document.querySelector(".J-btn-submit");
                  btn.addEventListener(
                    "click",
                    function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      e.stopImmediatePropagation();
                      let queryParam = "";
                      Array.prototype.slice
                        .call(document.querySelectorAll("input[type=hidden]"))
                        .forEach(function(ele) {
                          queryParam +=
                            "&" +
                            ele.name +
                            "=" +
                            encodeURIComponent(ele.value);
                        });
                      let gotoUrl =
                        document
                          .querySelector("#pay_form")
                          .getAttribute("action") +
                        "?" +
                        queryParam;
                      _AP.pay(gotoUrl);
                      return false;
                    },
                    false
                  );
                  btn.click();
                }, 500);
              } else {
                setTimeout(() => {
                  this.$refs.form.submit();
                }, 500);
              }
            } else {
              Toast(result.msg);
            }
          })
          .catch(err => {});
      }
    },
    getCode() {
      // 非静默授权，第一次有弹框
      this.code = "";
      let local = window.location.href; // 获取页面url
      let appid = this.APPID;
      this.code = this.getUrlCode().code; // 截取code
      if (this.code == null || this.code === "") {
        // 如果没有code，则去请求
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
          local
        )}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
      } else {
        // 你自己的业务逻辑
        this.getGetWebAccessToken();
      }
    },
    getUrlCode() {
      // 截取url中的code方法
      var url = location.search;
      this.winUrl = url;
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
      }
      return theRequest;
    },
    wexinPay() {
      let wechatData = this.wechatData;
      // 签名
      this.signatureStr =
        "jsapi_ticket=" +
        this.jsapi_ticket +
        "&noncestr=" +
        wechatData.nonceStr +
        "&timestamp=" +
        wechatData.timeStamp +
        "&url=" +
        window.location.href;
      this.signature = sha1(this.signatureStr);
      let signature = this.signature;
      wx.config({
        debug: true,
        appId: wechatData.appId,
        timestamp: wechatData.timeStamp,
        nonceStr: wechatData.nonceStr,
        signature: signature,
        jsApiList: ["chooseWXPay"]
      });
      let _self = this;
      wx.ready(function() {
        wx.chooseWXPay({
          timestamp: wechatData.timeStamp,
          nonceStr: wechatData.nonceStr,
          package: wechatData.package,
          signType: wechatData.signType,
          paySign: wechatData.paySign,
          success: function(res) {
            _self.$router.push({ name: "PayState" });
          },
          cancel: function(res) {
            _self.$router.push({ name: "Orders" });
          },
          fail: function(res) {
            _self.$router.push({ name: "Home" });
          }
        });
      });
    },
    getWebAccessTicket() {
      apiGetWebAccessTicket({
        data: crypto.encrypt(JSON.stringify({ code: "gongxin" }))
      })
        .then(result => {
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));
            this.jsapi_ticket = result;
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast(this.ERRORNETWORK);
        });
    },
    getGetWebAccessToken() {
      apiGetWebAccessToken({
        data: crypto.encrypt(JSON.stringify({ code: this.code }))
      })
        .then(result => {
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));
            this.open_id = result.openid;
            this.access_token = result.access_token;
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast(this.ERRORNETWORK);
        });
    },
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
    },
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
                this.$router.push({ name: "Orders" });
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