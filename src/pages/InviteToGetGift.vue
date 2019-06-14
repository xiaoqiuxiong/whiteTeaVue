<template>
  <div>
    <van-nav-bar
      v-if="!isNull"
      fixed
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <van-nav-bar v-if="isNull" fixed class="nav-area" :title="$route.meta.title"/>
    <div class="cont-area">
      <div class="top">
        <img :src="require('@/assets/images/mask_activity/03.png')" alt>
      </div>
      <div class="bottom">
        <img :src="require('@/assets/images/mask_activity/07.png')" alt>
        <div class="bottom-cont">
          <div class="cont-box">
            <div class="cont-box-title">
              <img :src="require('@/assets/images/mask_activity/06.png')" alt>
            </div>
            <p>1.即日起注册共信新零售平台即可获赠价值128元面膜一盒；</p>
            <p>2.分享邀请好友完成注册后，每日可以免费领取面膜一盒；</p>
            <p>3.用户享有每日领取权益后，当然不领取视为自动放弃领取；</p>
            <p>4.活动有效期2019年6月8日-2020年6月8日。</p>
            <div class="btn-box">
              <img @click="getMask()" :src="require('@/assets/images/mask_activity/04.png')" alt>
            </div>
            <div class="bottom-tips">本活动最终解释权归共信区块链技术（深圳）有限公司所有</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg"></div>
  </div>
</template>

<script>
let isNull = false;
import { apiGetMask, apiBuyNow, apiIsUserCanGetMask } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      isNull: false
    };
  },
  beforeRouteEnter(to, from, next) {
    isNull = from.name == null;
    next();
  },
  mounted() {
    this.isNull = isNull;
  },
  methods: {
    getMask() {
      apiIsUserCanGetMask().then(result => {
        if (result.code == 0) {
          result = JSON.parse(crypto.decrypt(result.data));
          apiGetMask()
            .then(result => {
              if (result.code == 0) {
                result = JSON.parse(crypto.decrypt(result.data));
                this.actionApiBuyNow(result.goods_id, result.type);
              } else {
                Toast(this.APPNAME+result.msg);
              }
            })
            .catch(err => {
              Toast(this.APPNAME+this.ERRORNETWORK);
            });
        }
      });
    },
    actionApiBuyNow(goods_id, type) {
      apiBuyNow({
        data: crypto.encrypt(
          JSON.stringify({
            quick: 0,
            spec: [],
            goods_id: goods_id,
            goods_num: 1,
            is_free: 0
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));
            this.$router.push({
              name: "SureOrder",
              query: {
                cart_ids: result.cart_id,
                type: type
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
  }
};
</script>

<style lang="less" scoped>
.bottom-cont {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 20px;
  box-sizing: border-box;
  padding-bottom: 20px;
  .cont-box {
    border: 8px solid #ffa63d;
    border-radius: 6px;
    background-color: #fff;
    font-size: 12px;
    color: #333;
    .cont-box-title {
      text-align: center;
      margin-top: 20px;
      img {
        height: 18px;
        width: auto;
      }
      padding-bottom: 10px;
    }
    p {
      line-height: 1.5;
      padding: 0 13px;
      box-sizing: border-box;
      margin-top: 0;
      margin-bottom: 0;
      padding-bottom: 10px;
    }
    .bottom-tips {
      padding: 4px 13px;
      padding-top: 6px;
      box-sizing: border-box;
      line-height: 1.5;
      text-align: center;
      padding-bottom: 10px;
    }
    .btn-box {
      text-align: center;
    }
    .btn-box img {
      height: 50px;
      width: auto;
      &:active {
        opacity: 0.8;
      }
    }
  }
}
.cont-area {
  font-size: 0;
}
.top {
  margin-top: 46px;
  img {
    width: 100%;
  }
}
.bottom {
  position: relative;
  img {
    width: 100%;
  }
}
.bg {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #ff3b00;
  z-index: -1;
}
</style>