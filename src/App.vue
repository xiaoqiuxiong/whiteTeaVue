<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { apiAllAddress } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
import allAddressJson from "@/assets/js/allAddress.json";
export default {
  name: "App",
  mounted() {
    document.title = this.$route.meta.title;
  },
  created() {
    try {
      document.body.removeChild(document.getElementById("appLoading"));
      setTimeout(function() {
        document.getElementById("app").style.display = "block";
      }, 500);
    } catch (e) {}
    this.$store.commit("setAllAddress", JSON.stringify(allAddressJson.data));
  },
  watch: {
    $route(to, from) {
      document.title = this.$route.meta.title;
    }
  }
};
</script>

<style lang="less">
.van-picker__cancel,
.van-picker__confirm {
  color: #fd6b1a;
}
.nothing {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 144px;
    margin-top: 20px;
  }
}
.van-dialog__confirm,
.van-dialog__confirm:active {
  color: #fd6b1a;
}
#pay_form {
  display: none;
}
.qrcode-img {
  img {
    width: 134px;
  }
}
.nav-bar-static-height {
  height: 46px;
}
.van-cell--clickable:active {
  background: #fff;
}
.sureOrder {
  .van-cell__value {
    display: flex;
    align-items: center;
  }
  .pay-coins-filed,
  .pay-balance-filed {
    .van-cell {
      background-color: #f5f5f5;
      padding-left: 8px !important;
      padding-right: 8px !important;
      input {
        text-align: right;
      }
    }
    .van-field__body {
      width: 100%;
    }
  }
}

.van-radio__icon {
  width: 14px;
  height: 14px;
  line-height: 14px;
  img {
    width: 14px;
    height: 14px;
  }
}
.van-checkbox__icon {
  width: 14px;
  height: 14px;
  line-height: 14px;
  img {
    width: 14px;
    height: 14px;
  }
}
.autoRadio {
  .van-cell__value {
    flex: inherit;
    padding-right: 6px;
  }
}
.auto-filed {
  .van-field__label {
    width: auto;
  }
  .van-field__left-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.van-skeleton__avatar {
  background-image: url("./assets/images/good_default.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
a {
  color: #323233;
}
.addaddress {
  .van-nav-bar__text {
    color: #fd6b1a;
  }
}
.upload-avatar-box {
  height: 80px;
  align-items: center;
  .van-cell__value {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px !important;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .van-uploader {
    padding-right: 36px;
  }
}
.nothing-area {
  width: 100vw;
  height: 100vw;
  background-image: url(./assets/images/nothing.png);
  background-size: 40%;
  background-position: center 40px;
  background-repeat: no-repeat;
}
#app {
  font-size: 0.37333rem;
}
html,
body,
#app {
  color: #323233;
  background-color: #f2f3f5;
  font-family: "PingFang SC", Helvetica, "STHeiti STXihei", "Microsoft YaHei",
    Tohoma, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.van-tabs__line {
  background-color: #ff711c;
  height: 2px;
  bottom: 0.56rem;
}
.van-button--primary {
  background: linear-gradient(
    91deg,
    rgba(250, 166, 51, 1) 0%,
    rgba(255, 70, 10, 1) 100%
  );
  border: 0;
}
.van-nav-bar .van-icon {
  color: #333;
  font-size: 0.6rem;
}
.home-swipe-area {
  .van-swipe__indicator {
    height: 2px;
    width: 12px;
  }
  .van-swipe__indicator--active {
    background-color: #fff;
  }
}
</style>
