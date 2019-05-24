<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- 社区收入记录title area -->
    <div class="income-title-area">
      业绩总额：{{totalIncome | numberFilter}}
      <van-icon name="search" size="24px"/>
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
              <div class="right">{{item.amount | numberFilter}}</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { apiTotalIncome } from "@/request/api";
import crypto from "@/cryptoUtil";
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page_num: 0,
      totalIncome: 0,
      isRefresh: false,
      timer: null
    };
  },
  created() {
  },
  methods: {
    onRefresh() {
      if(!this.timer){
      this.timer = setTimeout(() => {
        this.isRefresh = false;
        this.finished = false;
        this.list = [];
        this.page_num = 0;
        this.timer = null;
      }, 1000);
      }
    },
    onLoad() {
        this.getTotalIncome();
    },
    getTotalIncome() {
      apiTotalIncome({
        data: crypto.encrypt(
          JSON.stringify({
            tag: "gongxin",
            pageNum: this.page_num
          })
        )
      })
        .then(response => {
          if (response.code == 0) {
            response = response.data;
            this.totalIncome = response.total_amount;
            if (response.order_listt.length) {
              this.page_num++;
              this.list = this.list.concat(response.order_listt);
              if(response.order_listt.length < 10){
                this.finished = true;
              }
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
    }
  }
};
</script>

<style lang="less" scoped>
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