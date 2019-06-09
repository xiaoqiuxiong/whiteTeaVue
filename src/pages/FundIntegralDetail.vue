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
      基金积贝：
      <span v-if="userInfo.user_info">{{userInfo.user_info.rank_points | moneyFilter}}</span>
    </div>
    <div v-show="!searchShow" class="income-title-area">
      收入记录
      <van-icon @click="searchShow = true" name="search" size="24px"/>
    </div>
    <!-- search area -->
    <div class="search-area" v-show="searchShow">
      <van-search
        class="search-box"
        shape="round"
        show-action
        @input="onSearch"
        @cancel="onCancel"
        placeholder="请输入会员名称或者订单编号"
        v-model="searchValue"
      />
    </div>
    <!-- 社区收入流水 area -->
    <div class="income-list-area">
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
              <div class="left">{{item.order_sn}}</div>
              <div class="right">{{item.time | timeFilter}}</div>
            </div>
            <div class="bottom">
              <div class="left">{{item.desc}}</div>
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
import { apiUserIndex, apiUserJiJin } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      searchValue: "",
      searchShow: false,
      total_income: 0,
      list: [],
      loading: false,
      finished: false,
      page_num: 0,
      teamTatol: 0,
      isRefresh: false,
      userInfo: {},
      timer1: null,
      timer2: null
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      apiUserIndex()
        .then(response => {
          if (response.code == 0) {
            this.userInfo = response.data;
          } else {
            Toast(response, msg);
          }
        })
        .catch(error => {
          Toast(this.ERRORNETWORK);
        });
    },
    onSearch() {
      this.isRefresh = false;
      this.finished = false;
      this.list = [];
      this.page_num = 0;
      this.timer1 = null;
      this.timer2 = null;
      this.onLoad();
    },
    onCancel() {
      this.searchShow = false;
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
          this.getApiUserJiJin();
        }, 500);
      }
    },
    getApiUserJiJin() {
      apiUserJiJin({
        data: crypto.encrypt(
          JSON.stringify({
            page_num: this.page_num,
            key: this.searchValue
          })
        )
      })
        .then(response => {
          if (response.code == 0) {
            response = JSON.parse(crypto.decrypt(response.data));
            this.total_income = response.total_income;
            if (response.length) {
              this.page_num++;
              this.list = this.list.concat(response);
            } else {
              this.finished = true;
            }
          } else {
            this.finished = true;
            Toast(response.msg);
          }
          this.loading = false;
          this.timer1 = null;
          this.timer2 = null;
        })
        .catch(error => {
          Toast(this.ERRORNETWORK);
        });
    },
    getMyTeam() {
      apiMyTeam({
        data: crypto.encrypt(JSON.stringify({ page_num: 0, type: 0 }))
      })
        .then(response => {
          if (response.code == 0) {
            this.teamTatol = response.data.total;
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
.search-box {
  background-color: #f5f5f5 !important;
  padding: 0.134rem 0.42667rem;
  padding-right: 0.2rem;
  .van-search__content {
    background-color: #fff;
  }
}
.nothing-area {
  height: calc(100vh - 258px);
  background-color: #fff;
}
.income-title-area {
  height: 44px;
  line-height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  i {
    padding: 10px;
    margin-right: -10px;
    box-sizing: border-box;
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
    }
    .bottom {
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      .right {
        font-size: 16px;
        color: #ff560a;
        padding-left: 20px;
        box-sizing: border-box;
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