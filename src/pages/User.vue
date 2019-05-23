<template>
  <div>
    <!-- 用户信息 area -->
    <div class="usercenter-area">
      <div class="cont">
        <div class="left">
          <van-image fit="cover" v-lazy :src="userInfo.headimg"/>
        </div>
        <div class="right">{{userInfo.user_name}}</div>
      </div>
    </div>
    <div class="bottom-area">
       <!-- 选项 area -->
      <div class="options-list-area">
        <div class="top">
          <div class="left">我的资产</div>
        </div>
        <div class="center">
          <div class="left">
            <div class="top">
              <div class="left"></div>
              <div class="right">我的账户</div>
            </div>
            <div class="bottom">¥1000.00</div>
          </div>
          <div class="right">
            <div class="top">
              <div class="left"></div>
              <div class="right">我的积贝</div>
            </div>
            <div class="bottom">1000.00</div>
          </div>
        </div>
      </div>
      <!-- 选项 area -->
      <div class="options-list-area">
        <div class="top">
          <div class="left">我的订单</div>
          <div class="right">
            查看更多
            <van-icon name="arrow"/>
          </div>
        </div>
        <div class="bottom">
          <div class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">待付款</div>
          </div>
          <div class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">待发货</div>
          </div>
          <div class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">待收货</div>
          </div>
          <div class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">待评价</div>
          </div>
          <div class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">合约</div>
          </div>
        </div>
      </div>
      <!-- 选项 area -->
      <div class="options-list-area">
        <div class="top">
          <div class="left">我的工具</div>
        </div>
        <div class="bottom">
          <div class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">实名认证</div>
          </div>
          <div class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">我的银行卡</div>
          </div>
          <div class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">邀请好友</div>
          </div>
          <div class="item">
            <div class="item-top"></div>
            <div class="item-bpttom">绑定好友</div>
          </div>
        </div>
      </div>
      <!-- 退出登录 area -->
      <div class="logout-area">
        <van-button round size="large">退出登录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: JSON.parse(this.$store.state.userInfo)
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.logout-area {
  margin-top: 10px;
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
    .bottom{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item{
        text-align: center;
        .item-top{
          height: 22px;
          width: 22px;
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