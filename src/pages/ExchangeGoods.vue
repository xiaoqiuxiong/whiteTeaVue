<template>
  <div ref="box">
    <Menu ref="menu"></Menu>
    <van-skeleton
      title
      avatar-size="96vw"
      avatar-shape="square"
      avatar
      :row="10"
      :row-width="['70%','70%','80%','70%','70%','70%']"
      :loading="loading"
    >
      <div>
        <!-- 原始顶部按钮 area -->
        <div class="old-btns-area" ref="oldtabArea">
          <div @click="returnPrePage" class="left"></div>
          <div class="right" @click="$refs.menu.isShow(true)"></div>
        </div>
        <!-- 轮播商品图 area -->
        <div v-if="goodsInfo.Banner" class="goods-swipe" ref="goodsSwipe">
          <van-swipe @change="onChange">
            <van-swipe-item v-for="(image, index) in goodsInfo.Banner" :key="index">
              <img v-lazy="image.img_url">
            </van-swipe-item>
            <div
              class="custom-indicator"
              slot="indicator"
            >{{ current + 1 }}/{{goodsInfo.Banner.length}}</div>
          </van-swipe>
        </div>
        <!-- 商品简介 area -->
        <div class="goods-info-area">
          <div class="price">
            <strong>{{goodsInfo.shop_price | moneyFilter}}</strong>&nbsp;积贝起
          </div>
          <div class="title">
            <div>{{goodsInfo.goods_name}}</div>
          </div>
        </div>
        <div class="specification-area">
          <div v-for="(item, index) in goodsInfo.exchange_goods" :key="index">
            <div
              :class="['specificationItem', { 'active': specificationActive ==  item.goods_id }]"
              @click="changeSpecification(item.goods_id,index)"
            >{{item.goods_name}}</div>
          </div>
        </div>
        <!-- 底部导航 area-->
        <van-goods-action class="footer-area">
          <van-goods-action-icon icon="wap-home" text="首页" @click="$router.push({name: 'Home'})"/>
          <van-goods-action-icon icon="chat-o" @click="$refs.callphone.click()" text="客服"/>
          <a ref="callphone" style="display:none" href="tel:0755-86571923"></a>
          <van-goods-action-button @click="actionApiBuyNow" class="first-btn" text="立即兑换"/>
        </van-goods-action>
      </div>
    </van-skeleton>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import {
  apiGoods,
  apiExchangeGoods,
  apiCheckOrder,
  apiSureOrder
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, Dialog } from "vant";

