<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area"
      fixed
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    >
      <van-icon @click="$refs.menu.isShow(true)" name="weapp-nav" slot="right"/>
    </van-nav-bar>
    <Menu ref="menu"></Menu>
    <!-- tab area -->
    <div class="comment-tab">
      <div
        v-for="(item, index) in tabs"
        :key="index"
        @click="changeTab(index)"
        :class="['comment-tab-item', {'active': commentTabActive == index}]"
      >{{item.name}}</div>
    </div>
    <div class="van-hairline--bottom"></div>
    <!-- 订单 area -->
    <div class="income-list-area">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有数据了"
        error-text="数据加载失败了"
        @load="onLoad"
      >
        <router-link
          :to="{name: 'OrderDetail',query:{order_id:item.order_id,status: item.order_final_status}}"
          class="item"
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="item-title">
            商品将由平台为您打包寄出
            <span v-if="item.order_final_status==1">待付款</span>
            <span v-if="item.order_final_status==2">待发货</span>
            <span v-if="item.order_final_status==3">待收货</span>
            <span v-if="item.order_final_status==4">待评论</span>
            <span v-if="item.order_final_status==5">合约中</span>
          </div>
          <van-card
            class="item-card"
            :lazy-load="true"
            v-if="item.goods_info.attr_infos"
            :num="item.goods_info.attr_infos[0].goods_number"
            :price="item.goods_info.attr_infos[0].goods_price | moneyFilter"
            :desc="item.goods_info.attr_infos[0].attr_value"
            :title="item.goods_info.attr_infos[0].goods_name"
            :thumb="item.goods_info.attr_infos[0].goods_thumb"
          >
            <div slot="footer">
              <div v-if="item.order_final_status==1">
                <van-button round class="btn">取消订单</van-button>
                <van-button round class="btn primary">立即付款</van-button>
                <van-button round class="btn primary">查看订单</van-button>
              </div>
              <div v-if="item.order_final_status==2">
                <van-button round class="btn primary">查看订单</van-button>
              </div>
              <div v-if="item.order_final_status==3">
                <van-button round class="btn">查看物流</van-button>
                <van-button round class="btn primary">确认收货</van-button>
                <van-button round class="btn primary">查看订单</van-button>
              </div>
              <div v-if="item.order_final_status==5">
                <van-button round class="btn primary">查看订单</van-button>
              </div>
              <div v-if="item.order_final_status==4">
                <van-button round class="btn primary">立即评价</van-button>
              </div>
            </div>
          </van-card>
        </router-link>
      </van-list>
    </div>
    <back-top></back-top>
  </div>
</template>

<script>
import {
  apiGetUserOrderList,
  apiCancelOrder,
  apiConfirmOrder
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, Dialog } from "vant";
import BackTop from "../components/BackTop.vue";
import Menu from "../components/Menu.vue";

export default {
  components: {
    BackTop,
    Menu
  },
  data() {
    return {
      tabs: [
        {
          name: "全部",
          val: ""
        },
        {
          name: "待付款",
          val: "await_pay"
        },
        {
          name: "待发货",
          val: "await_ship"
        },
        {
          name: "待收货",
          val: "await_receipt"
        },
        {
          name: "合约",
          val: "contract"
        },
        {
          name: "评价",
          val: "await_comment"
        }
      ],
      commentTabActive: 0,
      list: [],
      loading: false,
      finished: false,
      page_num: 0,
      total: 1,
      level_1: 1,
      level_2: 0,
      timer2: null,
      type: ""
    };
  },
  created() {
    this.type = this.$route.query.type;
    switch (this.type) {
      case "await_pay":
        this.commentTabActive = 1;
        break;
      case "await_ship":
        this.commentTabActive = 2;
        break;
      case "await_receipt":
        this.commentTabActive = 3;
        break;
      case "await_comment":
        this.commentTabActive = 5;
        break;
      case "contract":
        this.commentTabActive = 4;
        break;
      default:
        this.commentTabActive = 0;
    }
  },
  methods: {
    orderLogistics(order_id) {
      this.$router.push({
        name: "OrderLogistics",
        query: { order_id: order_id }
      });
    },
    changeTab(req_type) {
      this.commentTabActive = req_type;
      this.tabs.filter((e, index) => {
        if (index == req_type) {
          this.type = e.val;
        }
      });
      this.finished = false;
      this.list = [];
      this.page_num = 0;
      this.timer2 = null;
      this.onLoad();
    },
    onLoad() {
      this.loading = true;
      if (!this.timer2) {
        this.timer2 = setTimeout(() => {
          this.getApiGetUserOrderList();
        }, 500);
      }
    },
    getApiGetUserOrderList() {
      apiGetUserOrderList({
        data: crypto.encrypt(
          JSON.stringify({
            page_num: this.page_num,
            type: this.type,
            tag: "gongxin"
          })
        )
      })
        .then(response => {
          if (response.code == 0) {
            if (response.data.length) {
              this.page_num++;
              this.list = this.list.concat(response.data);

              if (response.data.length < 15) {
                this.finished = true;
              }
            } else {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
          this.loading = false;
          this.timer2 = null;
        })
        .catch(error => {
          Toast(this.APPNAME+this.ERRORNETWORK);
          this.loading = false;
          this.timer2 = null;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.comment-tab {
  padding: 10px;
  padding-top: 56px;
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
  padding: 6px;
  padding-top: 0;
  box-sizing: border-box;
  .item {
    display: block;
    margin-top: 6px;
    background-color: #fff;
    padding: 20px;
    padding-bottom: 14px;
    padding-top: 0;
    border-radius: 6px;
    .item-title {
      padding-top: 16px;
      padding-bottom: 6px;
      font-size: 12px;
      span {
        float: right;
        color: #fd6c1b;
      }
    }
    .item-card {
      background-color: #fff;
      padding: 0;
      .van-card__content {
        padding-top: 4px;
        .van-card__desc {
          margin-top: 4px;
          font-size: 11px;
        }
        .van-card__bottom {
          margin-top: 10px;
        }
      }
      .van-card__footer {
        margin-top: 20px;
        .btn {
          height: 26px;
          line-height: 24px;
          font-size: 12px;
        }
        .primary {
          color: #f65f23;
          border-color: #f65f23;
        }
      }
    }
  }
}
</style>