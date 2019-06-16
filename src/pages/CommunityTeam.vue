<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- 团队tab area -->
    <div class="comment-tab">
      <div
        @click="changeTab(0)"
        :class="['comment-tab-item', {'active': commentTabActive == 0}]"
      >全部会员({{total}})</div>
      <div
        @click="changeTab(1)"
        :class="['comment-tab-item', {'active': commentTabActive == 1}]"
      >一级会员({{level_1}})</div>
      <div
        @click="changeTab(2)"
        :class="['comment-tab-item', {'active': commentTabActive == 2}]"
      >二级会员({{level_2}})</div>
    </div>
    <div class="van-hairline--bottom"></div>
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
          <div class="left-box">
            <van-image
              class="awtar-img"
              fit="cover"
              lazy-load
              src="https://img.yzcdn.cn/vant/cat.jpeg"
            />
          </div>
          <div class="right-box">
            <div class="top">
              <div class="left">昵称：{{item.user_name }}</div>
              <div class="right">绑定时间</div>
            </div>
            <div class="bottom">
              <div class="left">账号：{{item.mobile_phone}}</div>
              <div class="right">{{item.binding_time | timeFilter}}</div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { apiMyTeam } from "@/request/api";
import crypto from "@/cryptoUtil";
export default {
  data() {
    return {
      commentTabActive: 0,
      list: [],
      loading: false,
      finished: false,
      page_num: 0,
      total: 0,
      level_1: 0,
      level_2: 0,
      isRefresh: false,
      timer: null
    };
  },
  created() {},
  methods: {
    changeTab(req_type) {
      this.commentTabActive = req_type;
      this.isRefresh = false;
      this.finished = false;
      this.list = [];
      this.page_num = 0;
      this.timer = null;
    },
    onLoad() {
      this.loading = true;
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.getMyTeam();
        }, 500);
      }
    },
    getMyTeam() {
      apiMyTeam({
        data: crypto.encrypt(
          JSON.stringify({
            page_num: this.page_num,
            type: this.commentTabActive
          })
        )
      })
        .then(response => {
          if (response.code == 0) {
            response = response.data;
            this.total = response.total;
            this.level_1 = response.level_1;
            this.level_2 = response.level_2;
            if (response.infos.length) {
              this.page_num++;
              this.list = this.list.concat(response.infos);
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
    }
  }
};
</script>

<style lang="less" scoped>
.comment-tab {
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #fff;
  color: #666;
  .comment-tab-item {
    text-align: center;
    border-radius: 13px;
    height: 26px;
    line-height: 26px;
    &.active {
      color: #f66622;
    }
  }
}
.income-list-area {
  .item {
    background-color: #fff;
    padding: 12px 16px;
    font-size: 12px;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left-box {
      padding-right: 10px;
    }
    .right-box {
      flex: 1;
    }
    .top {
      display: flex;
      justify-content: space-between;
      .right {
        color: #666;
      }
    }
    .bottom {
      padding-top: 4px;
      display: flex;
      justify-content: space-between;
      .right {
        color: #666;
      }
    }
  }
  .awtar-img {
    height: 34px;
    width: 34px;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>