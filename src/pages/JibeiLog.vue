<template>
  <div>
    <van-nav-bar
      fixed
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- integral-count-area -->
    <div class="integral-count-area">
      <div class="left">
        <div class="top">可用积贝：</div>
        <div class="bottom">{{pay_points | moneyFilter}}</div>
      </div>
      <div class="right">当前算力：{{power*100}}‰</div>
    </div>
    <div class="integral-list-area">
      <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有数据了"
          error-text="数据加载失败了"
          @load="onLoad"
        >
          <div class="item" v-for="(item, index) in list" :key="index">
            <div class="top">
              <div class="left">{{item.desc}}</div>
              <div class="right">{{item.time | timeFilter}}</div>
            </div>
            <div class="bottom">
              <div class="left">{{item.order_sn}}</div>
              <div class="right green" v-if="item.amount<0">{{item.amount | moneyFilter}}</div>
              <div class="right red" v-else>+{{item.amount | moneyFilter}}</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { apiUserJiBei, apiUserIndex } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      isRefresh: false,
      timer1: null,
      timer2: null,
      page_num: 0,
      power: 0,
      pay_points: 0
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
            this.pay_points = result.data.user_info.rank_points;
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast(this.ERRORNETWORK);
        });
    },
    onRefresh() {
      if (!this.timer1) {
        this.timer1 = setTimeout(() => {
          this.isRefresh = false;
          this.finished = false;
          this.list = [];
          this.page_num = 0;
          this.timer1 = null;
          this.timer2 = null;
          this.onLoad();
        }, 500);
      }
    },
    onLoad() {
      this.loading = true;
      if (!this.timer2) {
        this.timer2 = setTimeout(() => {
          this.getApiUserJiBei();
        }, 500);
      }
    },
    getApiUserJiBei() {
      apiUserJiBei({
        data: crypto.encrypt(
          JSON.stringify({
            page_num: this.page_num
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));
            this.power = result.power;
            if (result.data.length) {
              this.page_num++;
              this.list = this.list.concat(result.data);
            } else {
              this.finished = true;
            }
          } else {
            this.finished = true;
            Toast(result.msg);
          }
          this.loading = false;
          this.timer1 = null;
          this.timer2 = null;
        })
        .catch(error => {
          Toast(this.ERRORNETWORK);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.integral-count-area {
  margin-top: 46px;
  background-color: #483313;
  color: #fff;
  padding: 28px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .bottom {
    margin-top: 10px;
    font-size: 20px;
  }
}
.integral-list-area {
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