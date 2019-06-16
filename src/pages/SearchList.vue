<template>
  <div class="contain-area">
    <div class="search-box">
      <div class="icon-box" @click="returnPrePage">
        <van-icon name="arrow-left" size="20"/>
      </div>
      <van-search
        class="search-input"
        v-model="key_word"
        placeholder="请输入搜索关键词"
        disabled
        shape="round"
        @search="onSearch"
      ></van-search>
      <div class="more" @click="$refs.menu.isShow(true)">
        <van-icon name="weapp-nav" :size="20"/>
      </div>
      <Menu ref="menu"></Menu>
    </div>
    <!-- search-cont-area -->
    <div class="search-cont-area">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有数据了"
        error-text="数据加载失败了"
        @load="onLoad"
      >
        <div
          @click="$router.push({name: 'Goods', query: {goods_id: item.goods_id}})"
          class="item"
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="left">
            <van-image width="100" height="100" lazy-load :src="item.goods_thumb"/>
          </div>
          <div class="right">
            <div class="title">{{item.goods_name}}</div>
            <div class="bottom">
              <div class="peice">
                ¥{{item.shop_price | moneyFilter}}
                <del>¥{{item.market_price | moneyFilter}}</del>
              </div>
              <div class="bottom-cont">
                <div class="bottom-left">已售{{item.sell_num}}件</div>
                <div class="bottom-right">
                  <van-button type="primary" round size="small">立即购买</van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import { apiSearchGoods } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      key_word: "",
      list: [],
      loading: false,
      finished: false,
      isRefresh: false,
      page_num: 0,
      timer1: null,
      timer2: null
    };
  },
  components: {
    Menu
  },
  created() {
    if (this.$route.query.key_word) {
      this.key_word = this.$route.query.key_word;
    }
  },
  methods: {
    onLoad() {
      if (!this.timer2) {
        this.timer2 = setTimeout(() => {
          this.searchCode();
        }, 500);
      }
    },
    searchCode() {
      apiSearchGoods({
        data: crypto.encrypt(
          JSON.stringify({ page_num: this.page_num, key_word: this.key_word })
        )
      })
        .then(result => {
          if (result.code == 0) {
            result = result.data;
            this.total_income = result.total_income;
            if (result.length) {
              this.page_num++;
              this.list = this.list.concat(result);
            } else {
              this.finished = true;
            }
          } else {
            this.finished = true;
            this.$toast(result.msg);
          }
          this.loading = false;
          this.timer2 = null;
        })
        .catch(err => {
          this.$toast(this.ERRORNETWORK);
        });
    },
    onSearch() {},
    onConcel() {}
  }
};
</script>

<style lang="less" scoped>
.contain-area {
  position: fixed;
  width: 100%;
  height: 100%;
}
.search-cont-area {
  height: calc(100% - 54px);
  background-color: #fff;
  border-radius: 10px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 12px;
  .item {
    display: flex;
    justify-content: space-between;
    padding: 14px;
    box-sizing: border-box;
    border-bottom: 1px solid #f5f5f5;

    .van-image {
      border-radius: 6px;
      overflow: hidden;
    }
    .right {
      flex: 1;
      padding-left: 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        font-size: 14px;
      }
      .bottom {
        .peice {
          font-size: 16px;
          color: #de443b;
          del {
            font-size: 12px;
            color: #999;
          }
        }
        .bottom-cont {
          display: flex;
          align-items: center;
          align-items: flex-end;
          justify-content: space-between;
          .bottom-left {
            color: #999;
          }
        }
      }
    }
  }
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f2f3f5;
  .icon-box {
    width: 54px;
    text-align: center;
  }
  .search-input {
    flex: 1;
    padding-left: 0;
    background-color: #f2f3f5 !important;
    padding-right: 0;
    .van-search__content {
      background-color: #fff;
    }
  }
  .more {
    width: 54px;
    text-align: center;
  }
}
</style>