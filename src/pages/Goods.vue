<template>
  <div ref="box" style="background: #fff;overflow: hidden;height:100vh">
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
          <div class="right"  @click="$refs.menu.isShow(true)"></div>
        </div>
        <!-- 导航 area -->
        <div class="tab-area" ref="tabArea">
          <div class="left" @click="returnPrePage">
            <van-icon size="20px" name="arrow-left"></van-icon>
          </div>
          <div class="center">
            <ul>
              <li @click="changeTab(0)" v-bind:class="{ active: active == 0 }">商品</li>
              <li @click="changeTab(1)" v-bind:class="{ active: active == 1 }">评论</li>
              <li @click="changeTab(2)" v-bind:class="{ active: active == 2 }">详情</li>
            </ul>
          </div>
          <div class="right"  @click="$refs.menu.isShow(true)"></div>
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
            <small>¥</small>
            <strong>{{goodsInfo.shop_price | moneyFilter}}</strong>
            <van-tag round color="#ffe1e1" text-color="#F34012">新品上架</van-tag>
          </div>
          <div class="old-price">
            价格
            <del>{{goodsInfo.market_price | moneyFilter}}</del>
          </div>
          <div class="title">
            <div>{{goodsInfo.goods_name}}</div>
            <!-- <div class="share"></div> -->
          </div>

          <div class="more-info">
            <div>运费：{{goodsInfo.package_money}}</div>
            <div>库存：{{goodsInfo.goods_number}}</div>
            <div>销量：{{goodsInfo.sell_num}}</div>
          </div>
        </div>
        <div class="line-box"></div>
        <!-- 服务 area -->
        <div class="goods-serve-area">
          <div class="serve-item" @click="showServeFn">
            <div class="left">服务</div>
            <van-cell title="免运费·正品保证·预约送货" is-link/>
          </div>
          <div class="serve-item" @click="showBuyFn">
            <div class="left">选择</div>
            <van-cell title="商品规则" is-link/>
          </div>
          <div class="serve-item" @click="showParamsFn">
            <div class="left">参数</div>
            <van-cell title="品牌 上架时间..." is-link/>
          </div>
        </div>
        <div class="line-box"></div>
        <!-- 评论 area -->
        <div v-if="goodsInfo.comment" class="goods-comment-area" ref="goodsCommentArea">
          <div class="title">
            <div class="left"></div>
            <div class="center">评论({{goodsInfo.comment.all_p || 0}})</div>
            <div class="right" @click="skipComment">
              查看更多
              <van-icon name="arrow"/>
            </div>
          </div>
          <div class="comment-list">
            <div
              v-for="(item, index) in goodsInfo.comment.comment"
              :key="index"
              v-show="index == 0"
              class="comement-item"
            >
              <div class="top">
                <div class="left">
                  <img :onerror="errorImg" :src="item.base.headimg" alt>
                </div>
                <div class="right">{{item.base.user_name}}</div>
              </div>
              <div v-if="item.base.content != ''" class="bottom">{{item.base.content}}</div>
              <div class="imgs" v-if="item.has_img">
                <div v-for="(item1, index) in item.img_info" :key="index" class="list-img-item">
                  <div class="list-img">
                    <img v-lazy="item1.thumb" alt>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 图片详情 area -->
        <div class="goods-pic-are" ref="goodsPicAre">
          <img class="top" width="64%" :src="good_detail" alt>
          <img v-lazy="goodsInfo.detial_img" width="100%" alt>
        </div>
        <!-- 底部导航 area-->
        <van-goods-action class="footer-area">
          <van-goods-action-icon icon="wap-home" text="首页" @click="onClickMiniBtn"/>
          <van-goods-action-icon icon="chat-o" @click="$refs.callphone.click()" text="客服"/>
          <a ref="callphone" style="display:none" href="tel:0755-86571923"></a>
          <van-goods-action-button @click="showBuyFn" class="first-btn" text="加入购物车"/>
          <van-goods-action-button @click="showBuyFn" class="last-btn" primary text="立即购买"/>
        </van-goods-action>
        <!-- 服务上拉菜单 -->
        <van-action-sheet v-model="showServe">
          <div class="show-box">
            <div class="show-title">基础服务</div>
            <div class="show-content">
              <div class="serve-item">
                <div class="left"></div>
                <div class="right">
                  <div class="top">正品保障</div>
                  <div class="bottom">商品支持正品保障服务</div>
                </div>
              </div>
              <div class="serve-item">
                <div class="left"></div>
                <div class="right">
                  <div class="top">免邮费</div>
                  <div class="bottom">商品运费由商家为买家购买</div>
                </div>
              </div>
              <div class="serve-item">
                <div class="left"></div>
                <div class="right">
                  <div class="top">售后保障</div>
                  <div class="bottom">收到货后，如对商品有任何疑问，请联系客服 0755-86571923</div>
                </div>
              </div>
            </div>
            <div class="show-btns">
              <van-button round type="primary" @click="showServeFn">关 闭</van-button>
            </div>
          </div>
        </van-action-sheet>
        <!-- 购买上拉菜单 -->
        <van-action-sheet v-model="showBuy">
          <div class="show-box show-buy">
            <div class="show-content">
              <div class="close" @click="showBuyFn"></div>
              <div class="top">
                <div class="left">
                  <img v-if="goodsInfo.Banner" :src="goodsInfo.Banner[0].thumb_url" alt>
                </div>
                <div class="right">
                  <div
                    v-if="attr_info.attr_price"
                  >¥ {{(parseFloat(attr_info.attr_price) + parseFloat(goodsInfo.shop_price)) | moneyFilter}}</div>
                  <div>库存 {{attr_info.attr_number || 0}}件</div>
                </div>
              </div>
              <div class="van-hairline--bottom"></div>
              <div class="center">
                <div class="top">{{attr_info.attr_name}}</div>
                <div class="bottom">
                  <div
                    v-for="(item, index) in goodsInfo.attr_info"
                    :key="index"
                    :class="['specificationItem', { 'active': specificationActive ==  item.goods_attr_id }]"
                    @click="changeSpecification(item.goods_attr_id,index)"
                  >{{item.attr_value}}</div>
                </div>
              </div>
              <div class="van-hairline--bottom"></div>
              <div class="steps">
                购买数量
                <van-stepper @change="onChangeStepper" v-model="goods_num"/>
              </div>
            </div>
            <div class="show-btns">
              <van-button round type="primary" @click="actionApiBuyNow">加入购物车</van-button>
              <van-button round type="primary" @click="actionApiBuyNow">立即购买</van-button>
            </div>
          </div>
        </van-action-sheet>
        <!-- 参数上拉菜单 -->
        <van-action-sheet v-model="showParams">
          <div class="show-box">
            <div class="show-title">商品参数</div>
            <div class="show-content">
              <div class="params-item">
                <div class="left">商品名称</div>
                <div class="right">{{goodsInfo.goods_name}}</div>
              </div>
              <div class="van-hairline--bottom"></div>
              <div class="params-item">
                <div class="left">商品编号</div>
                <div class="right">{{goodsInfo.goods_sn}}</div>
              </div>
              <div class="van-hairline--bottom"></div>
              <div class="params-item">
                <div class="left">商品品牌</div>
                <div class="right">{{goodsInfo.goods_brand}}</div>
              </div>
              <div class="van-hairline--bottom"></div>
              <div class="params-item">
                <div class="left">上架时间</div>
                <div class="right">{{goodsInfo.add_time | dateFilter}}</div>
              </div>
              <div class="van-hairline--bottom"></div>
              <div class="params-item">
                <div class="left">商品重量</div>
                <div class="right">{{'暂无'}}</div>
              </div>
              <div class="van-hairline--bottom"></div>
              <div class="params-item">
                <div class="left">商品库存</div>
                <div class="right">{{goodsInfo.goods_number}}</div>
              </div>
              <div class="van-hairline--bottom"></div>
            </div>
            <div class="show-btns">
              <van-button round type="primary" @click="showParamsFn">关 闭</van-button>
            </div>
          </div>
        </van-action-sheet>
      </div>
    </van-skeleton>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import { apiGoods, apiBuyNow } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";

