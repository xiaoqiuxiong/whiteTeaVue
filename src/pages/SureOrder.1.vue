<template>
  <div class="sureOrder">
    <!-- 导航栏 area -->
    <van-nav-bar
      class="nav-area addaddress"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    >
      <van-icon name="weapp-nav" slot="right"/>
    </van-nav-bar>
    <!-- 地址栏 area -->
    <router-link :to="{name: 'Address'}" class="address-area">
      <div class="left">
        <div class="top">{{receive_address.consignee}}&nbsp;&nbsp;&nbsp;{{receive_address.mobile}}</div>
        <div class="bottom">{{receive_address.address_combine}}</div>
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
      <div class="cont" v-for="(item, index) in cart_goods_infos" :key="index">
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
        <van-cell-group>
          <van-field
            class="auto-filed"
            placeholder="填写备注内容"
            label="订单备注(选填)："
            :left-icon="remarkIcon"
          />
          <!-- 用户含有余额、积贝时，展示对应支付方式 -->
          <van-checkbox-group class="autoRadio" v-model="isPayJibei">
            <van-cell-group>
              <van-cell
                @click="isPayJibei = (isPayJibei.length==1?[]:['1'])"
                :icon="isPayJibeiIcon"
                title="使用积贝进行抵扣"
                clickable
              >
                <van-checkbox checked-color="#fe672c" name="1">
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.checked ? CHECKBOXICON.active : CHECKBOXICON.normal"
                  >
                </van-checkbox>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
          <van-cell-group class="pay-coins-filed">
            <van-field
              @input="calcPrice(true)"
              clearable
              :disabled="isPayJibei.length==0"
              type="number"
              v-model="coinsPayVal"
              :placeholder="`最多可用 ${spec_pay_config.max_pay_coins} 积贝进行抵扣`"
            />
          </van-cell-group>
          <van-checkbox-group class="autoRadio" v-model="isPayStatic">
            <van-cell-group>
              <van-cell
                :icon="isPayYueIcon"
                title="使用账户余额抵扣"
                clickable
                @click="isPayStatic = (isPayStatic.length==1?[]:['1'])"
              >
                <van-checkbox checked-color="#fe672c" name="1">
                  <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.checked ? CHECKBOXICON.active : CHECKBOXICON.normal"
                  >
                </van-checkbox>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
          <van-cell-group class="pay-balance-filed">
            <van-field
              @input="calcPrice(false)"
              clearable
              :disabled="isPayStatic.length == 0"
              type="number"
              v-model="balancePayVal"
              :placeholder="`最多可用 ¥${spec_pay_config.max_pay_balance} 进行抵扣`"
            />
          </van-cell-group>
        </van-cell-group>
      </div>
    </div>
    <!-- 支付方式 area -->
    <div class="pay-type-area" v-if="totalPrice>0">
      <div class="title">支付方式</div>
      <van-radio-group class="autoRadio" v-model="isPayType">
        <van-cell-group>
          <van-cell :icon="payWechatIcon" title="微信支付" clickable @click="isPayType = '1'">
            <van-radio checked-color="#fe672c" name="1">
              <img
                slot="icon"
                slot-scope="props"
                :src="props.checked ? RADIOICON.active : RADIOICON.normal"
              >
            </van-radio>
          </van-cell>
          <van-cell :icon="payAlipayIcon" title="支付宝支付" clickable @click="isPayType = '2'">
            <van-radio checked-color="#fe672c" name="2">
              <img
                slot="icon"
                slot-scope="props"
                :src="props.checked ? RADIOICON.active : RADIOICON.normal"
              >
            </van-radio>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
    <div>{{access_token}}</div>
    <br>
    <br>
    <div>{{code}}</div>
    <div class="bottom-box-area"></div>
    <!-- 底部导航 area -->
    <van-submit-bar
      :price="totalPrice*100"
      button-text="提交订单"
      label="合计金额："
      button-type="primary"
      @submit="onSubmit"
    />

    <form class="alipayForm" ref="form" action="alipay/gateway.do" method="post">
      <input name="timestamp" v-model="alipayData.timestamp">
      <input name="method" :value="alipayData.method">
      <input name="app_id" v-model="alipayData.app_id">
      <input name="sign_type" :value="alipayData.sign_type">
      <input name="sign" v-model="alipayData.sign">
      <input name="version" :value="alipayData.version">
      <input name="biz_content" v-model="alipayData.biz_content">
      <input name="format" :value="alipayData.format">
      <input name="charset" :value="alipayData.charset">
      <input name="notify_url" :value="alipayData.notify_url">
      <input name="return_url" :value="alipayData.return_url">
      <input type="submit">
    </form>
  </div>
