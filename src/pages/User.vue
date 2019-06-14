<template>
  <div>
    <!-- 用户信息 area -->
    <div class="usercenter-area">
      <div class="cont" @click="$router.push({name: 'UserEdit'})">
        <div class="left">
          <van-image
            v-if="userInfo.user_info"
            fit="cover"
            v-lazy
            :src="userInfo.user_info.headimg"
          />
        </div>
        <div class="right" v-if="userInfo.user_info">{{userInfo.user_info.user_name}}</div>
      </div>
    </div>

    <div class="bottom-area">
      <!-- 选项 area -->
      <div class="options-list-area option1">
        <div class="top">
          <div class="left">我的资产</div>
        </div>
        <div class="center">
          <div class="left" @click="$router.push({name: 'MyProperty'})">
            <div class="top">
              <div class="left"></div>
              <div class="right">我的账户</div>
            </div>
            <div
              class="bottom"
              v-if="userInfo.user_info"
            >¥{{userInfo.user_info.user_money | moneyFilter}}</div>
          </div>
          <div class="right" @click="$router.push({name: 'MyJibei'})">
            <div class="top">
              <div class="left right-left"></div>
              <div class="right">我的积贝</div>
            </div>
            <div
              class="bottom"
              v-if="userInfo.user_info"
            >{{userInfo.user_info.rank_points | moneyFilter}}</div>
          </div>
        </div>
      </div>
      <div class="mask">
        <img @click="$router.push({name: 'InviteToGetGift'})" :src="require('@/assets/images/mask_activity/02.png')" alt>
      </div>
      <!-- 选项 area -->
      <div class="options-list-area option2">
        <div class="top">
          <div class="left">我的订单</div>
          <router-link :to="{name: 'Orders'}" class="right">
            查看更多
            <van-icon name="arrow"/>
          </router-link>
        </div>
        <div class="bottom">
          <router-link :to="{name: 'Orders',query: {type: 'await_pay'}}" class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">待付款</div>
          </router-link>
          <router-link :to="{name: 'Orders',query: {type: 'await_ship'}}" class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">待发货</div>
          </router-link>
          <router-link :to="{name: 'Orders',query: {type: 'await_receipt'}}" class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">待收货</div>
          </router-link>
          <router-link :to="{name: 'Orders',query: {type: 'await_comment'}}" class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">待评价</div>
          </router-link>
          <router-link :to="{name: 'Orders',query: {type: 'contract'}}" class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">合约</div>
          </router-link>
        </div>
      </div>
      <!-- 选项 area -->
      <div class="options-list-area option3">
        <div class="top">
          <div class="left">我的工具</div>
        </div>
        <div class="bottom">
          <router-link :to="{name: 'Authentication'}" class="item">
            <div class="item-top option3-item-top"></div>
            <div class="item-bpttom">实名认证</div>
          </router-link>
          <router-link :to="{name: 'BankCard'}" class="item">
            <div class="item-top option3-item-top"></div>
            <div class="item-bpttom">我的银行卡</div>
          </router-link>
          <div class="item" @click="$router.push({name: 'InviteFriends'})">
            <div class="item-top option3-item-top"></div>
            <div class="item-bpttom">邀请好友</div>
          </div>
          <div class="item" style="opacity:0">
            <div class="item-top option3-item-top"></div>
            <div class="item-bpttom">绑定好友</div>
          </div>
        </div>
      </div>
      <!-- 退出登录 area -->
      <div class="logout-area">
        <van-button round size="large" @click="logout">退出登录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  apiUserIndex,
  apiGetMask,
  apiBuyNow,
  apiIsUserCanGetMask
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      userInfo: {}
    };
  },
  created() {
    this.initUserInfo();
  },
  methods: {
    initUserInfo() {
      apiUserIndex()
        .then(result => {
          if (result.code == 0) {
            this.userInfo = result.data;
          }
        })
        .catch(err => {
          Toast(this.APPNAME+"网络故障，请刷新重试");
        });
    },
    logout() {
      this.$store.commit("setToken", "");
      this.$router.replace({ name: "Login" });
    }
  }
};
</script>

<style lang="less" scoped>
.mask {
  width: 100%;
  padding: 10px 0;
  padding-bottom: 0;
  img {
    width: 100%;
  }
}
.logout-area {
  margin-top: 10px;
  padding-bottom: 20px;
  button {
    font-size: 12px;
    color: #999;
    border: 0;
  }
}
.bottom-area {
  padding: 0 18px;
  box-sizing: border-box;
  margin-top: -50px;
  .options-list-area {
    background-color: #fff;
    border-radius: 10px;
    padding: 14px;
    box-sizing: border-box;
    margin-top: 10px;
    padding-top: 0;
    &.option1 {
      padding-bottom: 0;
      .center {
        display: flex;
        justify-content: space-between;
        .left {
          border-right: 1px solid #f5f5f5;
        }
        & > div {
          flex: 1;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          padding-bottom: 40px;
          .top {
            .left {
              height: 16px;
              width: 16px;
              background-image: url(../assets/images/usercenter/usercenter03.png);
              background-repeat: no-repeat;
              background-size: contain;
            }
            .right {
              padding-left: 8px;
              color: #333;
            }
          }
          .bottom {
            font-size: 18px;
            color: #fe672c;
          }
          & > div {
            border: 0;
            flex: 0 0 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          &.right {
            .top {
              .left {
                background-image: url(../assets/images/usercenter/usercenter02.png);
              }
            }
          }
        }
      }
    }
    .top {
      height: 38px;
      line-height: 38px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .right {
        color: #999;
        display: flex;
        align-items: center;
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item {
        text-align: center;
        padding: 0 6px 0 6px;
        margin-top: 14px;
        .item-top {
          display: inline-block;
          height: 22px;
          width: 22px;
          background-image: url(../assets/images/usercenter/usercenter13.png);
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
          &.option3-item-top {
            height: 32px;
            width: 32px;
            background-image: url(../assets/images/usercenter/usercenter12.png);
          }
        }
        &:nth-child(2) {
          .item-top {
            background-image: url(../assets/images/usercenter/usercenter14.png);
            &.option3-item-top {
              background-image: url(../assets/images/usercenter/usercenter19.png);
            }
          }
        }
        &:nth-child(3) {
          .item-top {
            background-image: url(../assets/images/usercenter/usercenter15.png);
            &.option3-item-top {
              background-image: url(../assets/images/usercenter/usercenter18.png);
            }
          }
        }
        &:nth-child(4) {
          .item-top {
            background-image: url(../assets/images/usercenter/usercenter17.png);
            &.option3-item-top {
              background-image: url(../assets/images/usercenter/usercenter16.png);
            }
          }
        }
        &:nth-child(5) {
          .item-top {
            background-image: url(../assets/images/usercenter/usercenter11.png);
          }
        }
        .item-bpttom {
          font-size: 12px;
          padding-top: 6px;
        }
      }
    }
  }
}
.usercenter-area {
  height: 192px;
  background-image: url("../assets/images/usercenter/usercenter01.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-sizing: border-box;
  .cont {
    margin-top: -40px;
    display: flex;
    align-items: center;
    .left {
      .van-image {
        border-radius: 50%;
        overflow: hidden;
        width: 48px;
        height: 48px;
      }
    }
    .right {
      display: inline-block;
      padding-left: 12px;
      color: #fff;
      font-size: 12px;
    }
  }
}
</style>