export default {
  components: {
    Menu,
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
      specificationActive: ""
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
          good_id: Number(this.$route.query.goods_id)
        })
      )
    })
      .then(result => {
        this.goodsInfo = result.data;
        this.attr_info = this.goodsInfo.attr_info[0];
        this.specificationActive = this.attr_info.goods_attr_id;
      })
      .catch(err => {});
  },
  methods: {
    actionApiBuyNow() {
      apiBuyNow({
        data: crypto.encrypt(
          JSON.stringify({
            quick: 0,
            spec: [this.specificationActive.toString()],
            goods_id: this.goodsInfo.goods_id,
            goods_num: this.goods_num,
            is_free: 0
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            this.$router.push({
              name: "SureOrder",
              query: {
                cart_ids: JSON.parse(crypto.decrypt(result.data)).cart_id
              }
            });
          } else {
            Toast(this.APPNAME+result.msg);
          }
        })
        .catch(err => {
          Toast(this.APPNAME+"网络故障，请刷新重试");
        });
    },
    onChangeStepper(value) {},
    skipComment() {
      this.$router.push({
        name: "Comment",
        query: { goods_id: this.goodsInfo.goods_id }
      });
    },
    changeSpecification(id, index) {
      this.specificationActive = id;
      this.attr_info = this.goodsInfo.attr_info[index];
    },
    changeTab(e) {
      if (e == 0) {
        window.scrollTo(0, 0);
      } else if (e == 1) {
        window.scrollTo(0, this.$refs.goodsCommentArea.offsetTop - 42);
      } else {
        window.scrollTo(0, this.$refs.goodsPicAre.offsetTop - 42);
      }
    },
    onClickMiniBtn() {
      this.$router.push({ name: "Home" });
    },
    onChange(index) {
      this.current = index;
    },
    handleScroll() {
      if (this.$refs.goodsCommentArea) {
        let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
        if (scrollTop + 42 > 100) {
          this.$refs.tabArea.style.zIndex = 2;
          this.$refs.oldtabArea.style.opacity = 0;
        } else {
          this.$refs.tabArea.style.zIndex = -1;
          this.$refs.oldtabArea.style.opacity = 1;
        }
        if (this.$refs.goodsCommentArea.offsetTop > scrollTop + 48) {
          this.active = 0;
        } else if (
          this.$refs.goodsCommentArea.offsetTop < scrollTop + 48 &&
          this.$refs.goodsPicAre.offsetTop > scrollTop + 48
        ) {
          this.active = 1;
        } else {
          this.active = 2;
        }
        this.$refs.tabArea.style.opacity =
          scrollTop / (this.$refs.goodsSwipe.clientHeight - 42);
      }
    },
    showServeFn() {
      this.showServe = this.showServe ? false : true;
    },
    showBuyFn() {
      this.showBuy = this.showBuy ? false : true;
    },
    showParamsFn() {
      this.showParams = this.showParams ? false : true;
    }
  }
};
</script>

<style lang="less" scoped>
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
      .specificationItem {
        padding: 10px 16px;
        background-color: #f5f5f5;
        border-radius: 6px;
        font-size: 12px;
        display: inline-block;
        margin-top: 14px;
        border: 1px solid #f5f5f5;
        &.active {
          border: 1px solid #ff771b;
          background-color: #f7f0f0;
          color: #ff771b;
        }
      }
    }
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
    font-size: 16px;
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
      rgba(255, 119, 27, 1) 100%
    );
    border: 0;
    border-radius: 0.5rem 0 0 0.5rem;
    color: #fff;
  }
  .van-button.last-btn {
    background: linear-gradient(
      91deg,
      rgba(255, 103, 0, 1) 0%,
      rgba(255, 70, 10, 1) 100%
    );
    border: 0;
    border-radius: 0 0.5rem 0.5rem 0;
    color: #fff;
  }
  .van-button.other-btn {
    background: linear-gradient(
      91deg,
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