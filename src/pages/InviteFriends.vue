<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area"
      fixed
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <div class="top-area">
      <div class="img-box">
        <van-image v-if="url==''" lazy-load :src="defaultQRcode"/>
        <qrcode-vue v-if="url!=''" class="qrcode-img" :size="100" :value="value"></qrcode-vue>
      </div>
      <div class="share">
        <span>（长按二维码分享给好友）</span>
        <!-- <van-button v-if="isWeiXin" round size="small" plain>点击分享给好友</van-button> -->
      </div>
    </div>
    <div class="hedging-area">
      <van-checkbox v-model="checked" @change="cahngeDuichong">
        对冲邀请
        <img slot="icon" slot-scope="props" :src="props.checked ? icon.active : icon.normal">
      </van-checkbox>
      <span class="detal" @click="showDialog"></span>
    </div>
    <van-dialog v-model="show" title="对冲规则" confirmButtonText="我知道了" confirmButtonColor="#FD7023">
      <div class="dialog-cont">
        <P v-for="(item, index) in duiChongRule" :key="index">{{item}}</P>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import qrcodeVue from "qrcode-vue";
import {
  apiGetDuiChongRule,
  apiGetInviteUserInfo,
  apiGetUserDuiChongInfo
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      defaultQRcode: require("@/assets/images/good_default.png"),
      checked: false,
      icon: {
        normal: require("../assets/images/icon-normal.png"),
        active: require("../assets/images/icon-active.png")
      },
      duiChongRule: [],
      show: false,
      url: "",
      duichongUrl: "",
      value: ""
    };
  },
  components: {
    qrcodeVue
  },
  created() {
    apiGetDuiChongRule()
      .then(result => {
        if (result.code == 0) {
          this.duiChongRule = result.data;
        } else {
          this.$toast(result.msg);
        }
      })
      .catch(err => {
        this.$toast(this.ERRORNETWORK);
      });
    this.getInviteUserInfo();
    this.getUserDuiChongInfo();
  },
  methods: {
    cahngeDuichong() {
      if (this.checked) {
        this.value = this.duichongUrl;
      } else {
        this.value = this.url;
      }
    },
    getInviteUserInfo() {
      apiGetInviteUserInfo().then(result => {
        if (result.code == 0) {
          result = JSON.parse(crypto.decrypt(result.data.data));
          this.url = `${location.origin}/#/bindFriends?parent_id=${
            result.user_id
          }&key=`;
          this.value = this.url;
        } else {
          this.$toast(result.msg);
        }
      });
    },
    getUserDuiChongInfo() {
      apiGetUserDuiChongInfo().then(result => {
        if (result.code == 0) {
          result = JSON.parse(crypto.decrypt(result.data.data));
          this.duichongUrl = `${location.origin}/#/bindFriends?parent_id=${
            result.parent_id
          }&key=${result.uid}`;
        } else {
          this.$toast(result.msg);
        }
      });
    },
    showDialog() {
      this.show = true;
    }
  }
};
</script>

<style lang="less" scoped>
.dialog-cont {
  font-size: 12px;
  padding: 20px;
  box-sizing: border-box;
  line-height: 1.6;
  color: #666;
}
.top-area {
  margin-top: 52px;
  text-align: center;
  background-color: #fff;
  .img-box {
    margin-top: 30px;
    display: inline-block;
    width: 134px;
  }
  .share {
    margin-top: 20px;
    padding-bottom: 20px;
    color: #666;
    button {
      color: #fd7023;
      border: 1px solid#FD7023;
    }
  }
}
.hedging-area {
  margin-top: 6px;
  padding: 20px 24px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  align-items: center;
  .detal {
    display: inline-block;
    height: 16px;
    width: 16px;
    background-image: url(../assets/images/what.png);
    background-repeat: no-repeat;
    background-size: 16px 16px;
    background-position: center center;
    padding: 10px;
  }
}
.qrcode-img {
  img {
    width: 134px;
  }
}
</style>