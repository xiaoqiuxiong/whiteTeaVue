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
    <div class="goods-area">
      <div class="goods-item" v-for="(item,index) in orderInfo.goods" :key="index">
        <div class="left">
          <img v-lazy="item.goods_thumb" alt>
        </div>
        <div class="right">{{item.goods_name}}</div>
      </div>
    </div>
    <div class="txt-area">
      <van-cell-group>
        <van-field
          class="textarea-field"
          v-model="content"
          type="textarea"
          placeholder="分享您的购物心得～"
          rows="3"
          autosize
        />
      </van-cell-group>
    </div>
    <div class="img-area">
      <van-uploader v-model="fileList" multiple :max-count="4"/>
    </div>
    <div class="check-area">
      <van-checkbox v-model="is_hide">
        匿名评论
        <img slot="icon" slot-scope="props" :src="props.checked ? icon.active : icon.normal">
      </van-checkbox>
    </div>
    <div class="comment-star-area">
      <div class="star-item">
        <div class="left">商品描述</div>
        <div class="right">
          <van-rate
            v-model="com_rank"
            :size="20"
            :gutter="14"
            color="#FF6312"
            void-icon="star"
            void-color="#eee"
          />
        </div>
      </div>
      <div class="star-item">
        <div class="left">服务态度</div>
        <div class="right">
          <van-rate
            v-model="server_score"
            :size="20"
            :gutter="14"
            color="#FF6312"
            void-icon="star"
            void-color="#eee"
          />
        </div>
      </div>
      <div class="star-item">
        <div class="left">发货速度</div>
        <div class="right">
          <van-rate
            v-model="send_score"
            :size="20"
            :gutter="14"
            color="#FF6312"
            void-icon="star"
            void-color="#eee"
          />
        </div>
      </div>
      <div class="star-item">
        <div class="left">物流快递</div>
        <div class="right">
          <van-rate
            v-model="shipping_score"
            :size="20"
            :gutter="14"
            color="#FF6312"
            void-icon="star"
            void-color="#eee"
          />
        </div>
      </div>
    </div>
    <div class="btn-area">
      <van-button type="primary" round @click="submit">发布评价</van-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  apiWatchOrder,
  apiGetUploadToken,
  apiUploadQiniuHeadImage,
  apiSendComment
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, Dialog } from "vant";
import Menu from "../components/Menu.vue";
export default {
  components: {
    Menu
  },
  data() {
    return {
      uploadImages: [],
      fileList: [],
      file: "",
      keys: [],
      orderInfo: {},
      content: "",
      token: "",
      param: new FormData(),
      is_hide: false,
      icon: {
        normal: require("@/assets/images/radio_normal.png"),
        active: require("@/assets/images/radio_active.png")
      },
      com_rank: 1,
      server_score: 0,
      send_score: 0,
      shipping_score: 0,
      count: 0
    };
  },
  created() {
    // 获取传过来的order_id,如果没有重定向到首页
    const orderidData = this.$route.query.order_id || null;
    if (!orderidData) {
      this.$router.replace({ name: "Orders" });
      return false;
    }
    // 检查订单
    this.actionCheckOrder(Number(orderidData));
  },
  methods: {
    submit() {
      // 判断数据
      if (this.content == "" && this.fileList.length < 1) {
        Toast(this.APPNAME+"评论内容不能为空");
        return false;
      }
      this.count = 0;
      this.getToken(this.fileList[0].file);
    },
    submitComment() {
      let img_urls = [];
      this.keys.map(e => {
        img_urls.push({
          key: e
        });
      });
      apiSendComment({
        data: crypto.encrypt(
          JSON.stringify({
            order_id: parseFloat(this.$route.query.order_id),
            goods_id: this.orderInfo.goods[0].goods_id,
            add_time: this.orderInfo.order.order_info.add_time,
            content: this.content,
            com_rank: this.com_rank,
            server_score: this.server_score,
            send_score: this.send_score,
            shipping_score: this.shipping_score,
            is_hide: this.is_hide,
            order_sn: this.orderInfo.order.order_info.order_sn,
            img_urls: img_urls
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            Toast({
              type: "success",
              message: "评论成功",
              duration: 1500,
              onClose: () => {
                this.$router.push({
                  name: "Orders"
                });
              }
            });
          } else {
            Toast(this.APPNAME+result.msg);
          }
        })
        .catch(err => {
          Toast(this.APPNAME+this.ERRORNETWORK);
        });
    },
    getToken(file) {
      apiGetUploadToken({
        data: crypto.encrypt(JSON.stringify({ tag: "gongxin" }))
      })
        .then(result => {
          if (result.code == 0) {
            this.token = crypto.decrypt(result.data);
            this.actionHeadimg(file);
          }
        })
        .catch(err => {
          Toast.fail("上传失败");
        });
    },
    actionHeadimg(file) {
      this.param.append("file", this.file, this.file.name); //通过append向form对象添加数据
      this.param.append("token", this.token); //通过append向form对象添加数据
      axios
        .post("http://upload.qiniu.com/", this.param)
        .then(response => {
          this.keys.push(response.data.key);
          this.count++;
          if (this.count <= this.fileList.length) {
            this.getToken(this.fileList[this.count]);
          } else {
            this.submitComment();
          }
        })
        .catch(error => {
          Toast.fail("上传失败");
        });
    },
    actionCheckOrder(order_id) {
      apiWatchOrder({
        data: crypto.encrypt(JSON.stringify({ order_id: order_id }))
      })
        .then(result => {
          if (result.code == 0) {
            this.orderInfo = result.data;
          } else {
            this.$router.replace({ name: "Orders" });
          }
        })
        .catch(err => {
          Toast(this.APPNAME+this.ERRORNETWORK);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.btn-area {
  width: 80%;
  margin: 0 auto;
  margin-top: 16px;
  button {
    width: 100%;
  }
}
.comment-star-area {
  background-color: #fff;
  margin-top: 10px;
  padding-bottom: 10px;
  .star-item {
    padding: 10px 18px;
    padding-bottom: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    font-size: 12px;
    .right {
      padding-left: 20px;
      box-sizing: border-box;
    }
  }
}
.txt-area {
  .textarea-field {
    font-size: 12px;
  }
  [class*="van-hairline"]::after {
    border: 0;
  }
}

.check-area {
  background-color: #fff;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  box-sizing: border-box;
  font-size: 12px;
  .van-checkbox {
    border-top: 1px solid #f5f5f5;
    width: 100%;
    height: 100%;
  }
}
.upload-images {
  padding: 0 20px;
  .img-box {
    display: inline-block;
  }
  .image {
    width: 60px;
    height: 80px;
  }
  .icon-add {
    width: 40px;
    height: 40px;
    border: 1px solid #9a9ba3;
    border-radius: 50%;
    overflow: hidden;
    display: inline-block;
    margin-top: 20px;
  }

  .icon-add:before {
    content: "";
    position: absolute;
    width: 50px;
    height: 2px;
    left: 50%;
    top: 50%;
    margin-left: -25px;
    margin-top: -1px;
    background-color: #aaabb2;
  }
  .icon-add:after {
    content: "";
    position: absolute;
    width: 2px;
    height: 50px;
    left: 50%;
    top: 50%;
    margin-left: -1px;
    margin-top: -25px;
    background-color: #aaabb2;
  }
  .icon-po {
    position: relative;
    width: 60px;
    height: 80px;
    margin-right: 20px;
    margin-top: 20px;
  }
  .icon-close {
    position: absolute;
    right: -8px;
    top: -8px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: red;
    color: #fff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.img-area {
  background-color: #fff;
  display: block;
  padding: 10px 18px;
  box-sizing: border-box;
  padding-bottom: 0;
}
.goods-area {
  margin-top: 46px;
  padding: 0 18px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid #f5f5f5;
  font-size: 12px;
  .goods-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    box-sizing: border-box;
    .left {
      img {
        width: 40px;
        height: 40px;
      }
    }
    .right {
      flex: 1;
      padding-left: 16px;
      box-sizing: border-box;
    }
  }
}
</style>