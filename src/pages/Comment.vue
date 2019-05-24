<template>
  <div>
    <!-- 导航 area -->
    <van-nav-bar fixed class="navbar-area" title="评论" left-arrow @click-left="returnPrePage"/>
    <!-- 评论展示list area -->
    <div class="comment-show-area">
      <div class="comment-tab">
        <div
          @click="changeTab(0)"
          :class="['comment-tab-item', {'active': commentTabActive == 0}]"
        >全部(88)</div>
        <div
          @click="changeTab(1)"
          :class="['comment-tab-item', {'active': commentTabActive == 1}]"
        >好评(22)</div>
        <div
          @click="changeTab(2)"
          :class="['comment-tab-item', {'active': commentTabActive == 2}]"
        >中评(22)</div>
        <div
          @click="changeTab(3)"
          :class="['comment-tab-item', {'active': commentTabActive == 3}]"
        >差评(22)</div>
        <div
          @click="changeTab(4)"
          :class="['comment-tab-item', {'active': commentTabActive == 4}]"
        >晒单(22)</div>
      </div>
      <div class="van-hairline--bottom"></div>
      
      <div class="comment-lists">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="(item, index) in list" :key="index">
            <div class="line1">
              <div class="left">
                <img :onerror="errorImg" :src="item.headimg" alt>
                <span>{{item.user_name}}</span>
              </div>
              <div class="right">
                <van-rate
                  v-model="item.comment_rank"
                  :size="16"
                  color="#FF4909"
                  void-color="#eee"
                  readonly
                />
              </div>
            </div>
            <div class="line2">{{item.add_time | dateFilter}}</div>
            <div class="line3">{{item.content || '暂无'}}</div>
            <div class="imgs">
              <div v-for="(item1, index1) in item.imgs" :key="index1" class="list-img-item">
                <div class="list-img">
                  <img @click="showPic(index,index1)" v-lazy="item1.thumb" alt>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import { apiGoodsComment } from "@/request/api";
import crypto from "@/cryptoUtil";
export default {
  data() {
    return {
      commentTabActive: 0,
      list: [],
      loading: false,
      finished: false,
      page_num: 0,
      errorImg:
        'this.src="' + require("../assets/images/icon_avatar.png") + '"',
      value: 3,
      likeImg: require("../assets/images/icon_good_reputation.png")
    };
  },
  methods: {
    showPic(index,index1) {
      let showPicArray = []
      this.list[index].imgs.map((e=>{
        showPicArray.push(e.image)
      }))
      ImagePreview({
        lazyLoad: true, 
        images: showPicArray,
        startPosition: index1,
      });
    },
    changeTab(req_type) {
      this.commentTabActive = req_type;
      this.list = [];
      this.finished = false;
      this.page_num = 0;
      this.onLoad();
    },
    onLoad() {
      setTimeout(() => {
        this.getCommentList();
      }, 1000);
    },
    getCommentList() {
      apiGoodsComment({
        data: crypto.encrypt(
          JSON.stringify({
            page_num: this.page_num,
            goods_id: Number(this.$route.query.goods_id),
            req_type: this.commentTabActive
          })
        )
      })
        .then(response => {
          if (response.code == 0 && response.data.length) {
            this.page_num++;
            this.list = this.list.concat(response.data);
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
.comment-show-area {
  margin-top: 52px;
  .comment-tab {
    font-size: 12px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #fff;
    .comment-tab-item {
      text-align: center;
      width: 64px;
      border-radius: 13px;
      height: 26px;
      line-height: 26px;
      background-color: #f5e7dd;
      &.active {
        color: #fff;
        background: linear-gradient(
          91deg,
          rgba(255, 153, 13, 1) 0%,
          rgba(255, 70, 10, 1) 100%
        );
      }
    }
  }
  .van-list {
    & > div {
      background-color: #fff;
      padding: 16px;
      box-sizing: border-box;
      margin-top: 6px;
      .left {
        display: flex;
        align-items: center;
      }
      &:first-child {
        margin-top: 0;
      }
      .line1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        img {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          margin-right: 6px;
          background: #f5f5f5;
        }
      }
      .line2 {
        font-size: 10px;
        color: #666;
        margin-top: 10px;
      }
      .line3 {
        font-size: 13px;
        margin-top: 4px;
      }
    }
    .imgs {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .list-img-item {
        flex: 0 0 33.33%;
        padding: 2px;
        box-sizing: border-box;
      }
      .list-img {
        height: 0;
        width: 100%;
        padding: 50% 0;
        overflow: hidden;
        img {
          width: 100%;
          margin-top: -50%;
          background-color: #fff;
          border: none;
        }
      }
    }
  }
}
</style>