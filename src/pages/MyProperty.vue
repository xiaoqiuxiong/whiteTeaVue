<template>
  <div>
    <van-nav-bar
      fixed
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- 总余额 -->
    <div class="income-title-area">
      <div class="top">账户余额(元)</div>
      <div v-if="userInfo.user_info" class="bottom">{{userInfo.user_info.user_money | moneyFilter}}</div>
    </div>
    <!-- 提现按钮 area -->
    <van-cell class="wd-area" :icon="wdimg" is-link title="提现" :to="{name: 'WithdrawCash'}"/>
    <!-- 账户明细 area -->
    <van-cell class="detail-area" title="账户明细">
      <van-icon @click="show = true" slot="right-icon" :name="rightIcon" class="custom-icon"/>
    </van-cell>
    <!-- 社区收入流水 area -->
    <div class="income-list-area">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有数据了"
        error-text="数据加载失败了"
        @load="onLoad"
      >
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="top">
            <div class="left">{{item.title}}</div>
            <div class="right">{{item.change_time | timeFilter}}</div>
          </div>
          <div class="bottom">
            <div class="left">{{item.change_desc}}</div>
            <div class="right green" v-if="item.user_money<0">{{item.user_money | moneyFilter}}</div>
            <div class="right red" v-else>+{{item.user_money | moneyFilter}}</div>
          </div>
        </div>
      </van-list>
    </div>
    <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" @select="onSelect"/>
  </div>
</template>

<script>
import { apiUserIndex, apiAccountLog } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      show: false,
      actions: [
        { name: "提现", value: 1 },
        { name: "消费", value: 2 },
        { name: "对冲到账", value: 3 },
        { name: "基金积贝兑换", value: 4 },
        { name: "全部", value: 0 }
      ],
      sheetActive: 0,
      wdimg: require("../assets/images/td.png"),
      rightIcon: require("../assets/images/screen.png"),
      list: [],
      loading: false,
      finished: false,
      page_num: 0,
      totalIncome: 0,
      timer: null,
      userInfo: {},
      loadingMsg: ""
    };
  },
  created() {
    this.loadingMsg = Toast.loading({
      duration: 0,
      forbidClick: true,
      loadingType: "spinner",
      message: "loading..."
    });
    this.getUserInfo();
  },
  methods: {
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.show = false;
      this.sheetActive = item.value;
      this.finished = false;
      this.list = [];
      this.page_num = 0;
      this.timer = null;
      this.onLoad();
    },
    getUserInfo() {
      apiUserIndex()
        .then(result => {
          this.loadingMsg.clear();
          if (result.code == 0) {
            this.userInfo = result.data;
          } else {
            this.$toast(result.msg);
          }
        })
        .catch(error => {
          this.loadingMsg.clear();
          this.$toast(this.ERRORNETWORK);
        });
    },
    onLoad() {
      this.loading = true;
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.getAccountLog();
        }, 500);
      }
    },
    getAccountLog() {
      apiAccountLog({
        data: crypto.encrypt(
          JSON.stringify({
            type: this.sheetActive,
            pageNum: this.page_num
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));
            if (result.length) {
              this.page_num++;
              this.list = this.list.concat(result);
            } else {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
          this.loading = false;
          this.timer = null;
        })
        .catch(error => {
          this.loading = false;
          this.timer = null;
          this.$toast(this.ERRORNETWORK);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.detail-area {
  height: 46px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .van-icon--image {
    height: 44px;
    width: 44px;
  }
}
.detail-area.van-cell {
  background-color: #f5f5f5;
}
.income-title-area {
  margin-top: 46px;
  background: linear-gradient(rgba(255, 168, 31, 1), rgba(255, 78, 8, 1));
  color: #fff;
  padding: 28px;
  box-sizing: border-box;
  .bottom {
    font-size: 24px;
    margin-top: 18px;
  }
}
.income-list-area {
  .item {
    background-color: #fff;
    padding: 12px 16px;
    font-size: 12px;
    border-bottom: 1px solid #f5f5f5;
    .top {
      display: flex;
      justify-content: space-between;
      .left {
        font-size: 14px;
      }
      .right {
        color: #999;
      }
    }
    .bottom {
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      .left {
        font-size: 12px;
        color: #999;
      }
      .right {
        font-size: 16px;
        color: #ff560a;
        &.green {
          color: #28d300;
        }
        &.red {
          color: #f71842;
        }
      }
    }
  }
}
</style>