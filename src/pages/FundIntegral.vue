<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area"
      fixed
      :title="$route.meta.title"
      right-text="明细"
      left-arrow
      @click-left="returnPrePage"
      @click-right="$router.push({name: 'FundIntegralDetail'})"
    />
    <!-- fundIntegral-area -->
    <div class="fundIntegral-area">
      基金积贝：
      <span v-if="userInfo.user_info">{{userInfo.user_info.rank_points | moneyFilter}}</span>
    </div>
    <!-- doList-area -->
    <div class="doList-area">
      <div @click="study_fn" class="item"></div>
      <router-link :to="{name: 'ConversionCash'}" class="item"></router-link>
      <router-link :to="{name: 'ConversionIntegral'}" class="item"></router-link>
      <router-link :to="{name: 'ConversionCash'}" class="item"></router-link>
      <router-link :to="{name: 'ConversionIntegral'}" class="item"></router-link>
    </div>
  </div>
</template>

<script>
import { apiUserIndex } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      userInfo: {}
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    study_fn(){
      Toast('创业学习将会定期在线下举办，详情敬请关注！')
    },
    getUserInfo() {
      apiUserIndex()
        .then(response => {
          if (response.code == 0) {
            this.userInfo = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          Toast(this.ERRORNETWORK);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.doList-area {
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .item {
    margin-top: 10px;
    width: 160px;
    height: 80px;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;

    &:first-child {
      margin-right: 160px;
    }
    &:nth-child(1) {
      background-image: url(../assets/images/fundIntegral01.png);
    }
    &:nth-child(2) {
      background-image: url(../assets/images/fundIntegral02.png);
    }
    &:nth-child(3) {
      background-image: url(../assets/images/fundIntegral03.png);
    }
    &:nth-child(4) {
      background-image: url(../assets/images/fundIntegral04.png);
    }
    &:nth-child(5) {
      background-image: url(../assets/images/fundIntegral05.png);
    }
  }
}
.fundIntegral-area {
  margin-top: 52px;
  height: 48px;
  line-height: 48px;
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  span {
    color: #ff7612;
  }
}
.van-nav-bar__text{
  color: #333;
}
</style>