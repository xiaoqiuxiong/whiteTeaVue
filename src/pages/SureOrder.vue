<template>
  <div class="sureOrder">
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

    <!-- 地址栏 area -->
    <router-link :to="{name: 'Address'}" class="address-area">
      <div class="left">
        <div class="top">{{address_consignee}}&nbsp;&nbsp;&nbsp;{{address_mobile}}</div>
        <div class="bottom">{{address_combine}}</div>
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
        <van-cell-group v-if="!is_mask_goods">
          <van-field
            class="auto-filed"
            placeholder="填写备注内容"
            label="订单备注(选填)："
            :left-icon="remarkIcon"
            v-model="order_infos.postscript"
          />

          <!-- 用户含有余额、积贝时，展示对应支付方式 -->
          <van-checkbox-group class="autoRadio" v-model="isPayJibei">
            <van-cell-group>
              <van-cell @click="checkBoxJibei" :icon="isPayJibeiIcon" title="使用积贝进行抵扣" clickable>
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
              <van-cell :icon="isPayYueIcon" title="使用账户余额抵扣" clickable @click="checkBoxStatic">
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
        <van-cell-group v-if="is_mask_goods">
          <van-field
            class="auto-filed"
            placeholder="填写备注内容"
            label="订单备注(选填)："
            :left-icon="remarkIcon"
            v-model="order_infos.postscript"
          />
          <van-cell
            title="运费"
            class="freight"
            :icon="remarkIcon"
            :value="`¥${mask_goods.transferMoney}`"
          />
        </van-cell-group>
      </div>
    </div>
    <!-- 支付方式 area -->
    <div class="pay-type-area" v-if="totalPrice>0">
      <div class="title">支付方式</div>
      <van-radio-group class="autoRadio" v-model="isPayType">
        <van-cell-group>
          <van-cell
            v-if="isWeiXin"
            :icon="payWechatIcon"
            title="微信支付"
            clickable
            @click="isPayType = '1'"
          >
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
    <div class="bottom-box-area"></div>
    <!-- 底部导航 area -->
    <van-submit-bar
      :price="totalPrice*100"
      button-text="提交订单"
      label="合计金额："
      button-type="primary"
      @submit="onSubmit"
    />

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
import {
  apiCheckOrder,
  apiSureOrder,
  apiGetWebAccessToken,
  apiGetWebAccessTicket,
  apiSureMaskOrder,
  apiUserAddress
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, Dialog } from "vant";
import "@/assets/js/ap.js";

