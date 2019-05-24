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
          <div class="bottom-item-top">{{total_income | numberFilter}}</div>
          <div class="bottom-item-bottom">社区收入</div>
        </div>
        <div class="bottom-item" @click="$router.push({name: 'communityTeam'})">
          <div class="bottom-item-top">{{teamTatol | numberFilter}}</div>
          <div class="bottom-item-bottom">我的团队</div>
        </div>
      </div>
    </div>
    <!-- 社区收入记录title area -->
    <div class="income-title-area">
      收入记录
      <van-icon name="search" size="24px"/>
    </div>
    <!-- 社区收入流水 area -->
    <div class="income-list-area">
      <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有数据了" error-text="数据加载失败了" @load="onLoad">
          <div  class="item" v-for="(item, index) in list" :key="index">
            <div class="top">
              <div class="left">{{item.order_sn}}</div>
              <div class="right">{{item.time | timeFilter}}</div>
            </div>
            <div class="bottom">
              <div class="left">{{item.desc}}</div>
              <div class="right">{{item.amount | numberFilter}}</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { apiCommunityJiBei, apiMyTeam } from "@/request/api";
import crypto from "@/cryptoUtil";
export default {
  data() {
    return {
      total_income: 0,
      list: [],
      loading: false,
      finished: false,
      page_num: 0,
      first_index: 0,
      second_index: 0,
      teamTatol: 0,
      isRefresh: false
    };
  },
  created() {
    this.getMyTeam();
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.isRefresh = false;
        this.finished = false;
        this.list = [];
        this.page_num = 0;
        this.irst_index = 0;
        this.second_index = 0;
        this.onLoad();
      }, 500);
    },
    onLoad() {
      this.getCommunityJiBei();
    },
    getCommunityJiBei() {
      apiCommunityJiBei({
        data: crypto.encrypt(
          JSON.stringify({
            page_num: this.page_num,
            first_index: this.first_index,
            second_index: this.second_index
          })
        )
      })
        .then(response => {
          if (response.code == 0) {
            response = JSON.parse(crypto.decrypt(response.data));
            this.total_income = response.total_income;
            if (response.logs.length) {
              this.page_num++;
              this.first_index = response.first_index;
              this.second_index = response.second_index;
              this.list = this.list.concat(response.logs);
            } else {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMyTeam() {
      apiMyTeam({
        data: crypto.encrypt(JSON.stringify({ page_num: 0, type: 0 }))
      })
        .then(response => {
          if (response.code == 0) {
            this.teamTatol = response.data.total;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.nothing-area{
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
    padding: 4px;
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
      }
    }
  }
}
</style>