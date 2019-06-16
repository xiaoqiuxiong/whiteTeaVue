<template>
  <div>
    <van-nav-bar
      fixed
      class="nav-area"
      :title="$route.meta.title"
      right-text="了解积贝"
      left-arrow
      @click-left="returnPrePage"
      @click-right="$router.push({name: 'JibeiRule'})"
    />
    <!-- 总余额 -->
    <div class="income-title-area" v-if="userInfo.user_info">
      <router-link :to="{name: 'JibeiLog'}" class="item">
        <div class="top">{{userInfo.user_info.pay_points | moneyFilter}}</div>
        <div class="bottom">积贝</div>
      </router-link>
      <router-link :to="{name: 'FundIntegral'}" class="item">
        <div class="top">{{userInfo.user_info.rank_points | moneyFilter}}</div>
        <div class="bottom">基金积贝</div>
      </router-link>
      <div class="item">
        <div class="top">{{userInfo.user_info.wait_release | moneyFilter}}</div>
        <div class="bottom">待释放积贝</div>
      </div>
    </div>
    <!-- 积贝兑换 area -->
    <van-cell class="detail-area" title="积贝兑换"></van-cell>
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
            <div
              class="img-box"
              v-if="item.can_use"
              @click="$router.push({name: 'ExchangeGoods',query: {goods_id: item.id}})"
            >
              <img v-lazy="item.img_url" alt>
            </div>
            <div
              @click="$router.push({name: 'ExchangeGoods',query: {goods_id: item.id}})"
              v-if="item.can_use"
              class="title van-ellipsis"
            >{{item.title}}</div>
            <div class="img-box" v-if="!item.can_use" @click="getOther">
              <img v-lazy="item.img_url" alt>
            </div>
            <div v-if="!item.can_use" class="title van-ellipsis">{{item.title}}</div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" @select="onSelect"/>
  </div>
</template>

<script>
import { apiUserIndex, apiJibeiUseWay } from "@/request/api";
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
        { name: "查看全部", value: 0 }
      ],
      sheetActive: 0,
      wdimg: require("../assets/images/td.png"),
      rightIcon: require("../assets/images/screen.png"),
      list: [],
      loading: false,
      finished: false,
      page_num: 0,
      totalIncome: 0,
      isRefresh: false,
      timer1: null,
      timer2: null,
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
    getOther() {
      this.$toast("功能正在开发中");
    },
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.show = false;
      this.sheetActive = item.value;
      this.isRefresh = false;
      this.finished = false;
      this.list = [];
      this.page_num = 0;
      this.timer1 = null;
      this.timer2 = null;
      this.onLoad();
    },
    getUserInfo() {
      apiUserIndex()
        .then(response => {
          this.loadingMsg.clear()
          if (response.code == 0) {
            this.userInfo = response.data;
          }
        })
        .catch(error => {
          this.loadingMsg.clear()
          console.log(error);
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
          this.getApiJibeiUseWay();
        }, 500);
      }
    },
    getApiJibeiUseWay() {
      apiJibeiUseWay()
        .then(response => {
          if (response.code == 0) {
            response = response.data;
            if (response.length) {
              this.page_num++;
              this.list = this.list.concat(response);
              if (response.length < 50) {
                this.finished = true;
              }
            } else {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
          this.loading = false;
          this.timer1 = null;
          this.timer2 = null;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.van-nav-bar__text {
  color: #666;
  font-size: 12px;
}
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
  background-image: url(../assets/images/jbbg.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  height: 146px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .item {
    color: #c9a273;
    flex: 1;
    text-align: center;
    border-right: 1px solid #c9a273;
    &:last-child {
      border: 0;
    }
    .top {
      font-size: 18px;
    }
    .bottom {
      font-size: 14px;
      margin-top: 6px;
    }
  }
}
.income-list-area {
  .van-list {
    font-size: 0;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
  }
  .item {
    display: inline-block;

    padding: 6px;
    font-size: 12px;
    width: 50%;
    box-sizing: border-box;
    border-radius: 6px;
    .title {
      margin-top: 10px;
      padding-left: 6px;
      box-sizing: border-box;
    }
    .img-box {
      height: 90px;
      overflow: hidden;
      border-radius: 6px;
      img {
        width: 100%;
      }
    }
  }
}
</style>