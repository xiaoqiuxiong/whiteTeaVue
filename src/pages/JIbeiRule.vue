<template>
  <div>
    <van-nav-bar
      fixed
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- cont area -->
    <div class="cont-area">
      <div class="title">积贝详细介绍</div>
      <div class="item">
        <div class="item-title">
          <div class="left"></div>
          <div class="right">积贝</div>
        </div>
        <div class="item-detail">
          1.积贝是用户在平台消费及推荐用户消费时而获赠的积分产品；
          <br>2.用户购买一定额度的产品，将会赠送同等价值额度的积贝；
          <br>3.用户直接推荐其他好友购买获得该好友50%购买额度的积贝赠送；
          <br>用户间接推荐其他好友购买获得该好友25%购买额度的积贝赠送；
          <br>4.用户在获赠积贝的同时获得用于积贝挖掘的算力：
          <br>用户累计消费1000-5000元，获得5‰的算力 ；
          <br>用户累计消费5000-10000元，获得7‰的算力 ；
          <br>用户累计消费10000元以上，获得10‰的算力；
        </div>
      </div>
      <div class="item">
        <div class="item-title">
          <div class="left"></div>
          <div class="right">基金积贝</div>
        </div>
        <div class="item-detail">
          1.基金积贝是用户在推荐其他好友消费，在获赠的积贝中，有一定比例的积贝转换为基金积贝，基金积贝可用于兑现创业基金;
          <br>被推荐的好友累积消费1000-5000元，推荐人获赠的20%积贝转换为基金积贝；
          <br>被推荐的好友累积消费5000-10000元，推荐人获赠的30%积贝转换为基金积贝；
          <br>被推荐的好友累积消费10000元，推荐人获赠的50%积贝转换为基金积贝；
          <br>2.用户获得基金积贝后，需参加平台的创业学习计划，考核合格后升级为“创业合伙人”资格，可将基金积贝兑现为创业学习基金，并可提现;
          <br>3.未参加创业学习计划的用户无法将基金积贝兑现为创业基金，但可将基金积贝兑换为积贝，用于商城内的消费；
        </div>
      </div>
    </div>
    <!-- get area -->
    <div class="get-area">
      <div class="title">如何获取积贝</div>
      <div class="cont">
        <div class="item">
          <div class="left">
            <div class="icon"></div>
            <div class="text">
              <div class="top">购买商品</div>
              <div class="bottom">买到商品越多，积贝越多</div>
            </div>
          </div>
          <van-button round class="btn primary" @click="$router.push({name: 'Home'})">立即购买</van-button>
        </div>
        <div class="item">
          <div class="left">
            <div class="icon"></div>
            <div class="text">
              <div class="top">邀请推荐</div>
              <div class="bottom">推荐好友购买商品，可获得积贝</div>
            </div>
          </div>
          <van-button round class="btn primary">立即邀请</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.get-area {
  background-color: #fff;
  margin-top: 10px;
  padding: 20px;
  box-sizing: border-box;
  .title {
    text-align: center;
  }
  .cont {
    margin-top: 6px;
    font-size: 12px;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;
      .left {
        display: flex;
        align-items: center;
        .text {
          padding-left: 6px;
          .bottom {
            font-size: 10px;
            color: #999;
            margin-top: 2px;
          }
        }
        .icon {
          width: 28px;
          height: 28px;
          background-image: url(../assets/images/jibei_rule2.png);
          background-position: center center;
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
      &:last-child {
        .left {
          .icon {
            background-image: url(../assets/images/jibei_rule3.png);
          }
        }
        border-top: 1px solid #f5f5f5;
      }
    }
  }
}
.cont-area {
  margin-top: 54px;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  .title {
    text-align: center;
  }
  .item {
    font-size: 12px;
    .item-title {
      display: flex;
      align-items: center;
      margin-top: 20px;
      padding-bottom: 6px;
      .left {
        width: 22px;
        height: 22px;
        background-image: url(../assets/images/jibei_rule1.png);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
      }
      .right {
        padding-left: 6px;
        box-sizing: border-box;
      }
    }
  }
}
.btn {
  height: 26px;
  line-height: 24px;
  font-size: 12px;
}
.primary {
  color: #f65f23;
  border-color: #f65f23;
}
</style>