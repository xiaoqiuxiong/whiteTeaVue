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
        show-action
        shape="round"
        @search="onSearch"
      >
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
    </div>
    <!-- search-cont-area -->
    <div class="search-cont-area">
      <div class="history">
        <div class="title">
          搜索历史
          <div @click="del" v-if="searchHistory.length">
            <van-icon size="12" :name="require('@/assets/images/icon_empty.png')"/>&nbsp;删除记录
          </div>
        </div>
        <div v-if="!searchHistory.length" class="list no">暂无记录</div>
        <div v-if="searchHistory.length" class="list">
          <div @click="onSearch(item)" class="item" v-for="(item, index) in searchHistory" :key="index">{{item}}</div>
        </div>
      </div>
      <div class="hot">
        <div class="title">热门搜索</div>
        <div v-if="!list.length" class="list no">暂无记录</div>
        <div v-if="list.length" class="list">
          <div @click="onSearch(item.goods_name)" class="item" v-for="(item, index) in list" :key="index">{{item.goods_name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiGetHotGoods } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      key_word: "",
      list: [],
      searchHistory: this.$store.state.searchHistory
    };
  },
  created() {
    this.initCode();
  },
  methods: {
    del() {
      this.$store.commit("setSearchHistory", []);
      this.searchHistory = [];
    },
    initCode() {
      apiGetHotGoods()
        .then(result => {
          if (result.code == 0) {
            this.list = result.data;
          } else {
            Toast(this.APPNAME+result.msg);
          }
        })
        .catch(err => {
          Toast(this.APPNAME+this.ERRORNETWORK);
        });
    },
    onSearch(val) {
      if(val){
        this.key_word = val
      }
      if (this.searchHistory.indexOf(this.key_word) == -1) {
        this.searchHistory.push(this.key_word);
        this.$store.commit("setSearchHistory", this.searchHistory);
      }
      this.$router.push({
        name: "SearchList",
        query: { key_word: this.key_word }
      });
    },
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
  border-radius: 10px 10px 0 0;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 12px;
  .hot {
    margin-top: 10px;
    border-top: 1px solid #f5f5f5;
  }
  .title {
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > div {
      color: #999;
      display: flex;
      align-items: center;
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    &.no {
      margin-top: 10px;
      font-size: 10px;
      color: #999;
    }
    .item {
      background-color: #f5f5f5;
      padding: 0 14px;
      height: 26px;
      line-height: 26px;
      border-radius: 26px;
      font-size: 10px;
      margin-right: 10px;
      margin-top: 10px;
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
    .van-search__content {
      background-color: #fff;
    }
  }
}
</style>