</template>
<!-- 按钮 -->
<script>
import sha1 from "js-sha1";
import wx from "weixin-js-sdk";
import axios from "axios";
import { apiCheckOrder, apiSureOrder, apiGetAccessToken,apiGetWebAccessTicket } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      cart_ids: [],
      receive_address: {},
      cart_goods_infos: [],
      remarkIcon: require("@/assets/images/order_tip.png"),
      isPayJibeiIcon: require("@/assets/images/order_jb.png"),
      isPayYueIcon: require("@/assets/images/order_yue.png"),
      payWechatIcon: require("@/assets/images/pay_wechat.png"),
      payAlipayIcon: require("@/assets/images/pay_alipay.png"),
      isPayJibei: [],
      payCoinsFiledOn: false,
      payBalanceFiledOn: false,
      isPayStatic: [],
      isPayType: "0",
      spec_pay_config: {},
      coinsPayVal: "",
      balancePayVal: "",
      order_infos: {},
      totalPrice: 0,
      address_id: 85,
      alipayData: {},
      wechatData: {},
      code: "",
      access_token: "",
      jsapi_ticket: "",
      open_id: ""
    };
  },
  created() {
    // let str = "http://wxnatapp.xiaoqiuxiong.cn/?code=061AmfV01N4V8Y1FQlW01vTdV01AmfV5&state=STATE#/sureOrder?cart_ids=1127";
    // let first = str.indexOf("=") + 1;
    // let last = str.indexOf("&");
    // alert(str.substring(first, last));
    var script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.src = "http://res.wx.qq.com/open/js/jweixin-1.2.0.js";
    document.body.appendChild(script1);
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      if (window.location.search.indexOf("code") < 0) {
        alert("授权");
        alert(location.href);
        window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0e598afa34c6496d&redirect_uri=" +
          encodeURIComponent(location.href) +
          "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
      } else if (window.location.search.indexOf("code") > -1) {
        alert("授权结束");
        alert(window.location.search);
        let str = window.location.search;
        let first = str.indexOf("=") + 1;
        let last = str.indexOf("&");
        alert(first);
        alert(last);
        this.code = str.substring(first, last);
        // this.code = this.getUrlParams(window.location).code;
        alert(this.code);
        apiGetAccessToken({
          data: crypto.encrypt(
            JSON.stringify({
              code: this.code
            })
          )
        })
          .then(result => {
            if (result.code == 0) {
              result = JSON.parse(crypto.decrypt(result.data));
              this.open_id = result.openid;
              this.access_token = result.access_token;
              apiGetWebAccessTicket().then((result) => {
                if(result.code == 0){
                  result = JSON.parse(crypto.decrypt(result.data));
                  alert(JSON.stringify('ticket:'+result))
                  this.jsapi_ticket = result.ticket
                }
              }).catch((err) => {
                
              });
            }
          })
          .catch(err => {});
  
      }
    }
    // 获取传过来的购物车cart_ids,如果没有重定向到首页
    const cartIdsData = this.$route.query.cart_ids || null;
    if (!cartIdsData) {
      this.$router.replace({ name: "Home" });
      return false;
    }
    this.cart_ids.push(Number(cartIdsData));
    // 检查订单
    this.actionCheckOrder();
  },
  methods: {
    wexinPay() {
      // 判断当前url 是否含有code
      alert("开始获取票据");
      let url =
        "/api/cgi-bin/ticket/getticket?access_token=" +
        this.access_token +
        "&type=jsapi";
      alert(url);
      axios
        .get(url)
        .then(result => {
          alert(JSON.stringify(result.data));
          if (result.data.errcode == 0) {
            this.jsapi_ticket = result.data.ticket;
            this.wechatData.signature = sha1(
              "jsapi_ticket=" +
                this.jsapi_ticket +
                "&noncestr=" +
                this.wechatData.nonceStr +
                "&timestamp=" +
                this.wechatData.timeStamp +
                "&url=" +
                "http://wxnatapp.xiaoqiuxiong.cn" +
                this.$route.fullPath
            );
            alert("signature:" + this.wechatData.signature);
            let wechatData = this.wechatData;
            wx.config({
              debug: true,
              appId: this.wechatData.appId,
              timestamp: this.wechatData.timestamp,
              nonceStr: this.wechatData.nonceStr,
              signature: this.wechatData.signature,
              jsApiList: ["chooseWXPay"]
            });

            wx.ready(function() {
              wx.checkJsApi({
                jsApiList: ["chooseWXPay"],
                success: function(res) {
                  if (res.checkResult.chooseWXPay) {
                    alert(JSON.stringify(wechatData));
                    wx.chooseWXPay({
                      timestamp: wechatData.timeStamp,
                      nonceStr: wechatData.nonceStr,
                      package: wechatData.package,
                      signType: wechatData.signType,
                      paySign: wechatData.paySign,
                      success: function(res) {
                        alert(res);
                      }
                    });
                  }
                }
              });
            });
          }
        })
        .catch(err => {
          alert(err);
        });
    },
    getUrlParams(search) {
      alert(search);
      const queryList = search.split("?")[1].split("&");
      alert(JSON.stringify(queryList));
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
    // 计算价格
    calcPrice(type) {
      let subTotalPrice = 0;
      const maxcoins = this.spec_pay_config.max_pay_coins;
      const maxbalance = this.spec_pay_config.max_pay_balance;
      const maxPrice = this.cart_goods_infos[0].subtotal;
      if (type) {
        if (maxcoins > maxbalance) {
          if (this.farmatNum(this.coinsPayVal) > maxbalance) {
            this.coinsPayVal = maxbalance;
          }
        } else {
          if (this.farmatNum(this.coinsPayVal) > maxcoins) {
            this.coinsPayVal = maxcoins;
          }
        }
        if (this.farmatNum(this.coinsPayVal) > maxPrice) {
          this.coinsPayVal = maxPrice;
        }
        if (
          this.farmatNum(this.coinsPayVal) +
            this.farmatNum(this.balancePayVal) >
            maxPrice &&
          this.isPayStatic.length > 0
        ) {
          this.balancePayVal = maxPrice - this.farmatNum(this.coinsPayVal);
        }
      } else {
        if (maxcoins > maxbalance) {
          if (this.farmatNum(this.balancePayVal) > maxbalance) {
            this.balancePayVal = maxbalance;
          }
        } else {
          if (this.farmatNum(this.balancePayVal) > maxcoins) {
            this.balancePayVal = maxcoins;
          }
        }
        if (this.farmatNum(this.balancePayVal) > maxPrice) {
          this.balancePayVal = maxPrice;
        }
        if (
          this.farmatNum(this.balancePayVal) +
            this.farmatNum(this.coinsPayVal) >
            maxPrice &&
          this.isPayJibei.length > 0
        ) {
          this.coinsPayVal = maxPrice - this.farmatNum(this.balancePayVal);
        }
      }
      subTotalPrice =
        this.farmatNum(this.coinsPayVal) + this.farmatNum(this.balancePayVal);
      this.totalPrice = (
        this.cart_goods_infos[0].subtotal - subTotalPrice
      ).toFixed(2);
      if (this.totalPrice <= 0) {
        this.isPayType = "0";
      }
    },
    farmatNum(num) {
      const numdata = num || 0;
      return Number(parseFloat(numdata).toFixed(2));
    },
    actionCheckOrder() {
      apiCheckOrder({
        data: crypto.encrypt(JSON.stringify({ cart_ids: this.cart_ids }))
      })
        .then(result => {
          if (result.code == 0) {
            this.receive_address = result.data.receive_address;
            this.cart_goods_infos = result.data.cart_goods_infos;
            this.spec_pay_config = result.data.spec_pay_config;
            this.order_infos = result.data.order_infos;
            this.totalPrice = this.cart_goods_infos[0].subtotal;
          } else {
            // this.$router.replace({ name: "Home" });
          }
        })
        .catch(err => {
          Toast(this.ERRORNETWORK);
        });
    },
    onSubmit() {
      if (this.isPayType == "1") {
        this.order_infos.pay_id = 11;
      } else if (this.isPayType == "2") {
        this.order_infos.pay_id = 1;
      } else if (this.isPayType == "0") {
        if (
          this.isPayStatic.length > 0 &&
          this.farmatNum(this.balancePayVal) > 0
        ) {
          this.order_infos.pay_id = 4;
        } else {
          this.order_infos.pay_id = 15;
        }
      }
      if (
        this.isPayStatic.length > 0 &&
        this.farmatNum(this.balancePayVal) > 0
      ) {
        this.order_infos.surplus = this.farmatNum(this.balancePayVal);
      }
      if (this.isPayJibei.length > 0 && this.farmatNum(this.coinsPayVal) > 0) {
        this.order_infos.coins = this.farmatNum(this.coinsPayVal);
      }

      apiSureOrder({
        data: crypto.encrypt(
          JSON.stringify({
            address_id: this.address_id,
            cart_ids: this.cart_ids,
            order: this.order_infos,
            open_id: this.open_id,
            is_web: true
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));
            if (this.order_infos.pay_id == 4 || this.order_infos.pay_id == 15) {
              this.$router.push({
                name: "PayState",
                query: {
                  order_sn: result.order_sn[0],
                  status: result.status,
                  coins: this.order_infos.coins,
                  balance: this.order_infos.surplus
                }
              });
            } else if (this.order_infos.pay_id == 1) {
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

              setTimeout(() => {
                this.$refs.form.submit();
              }, 500);
            } else if (this.order_infos.pay_id == 11) {
              console.log(this.wechatData);
              this.wechatData = {
                appId: result.appId,
                nonceStr: result.nonceStr,
                orderSn: result.order_sn,
                paySign: result.paySign,
                timestamp: result.timestamp,
                signType: result.signType,
                package: result.package
              };
              this.wexinPay();
            }
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
.alipayForm {
  display: none;
}
.bottom-box-area {
  height: 60px;
}
.pay-type-area {
  margin-top: 10px;
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
  margin-top: 6px;
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