export default {
  components: {
    Menu
  },
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
      address_id: -1,
      alipayData: {},
      wechatData: {},
      code: "",
      access_token: "",
      jsapi_ticket: "",
      open_id: "",
      datastr: "",
      signatureStr: "",
      signature: "",
      is_mask_goods: false,
      mask_goods: {},
      addressList: [],
      address_consignee: "",
      address_combine: "",
      address_mobile: ""
    };
  },
  created() {
    // 获取传过来的购物车cart_ids,如果没有重定向到首页
    const cartIdsData = this.$route.query.cart_ids || null;
    if (!cartIdsData) {
      this.$router.replace({ name: "Home" });
      return false;
    }
    this.cart_ids.push(Number(cartIdsData));

    // 检查订单
    this.actionCheckOrder();
    if (this.isWeiXin) {
      this.getWebAccessTicket();
      this.getCode();
    }
  },
  methods: {
    checkBoxJibei() {
      if (this.isPayJibei.length == 1) {
        this.isPayJibei = [];
        this.coinsPayVal = "";
        this;
      } else {
        this.isPayJibei = ["1"];
      }
    },
    checkBoxStatic() {
      if (this.isPayStatic.length == 1) {
        this.isPayStatic = [];
        this.balancePayVal = "";
      } else {
        this.isPayStatic = ["1"];
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
    getWebAccessTicket() {
      apiGetWebAccessTicket({
        data: crypto.encrypt(JSON.stringify({ code: "gongxin" }))
      })
        .then(result => {
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));
            this.jsapi_ticket = result;
          } else {
            Toast(this.APPNAME+result.msg);
          }
        })
        .catch(err => {
          Toast(this.APPNAME+this.ERRORNETWORK);
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
            Toast(this.APPNAME+result.msg);
          }
        })
        .catch(err => {
          Toast(this.APPNAME+this.ERRORNETWORK);
        });
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
        debug: false,
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
            _self.$router.push({
              name: "PayState",
              query: {
                order_sn: _self.wechatData.orderSn,
                status: "订单支付成功"
              }
            });
          },
          cancel: function(res) {
            _self.$router.push({
              name: "PayState",
              query: {
                order_sn: _self.wechatData.orderSn,
                status: "订单支付失败"
              }
            });
          },
          fail: function(res) {
            _self.$router.push({
              name: "PayState",
              query: {
                order_sn: _self.wechatData.orderSn,
                status: "订单支付失败"
              }
            });
          }
        });
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
    // 计算价格
    calcPrice(type) {
      let subTotalPrice = 0;
      const max1 = this.spec_pay_config.max_pay_coins || 0;
      const max2 = this.spec_pay_config.max_pay_balance || 0;
      const max3 = this.cart_goods_infos[0].subtotal || 0;
      const val1 = parseFloat(this.coinsPayVal) || 0;
      const val2 = parseFloat(this.balancePayVal) || 0;
      // 判断勾选了积贝或者余额，三种
      // 积贝+余额
      if (this.isPayJibei.length > 0 && this.isPayStatic.length > 0) {
        if (type) {
          // 改变积贝
          if (max1 > max3) {
            if (val1 > max3) {
              this.coinsPayVal = max3;
              if (this.coinsPayVal + val2 > max3) {
                this.balancePayVal = max3 - this.coinsPayVal;
              }
            } else {
              if (val1 + val2 > max3) {
                this.balancePayVal = max3 - val1;
              }
            }
          } else {
            if (val1 > max1) {
              this.coinsPayVal = max1;
              if (this.coinsPayVal + val2 > max3) {
                this.balancePayVal = max3 - this.coinsPayVal;
              }
            } else {
              if (val1 + val2 > max3) {
                this.balancePayVal = max3 - val1;
              }
            }
          }
        } else {
          // 改变余额
          if (max2 > max3) {
            if (val2 > max3) {
              this.balancePayVal = max3;
              if (val1 + this.balancePayVal > max3) {
                this.coinsPayVal = max3 - this.balancePayVal;
              }
            } else {
              if (val1 + val2 > max3) {
                this.coinsPayVal = max3 - val2;
              }
            }
          } else {
            if (val2 > max2) {
              this.balancePayVal = max2;
              if (val1 + this.balancePayVal > max3) {
                this.coinsPayVal = max3 - this.balancePayVal;
              }
            } else {
              if (val1 + val2 > max3) {
                this.coinsPayVal = max3 - val2;
              }
            }
          }
        }
      }
      // 积贝
      if (this.isPayJibei.length > 0 && this.isPayStatic.length == 0) {
        // 判断最大积贝和需要支付金额谁最大
        if (max1 > max3) {
          if (val1 > max3) {
            this.coinsPayVal = max3;
          }
        } else {
          if (val1 > max1) {
            this.coinsPayVal = max1;
          }
        }
      }
      // 余额
      if (this.isPayJibei.length == 0 && this.isPayStatic.length > 0) {
        // 判断最大余额和需要支付金额谁最大
        if (max2 > max3) {
          if (val2 > max3) {
            this.balancePayVal = max3;
          }
        } else {
          if (val2 > max2) {
            this.balancePayVal = max2;
          }
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
            this.address_id = result.data.receive_address.address_id;
            this.cart_goods_infos = result.data.cart_goods_infos;
            this.spec_pay_config = result.data.spec_pay_config;
            this.order_infos = result.data.order_infos;
            this.totalPrice = this.cart_goods_infos[0].subtotal;
            if (result.data.is_mask_goods) {
              this.mask_goods = result.data.mask_goods;
              this.is_mask_goods = result.data.is_mask_goods;
              this.totalPrice += this.mask_goods.transferMoney;
            }
            if (this.$route.query.address_id) {
              this.address_id = parseFloat(this.$route.query.address_id);
            } else {
              this.address_consignee = result.data.receive_address.consignee;
              this.address_mobile = result.data.receive_address.mobile;
            }
            apiUserAddress().then(result => {
              if (result.code == 0) {
                this.addressList = JSON.parse(crypto.decrypt(result.data));
                console.log(this.addressList);
                this.addressList.filter((e, i) => {
                  if (e.address_id == this.address_id) {
                    this.address_consignee = e.consignee;
                    this.address_mobile = e.mobile;
                    this.allAddress.province.filter((e1, i1) => {
                      if (e.province == e1.region_id) {
                        this.address_combine = e1.region_name;
                      }
                    });
                    this.allAddress.citys.filter((e1, i1) => {
                      if (e.city == e1.region_id) {
                        this.address_combine += `-${e1.region_name}`;
                      }
                    });
                    this.allAddress.district.filter((e1, i1) => {
                      if (e.district == e1.region_id) {
                        this.address_combine += `-${e1.region_name}`;
                      }
                    });
                    this.address_combine += `-${e.address}`;
                    this.order_infos.address = this.address_combine;
                  }
                });
              } else {
                Toast(this.APPNAME+result.msg);
              }
            });
          } else if (result.code == 10087) {
            Dialog.confirm({
              title: "提示",
              message: "亲，先添加收货地址再购物哦",
              confirmButtonText: "去添加地址"
            })
              .then(() => {
                this.$router.replace({ name: "Address" });
              })
              .catch(() => {
                this.$router.replace({ name: "Home" });
              });
          } else {
            Toast(this.APPNAME+result.msg);
            this.$router.replace({ name: "Home" });
          }
          if (this.$route.query.address_id) {
            apiUserAddress()
              .then(result => {
                if (result.code == 0) {
                  this.addressList = JSON.parse(crypto.decrypt(result.data));
                  this.addressList.filter((e, i) => {
                    if (e.address_id == this.$route.query.address_id) {
                      this.receive_address = e;
                    }
                  });
                } else {
                  Toast(this.APPNAME+result.msg);
                }
              })
              .catch(err => {
                Toast(this.APPNAME+this.ERRORNETWORK);
              });
          }
        })
        .catch(err => {
          Toast(this.APPNAME+this.ERRORNETWORK);
        });
    },
    submitAfter(result) {
      if (result.code == 0) {
        result = JSON.parse(crypto.decrypt(result.data));
        if (this.order_infos.pay_id == 4 || this.order_infos.pay_id == 15) {
          this.$router.push({
            name: "PayState",
            query: {
              order_sn: result.order_sn[0],
              status: result.status
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
          if (this.isWeiXin) {
            setTimeout(() => {
              var btn = document.querySelector(".J-btn-submit");
              btn.addEventListener(
                "click",
                function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();
                  var queryParam = "";
                  Array.prototype.slice
                    .call(document.querySelectorAll("input[type=hidden]"))
                    .forEach(function(ele) {
                      queryParam +=
                        "&" + ele.name + "=" + encodeURIComponent(ele.value);
                    });
                  var gotoUrl =
                    document.querySelector("#pay_form").getAttribute("action") +
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
        } else if (this.order_infos.pay_id == 11) {
          this.wechatData = {
            appId: result.appId,
            nonceStr: result.nonceStr,
            orderSn: result.order_sn,
            paySign: result.paySign,
            timeStamp: result.timestamp.toString(),
            signType: result.signType,
            package: result.package
          };
          this.datastr = JSON.stringify(this.wechatData);
          this.wexinPay();
        }
      } else {
        Toast(this.APPNAME+result.msg);
      }
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
      if (this.$route.query.type) {
        apiSureMaskOrder({
          data: crypto.encrypt(
            JSON.stringify({
              address_id: this.address_id,
              cart_ids: this.cart_ids,
              order: this.order_infos,
              open_id: this.open_id,
              is_web: true,
              type: this.$route.query.type
            })
          )
        })
          .then(result => {
            this.submitAfter(result);
          })
          .catch(err => {
            Toast(this.APPNAME+this.ERRORNETWORK);
          });
      } else {
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
            this.submitAfter(result);
          })
          .catch(err => {
            Toast(this.APPNAME+this.ERRORNETWORK);
          });
      }
    }
  },
  computed: {
    allAddress() {
      return JSON.parse(this.$store.state.allAddress);
    }
  }
};
</script>

<style lang="less" scoped>
.freight {
  .van-cell__value {
    justify-content: flex-end;
    span {
      color: #ff5716;
      font-size: 14px;
    }
  }
}
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
  margin-top: 52px;
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