export default {
  components: {
    Menu
  },
  data() {
    return {
      loading: true,
      active: 0,
      showIndicators: false,
      goodsInfo: {},
      current: 0,
      good_detail: require("../assets/images/good_detail.png"),
      errorImg:
        'this.src="' + require("../assets/images/icon_avatar.png") + '"',
      showServe: false,
      showBuy: false,
      showParams: false,
      attr_info: {},
      goods_num: 1,
      specificationActive: null,
      cart_ids: [],
      address_id: null,
      order: {}
    };
  },

  mounted() {
    setTimeout(() => {
      this.loading = false;
      this.$refs.box.style.overflow = "inherit";
      window.addEventListener("scroll", this.handleScroll);
    }, 500);
  },
  created() {
    apiGoods({
      data: crypto.encrypt(
        JSON.stringify({
          rank_id: 0,
          cart_id: Number(this.$route.query.goods_id)
        })
      )
    })
      .then(result => {
        this.goodsInfo = result.data;
      })
      .catch(err => {});
  },
  methods: {
    actionCheckOrder() {
      apiCheckOrder({
        data: crypto.encrypt(JSON.stringify({ cart_ids: this.cart_ids }))
      })
        .then(result => {
          if (result.code == 0) {
            this.order = result.data.order_infos;
            this.address_id = result.data.receive_address.address_id;
            this.onSubmit();
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
                this.$toast("亲，不添加地址无法购物哦");
              });
          } else {
            this.$toast(result.msg);
          }
        })
        .catch(err => {
          this.$toast(this.ERRORNETWORK);
        });
    },
    onSubmit() {
      apiSureOrder({
        data: crypto.encrypt(
          JSON.stringify({
            address_id: this.address_id,
            cart_ids: this.cart_ids,
            order: this.order,
            is_web: false
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            Toast.success("兑换成功");
            this.$router.push({ name: "Orders" });
          } else {
            Toast({
              mask: true,
              message: this.APPNAME + result.msg
            });
          }
        })
        .catch(err => {
          this.$toast(this.ERRORNETWORK);
        });
    },
    changeSpecification(id, index) {
      this.specificationActive = id;
    },
    onChange(index) {
      this.current = index;
    },
    actionApiBuyNow() {
      if (!this.specificationActive) {
        this.$toast("请选择商品规格");
        return false;
      }
      apiExchangeGoods({
        data: crypto.encrypt(
          JSON.stringify({
            goods_id: parseFloat(this.specificationActive)
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));
            this.cart_ids = [];
            this.cart_ids.push(result);
            this.actionCheckOrder();
          } else {
            this.$toast(result.msg);
          }
        })
        .catch(err => {
          this.$toast(this.ERRORNETWORK);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.specification-area {
  background-color: #fff;
  padding: 0 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
}
.line-box {
  height: 6px;
  background-color: #f5f5f5;
}
.van-skeleton {
  box-sizing: border-box;
  padding: 2vw;
  display: flex;
  flex-wrap: wrap;
  .van-skeleton__avatar {
    width: 100%;
  }
  .van-skeleton__title {
    margin-top: 20px;
    height: 20px;
  }
  .van-skeleton__row:not(:first-child) {
    margin-top: 20px;
    height: 20px;
  }
}

.params-item {
  display: flex;
  font-size: 12px;
  height: 44px;
  line-height: 44px;
  .left {
    width: 70px;
    color: #999;
  }
}
.show-buy {
  padding-top: 30px;
  .van-button:nth-child(1) {
    border-radius: 10em 0 0 10em;
    background: linear-gradient(90deg, #f7c945 0%, #ff460a 100%);
  }
  .van-button:nth-child(2) {
    border-radius: 0 10em 10em 0;
    background: linear-gradient(91deg, #ff6700 0%, #ff460a 100%);
  }
  .steps {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
  }
  .close {
    float: right;
    height: 54px;
    width: 54px;
    background-image: url("../assets/images/icon_close.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    margin-top: -30px;
    margin-right: -10px;
  }
  .show-content > .top {
    display: flex;
    align-items: flex-end;
    padding-bottom: 14px;
    .left {
      img {
        width: 120px;
        height: 120px;
        border-radius: 6px;
      }
    }
    .right {
      padding-left: 16px;
      box-sizing: border-box;
      div {
        padding: 4px 0;
        &:nth-child(1) {
          font-size: 16px;
          color: #f34012;
        }
        &:nth-child(2) {
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }
  .center {
    padding-top: 14px;
    .bottom {
      padding-bottom: 14px;
    }
  }
}
.specificationItem {
  padding: 10px 16px;
  background-color: #f5f5f5;
  border-radius: 6px;
  font-size: 12px;
  display: inline-block;
  margin-top: 6px;
  border: 1px solid #f5f5f5;
  &.active {
    border: 1px solid #ff771b;
    background-color: #f7f0f0;
    color: #ff771b;
  }
}
.van-popup {
  border-radius: 16px 16px 0 0;
  .show-title {
    font-size: 16px;
    line-height: 70px;
    text-align: center;
  }
  .show-content {
    padding: 14px;
    padding-top: 0;
    box-sizing: border-box;
  }
  .serve-item {
    padding-bottom: 30px;
    box-sizing: border-box;
    display: flex;
    .left {
      width: 24px;
      height: 16px;
      background-image: url("../assets/images/icon_quality.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: left center;
    }
    .right {
      flex: 1;
      .bottom {
        margin-top: 10px;
        font-size: 10px;
        color: #666;
      }
    }
  }
  .show-btns {
    display: flex;
    padding: 0 40px;
    box-sizing: border-box;
    padding-bottom: 10px;
    button {
      flex: 1;
    }
  }
}
.goods-swipe {
  background-color: #fff;
  img {
    width: 100%;
  }
  .custom-indicator {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    height: 20px;
    line-height: 20px;
    width: 36px;
    text-align: center;
    border-radius: 10px;
  }
}
.tab-area {
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  padding: 0 12px;
  height: 42px;
  line-height: 42px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .left {
    width: 42px;
    display: flex;
    justify-content: left;
    align-items: center;
  }
  .center {
    flex: 1;
    text-align: center;
    ul {
      display: flex;
      justify-content: center;
      li {
        flex: 0 0 20%;
        position: relative;
        color: #666;
        &.active {
          color: #000;
        }
        &.active::after {
          content: "";
          display: block;
          height: 2px;
          width: 60%;
          background-color: #f34012;
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .right {
    width: 42px;
    height: 42px;
    background-image: url("../assets/images/icon_more.png");
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: center right;
  }
}
.old-btns-area {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  padding: 4px 12px;
  box-sizing: border-box;
  z-index: 1;
  .left,
  .right {
    width: 34px;
    height: 34px;
    background-image: url("../assets/images/goods_return.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
  }
  .right {
    background-image: url("../assets/images/goods_more.png");
  }
}
.goods-info-area {
  background-color: #fff;
  padding: 14px;
  padding-bottom: 0;
  box-sizing: border-box;
  .price {
    color: #f34012;
    display: flex;
    align-items: flex-end;
    strong {
      font-size: 20px;
      line-height: 20px;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      margin-left: 10px;
      font-size: 9px;
    }
  }
  .old-price {
    font-size: 12px;
    color: #999;
    line-height: 26px;
  }
  .title {
    font-size: 14px;
    font-weight: 700;
    color: #333;
    padding: 6px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > div:first-child {
      flex: 1;
    }
  }
  .share {
    display: inline-block;
    height: 30px;
    width: 56px;
    background-image: url("../assets/images/share.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    margin-right: -14px;
  }
  .more-info {
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 10px;
    color: #999;
  }
}
.goods-serve-area {
  margin-top: 10px;
  .serve-item {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding-left: 14px;
    .left {
      flex-wrap: nowrap;
      color: #999;
    }
    .van-cell {
      flex: 1;
      padding-top: 0.16rem;
      padding-bottom: 0.16rem;
    }
  }
}
.footer-area {
  &.van-goods-action {
    align-items: center;
    padding-right: 16px;
    box-sizing: border-box;
  }
  .van-goods-action-mini-btn {
    min-width: 20%;
  }
  .van-button.first-btn {
    background: linear-gradient(
      90deg,
      rgba(247, 201, 69, 1) 0%,
      rgba(255, 70, 10, 1) 100%
    );
    border: 0;
    border-radius: 0.5rem;
    color: #fff;
  }
  .van-button--large {
    height: 1rem;
    line-height: 1rem;
    font-size: 14px;
  }
}
.goods-pic-are {
  padding-bottom: 60px;
  background-color: #f5f5f5;
  text-align: center;
  padding-top: 10px;
  .top {
    padding-bottom: 10px;
  }
}
.goods-comment-area {
  background-color: #fff;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    .left {
      width: 2px;
      height: 16px;
      background-color: #ff5107;
    }
    .center {
      flex: 1;
      padding-left: 10px;
    }
    .right {
      color: #ff5107;
      display: flex;
      align-items: center;
      font-size: 12px;
    }
  }
  .comment-list {
    padding: 0 14px;
    .comement-item {
      padding-bottom: 10px;
      .top {
        display: flex;
        align-items: center;
        .left {
          img {
            height: 22px;
            width: 22px;
            border-radius: 50%;
          }
        }
        .right {
          padding-left: 4px;
          font-size: 10px;
          color: #666;
        }
      }
      .bottom {
        margin-top: 4px;
      }
      .imgs {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        .list-img-item {
          flex: 0 0 33.33%;
          padding: 2px;
          box-sizing: border-box;
        }
        .list-img {
          height: 0;
          width: 100%;
          padding: 50% 0;
          overflow: hidden;
          img {
            width: 100%;
            margin-top: -50%;
            background-color: #fff;
            border: none;
          }
        }
      }
    }
  }
}
</style>