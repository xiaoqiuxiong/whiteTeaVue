<template>
  <div>
    <div class="top-area">
      <!-- 顶部搜索框area -->
      <div class="search-area">
        <van-search
          @click="$router.push({name: 'SearchCode'})"
          shape="round"
          disabled
          placeholder="福鼎白茶&酵素"
        ></van-search>
      </div>
      <!-- 轮播area -->
      <div class="swipe-area home-swipe-area">
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(item, index) in banners" :key="index">
            <div v-if="item.code == 'mianmo'" @click="skipSwipeFn">
              <img v-lazy="item.image">
            </div>
            <div v-else>
              <img v-lazy="item.image">
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <!-- nav area -->
    <!-- <div class="nav-area">
      <van-row class="navs" type="flex" justify="space-between">
        <van-col class="nav-item" span="4" v-for="(item,index) in  navs" :key="index">
          <img :src="item.img" alt>
          <span>{{item.text}}</span>
        </van-col>
      </van-row>
    </div>-->
    <!-- 产品列表 -->
    <div class="goods-list-area">
      <div
        v-for="(item, index) in goods"
        :key="index"
        class="goods-item"
        @click="skipGoods(item.goods_list[0].goods_id)"
      >
        <div class="top">
          <img :src="item.goods_list[0].mobile_img" alt>
        </div>
        <div class="bottom">
          <div class="left">
            <div class="title">{{item.goods_list[0].goods_name}}</div>
            <div class="price">¥ {{item.goods_list[0].shop_price | moneyFilter}} 起</div>
          </div>
          <div class="right">
            <van-button round type="primary">立即购买</van-button>
          </div>
        </div>
      </div>
    </div>
    <van-dialog
      :close-on-click-overlay="true"
      class="mask-activity"
      v-model="show"
      :show-confirm-button="false"
    >
      <div @click="closeMask" class="cont">
        <img class="cont-img" v-lazy="maskActivityImg">
        <img
          class="btn-img"
          @click.stop="$router.push({name: 'InviteToGetGift'})"
          v-lazy="maskActivityBtnImg"
        >
        <img class="close-img" v-lazy="maskActivityCloseImg">
      </div>
    </van-dialog>
  </div>
</template>

<script>
import {
  apiHome
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Dialog, Toast } from "vant";
export default {
  data() {
    return {
      loading: "",
      show: false,
      maskActivityImg: require("@/assets/images/mask_activity/01.png"),
      maskActivityBtnImg: require("@/assets/images/mask_activity/04.png"),
      maskActivityCloseImg: require("@/assets/images/mask_activity/05.png"),
      banners: [],
      navs: [
        {
          img: require("../assets/images/home_nav01.png"),
          text: "日常用品"
        },
        {
          img: require("../assets/images/home_nav02.png"),
          text: "营养保健"
        },
        {
          img: require("../assets/images/home_nav03.png"),
          text: "食品酒类"
        },
        {
          img: require("../assets/images/home_nav04.png"),
          text: "生活服务"
        }
      ],
      goods: [],
      page_num: 10
    };
  },
  created() {
    this.loading = Toast.loading({
      duration: 0,
      forbidClick: true,
      loadingType: "spinner",
      message: "loading..."
    });
    apiHome({ page_num: 10 })
      .then(res => {
        this.banners = res.data.banner;
        this.goods = res.data.goods;
        this.loading.clear()
      })
      .catch(err => {
        this.loading.clear()
      });
    this.show = this.$store.state.hasMask == "true" ? true : false;
  },
  methods: {
    closeMask() {
      this.show = false;
      this.$store.commit("setHasMask", false);
    },
    skipGoods(id) {
      this.$router.push({
        name: "Goods",
        query: {
          goods_id: id
        }
      });
    },
    skipSwipeFn(url) {
      this.$router.replace({ name: "InviteToGetGift" });
    }
  }
};
</script>

<style lang="less" scoped>
.mask-activity {
  background-color: transparent;
  top: 40%;
  .cont {
    text-align: center;
    .cont-img {
      width: 260px;
      height: 300px;
    }
    .btn-img {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      box-shadow: 0 4px 4px rgb(136, 19, 19);
      border-radius: 35px;
      height: 40px;
      &:active {
        opacity: 0.9;
      }
    }
    .close-img {
      display: block;
      width: 22px;
      height: 22px;
      padding: 10px;
      margin: 0 auto;
      padding-top: 20px;
      &:active {
        opacity: 0.9;
      }
    }
  }
}
.search-area {
  .van-search {
    background: transparent !important;
  }
}
.swipe-area {
  padding: 0.42667rem;
  padding-top: 0;
  padding-bottom: 0;
  box-sizing: border-box;

  .van-swipe {
    height: 168px;
    border-radius: 10px;
    overflow: hidden;
  }
  .van-swipe-item {
    border-radius: 10px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.4);
  }
  img {
    width: 100%;
    border-radius: 10px;
  }
}
.top-area {
  background-image: url("../assets/images/bg_bar2.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center -12px;
  background-color: #fff;
}
.nav-area {
  padding: 0.3rem 0.42267rem;
  align-items: center;
  background-color: #fff;
  .nav-item {
    text-align: center;
    img {
      height: 48px;
      width: 48px;
    }
    span {
      font-size: 12px;
      color: #333;
    }
  }
}
.goods-list-area {
  padding: 0.42267rem;
  padding-top: 0;
  padding-bottom: 0.3rem;
}
.goods-item {
  margin-top: 0.3rem;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 6px #ddd;
  .bottom {
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    .left {
      flex: 1;
      .title {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .price {
        color: #f33b10;
      }
    }
    .right {
      display: flex;
      align-items: center;
      button {
        padding: 0 0.7rem;
      }
    }
  }
  img {
    width: 100%;
  }
}
</style>