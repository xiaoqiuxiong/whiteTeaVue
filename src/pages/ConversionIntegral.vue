<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area"
      fixed
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- fundIntegral-area -->
    <div class="fundIntegral-area">
      当前基金积贝总量：
      <span v-if="userInfo.user_info">{{userInfo.user_info.rank_points | moneyFilter}}</span>
    </div>
    <van-cell-group>
      <van-field
        v-model="number"
        center
        clearable
        label="兑换数量："
        type="number"
        placeholder="请输入兑换数量"
      >
        <van-button @click="allNumber" class="all-btn" plain round slot="button" size="mini">全部</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn-box">
      <van-button round type="primary" @click="ExchangeJiJinJiBei">提 交</van-button>
    </div>
    <van-dialog v-model="show" :show-confirm-button="false" :close-on-click-overlay="true">
      <div class="dialog-box">
        <div class="icon-box">
          <span></span>
        </div>
        <div class="txt">
          兑换积贝成功，
          <br>请在“
          <router-link :to="{name: 'MyJibei'}">积贝-我的积贝</router-link>”中查看
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { apiUserIndex, apiExchangeJiJinJiBei } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      userInfo: {},
      number: null,
      type: 1,
      show: false
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    allNumber() {
      this.number = this.userInfo.user_info.rank_points;
    },
    ExchangeJiJinJiBei() {
      // 判断数据
      if (!this.number) {
        Toast("请输入兑换数量");
        return false;
      }
      if (this.number > this.userInfo.user_info.rank_points) {
        Toast("兑换数量不能大于当前基金积贝总量");
        this.number = this.userInfo.user_info.rank_points;
        return false;
      }
      this.number = parseFloat(this.number) || 0;
      apiExchangeJiJinJiBei({
        data: crypto.encrypt(
          JSON.stringify({ number: this.number, type: this.type })
        )
      })
        .then(result => {
          if (result.code == 0) {
            this.show = true;
            this.getUserInfo();
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast(this.ERRORNETWORK);
        });
    },
    getUserInfo() {
      apiUserIndex()
        .then(result => {
          if (result.code == 0) {
            this.userInfo = result.data;
          } else {
            Toast(result.msg);
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
.dialog-box {
  padding: 20px 40px;
  box-sizing: border-box;
  .icon-box {
    display: block;
    text-align: center;
    span {
      display: inline-block;
      height: 34px;
      width: 34px;
      background-image: url(../assets/images/success.png);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  .txt {
    text-align: center;
    margin-top: 14px;
    font-size: 14px;
    line-height: 1.8;
    a {
      color: #ff7612;
    }
  }
}
.btn-box {
  width: 80%;
  margin: 0 auto;
  margin-top: 14px;
  .van-button--primary {
    width: 100%;
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
.all-btn {
  border: 1px solid #ff7612;
  color: #ff7612;
}
</style>