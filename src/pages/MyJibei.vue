<template>
  <div>
    <van-nav-bar
      class="nav-area"
      :title="$route.meta.title"
      right-text="了解积贝"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- 总余额 -->
    <div class="income-title-area">
      <div class="item">
        <div class="top">{{userInfo.user_info.pay_points | moneyFilter}}</div>
        <div class="bottom">积贝</div>
      </div>
      <div class="item">
        <div class="top">{{userInfo.user_info.rank_points | moneyFilter}}</div>
        <div class="bottom">基金积贝</div>
      </div>
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
            <div class="top">
              <div class="left">{{item.title}}</div>
              <div class="right">{{item.change_time | timeFilter}}</div>
            </div>
            <div class="bottom">
              <div class="left">{{item.change_desc}}</div>
              <div class="right green" v-if="item.user_money<0">{{item.user_money | numberFilter}}</div>
              <div class="right red" v-else>+{{item.user_money | numberFilter}}</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" @select="onSelect"/>
  </div>
</template>

<script>
import { apiUserIndex, apiAccountLog } from "@/request/api";
import crypto from "@/cryptoUtil";
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
      timer: null,
      userInfo: {}
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.show = false;
      this.sheetActive = item.value;
      this.isRefresh = false;
      this.finished = false;
      this.list = [];
      this.page_num = 0;
      this.timer = null;
      this.onLoad();
    },
    getUserInfo() {
      apiUserIndex()
        .then(response => {
          if (response.code == 0) {
            this.userInfo = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onRefresh() {
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.isRefresh = false;
          this.finished = false;
          this.list = [];
          this.page_num = 0;
          this.timer = null;
          this.onLoad();
        }, 1000);
      }
    },
    onLoad() {
      this.getAccountLog();
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
        .then(response => {
          if (response.code == 0) {
            response = JSON.parse(crypto.decrypt(response.data));
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
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.van-nav-bar__text{
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
  background-image: url(../assets/images/jbbg.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #c9a273;
  height: 146px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .item {
    flex: 1;  
    text-align: center;
    border-right: 1px solid #c9a273;
    &:last-child{
      border: 0;
    }
    .top{
      font-size: 18px;
    }
    .bottom {
      font-size: 14px;
      margin-top: 6px;
    }
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