<template>
  <div>
    <!-- 社区中心简介 area -->
    <div class="communify-area">
      <div class="top">
        <router-link class="left" :to="{name: 'CommunityRule'}">社区规则</router-link>
        <router-link class="right" :to="{name: 'CommunityPerformance'}">社区业绩</router-link>
      </div>
      <div class="center">超级社区</div>
      <div class="bottom">
        <div class="bottom-item">
          <div class="bottom-item-top">{{total_income | moneyFilter}}</div>
          <div class="bottom-item-bottom">社区收入</div>
        </div>
        <div class="bottom-item" @click="$router.push({name: 'CommunityTeam'})">
          <div class="bottom-item-top">{{teamTatol}}</div>
          <div class="bottom-item-bottom">我的团队</div>
        </div>
      </div>
    </div>
    <!-- 社区收入记录title area -->
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
    </div>
  </div>
</template>

<script>
import { apiCommunityJiBei, apiMyTeam } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      loadingMsg: "",
      searchValue: "",
      searchShow: false,
      total_income: 0,
      list: [],
      loading: false,
      finished: false,
      page_num: 0,
      first_index: 0,
      second_index: 0,
      teamTatol: 0,
      timer: null
    };
  },
  created() {
    this.loadingMsg = Toast.loading({
      duration: 0,
      forbidClick: true,
      loadingType: "spinner",
      message: "loading..."
    });
    this.getMyTeam();
  },
  methods: {
    onSearch() {
      this.finished = false;
      this.list = [];
      this.page_num = 0;
      this.first_index = 0;
      this.second_index = 0;
      this.timer = null;
      this.onLoad();
    },
    onCancel() {
      this.searchShow = false;
    },
    onLoad() {
      this.loading = true;
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.getCommunityJiBei();
        }, 500);
      }
    },
    getCommunityJiBei() {
      apiCommunityJiBei({
        data: crypto.encrypt(
          JSON.stringify({
            page_num: this.page_num,
            first_index: this.first_index,
            second_index: this.second_index,
            key: this.searchValue
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            result = JSON.parse(crypto.decrypt(result.data));
            this.total_income = result.total_income;
            if (result.logs.length) {
              this.page_num++;
              this.first_index = result.first_index;
              this.second_index = result.second_index;
              this.list = this.list.concat(result.logs);
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
          this.$toast(this.ERRORNETWORK);
          this.loading = false;
          this.timer = null;
        });
    },
    getMyTeam() {
      apiMyTeam({
        data: crypto.encrypt(JSON.stringify({ page_num: 0, type: 0 }))
      })
        .then(result => {
          this.loadingMsg.clear();
          if (result.code == 0) {
            this.teamTatol = result.data.total;
          } else {
            this.$toast(result.msg);
          }
        })
        .catch(error => {
          this.loadingMsg.clear();
          this.$toast(this.ERRORNETWORK);
        });
    }
  }
};
</script>

<style lang="less" scoped>
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
.communify-area {
  height: 164px;
  background: linear-gradient(
    92deg,
    rgba(255, 168, 31, 1) 0%,
    rgba(255, 78, 8, 1) 100%
  );
  padding: 10px;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  font-size: 12px;
  .top {
    flex: 0 0 100%;
    display: flex;
    justify-content: space-between;
    a {
      color: #fff;
      padding: 6px;
    }
  }
  .center {
    flex: 0 0 100%;
    text-align: center;
    font-size: 18px;
    color: #ffe8a0;
  }
  .bottom {
    flex: 0 0 100%;
    display: flex;
    justify-content: space-between;
    padding: 6px;
    box-sizing: border-box;
    & > div {
      flex: 1;
      justify-content: center;
      & > div {
        text-align: center;
        &.bottom-item-top {
          font-size: 16px;
          padding-bottom: 4px;
        }
      }
    }
  }
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