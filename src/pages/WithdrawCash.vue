<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- 地址列表 -->
    <div class="address-list">
      <van-cell
        class="address-item"
        title="提现到支付宝"
        :icon="require('../assets/images/pay_alipay.png')"
        @click="$router.push({name: 'WithdrawToAlipay'})"
      />
      <div class="address-item" v-for="(item, index) in list" :key="index">
        <van-swipe-cell :right-width="160">
          <van-cell-group>
            <van-cell
              :title="item.short_name"
              :value="'卡号'+ formatStar(item.card_num)"
              :icon="item.card_logo"
              @click="$router.push({name: 'WithdrawToCard',query: {id: item.id}})"
            />
          </van-cell-group>
          <div slot="right">
            <span class="right-btn" @click="del(item.id)">删 除</span>
          </div>
        </van-swipe-cell>
      </div>
      <van-cell
        is-link
        class="address-item"
        title="添加银行卡"
        :icon="require('../assets/images/addCard.png')"
        @click="$router.push({name: 'AddBankCard'})"
      />
    </div>
  </div>
</template>

<script>
import { apiUserBanks, apiUserDelBankCard } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      list: [],
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
    this.getApiUserBanks();
  },

  methods: {
    formatStar(name) {
      let newStr;
      let char = "";
      let length = name.length;
      for (let i = 1, len = length - 4; i < len; i++) {
        char += "*";
        if ((i / 4) % 1 == 0) {
          char += " ";
          length++;
        }
      }
      newStr = char + name.substr(name.length - 4, 4);
      return newStr;
    },
    getApiUserBanks() {
      apiUserBanks({
        data: crypto.encrypt(
          JSON.stringify({
            get_banks_info: true
          })
        )
      })
        .then(result => {
          this.loadingMsg.clear();
          if (result.code == 0) {
            this.list = JSON.parse(crypto.decrypt(result.data));
          } else {
            this.$toast(result.msg);
          }
        })
        .catch(err => {
          this.loadingMsg.clear();
          this.$toast(this.ERRORNETWORK);
        });
    },
    del(id) {
      this.loadingMsg = Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: "spinner",
        message: "loading..."
      });
      apiUserDelBankCard({
        data: crypto.encrypt(
          JSON.stringify({
            card_id: id
          })
        )
      })
        .then(result => {
          this.loadingMsg.clear();
          if (result.code == 0) {
            this.$toast("删除成功");
            this.list.filter((item, index) => {
              if (item.address_id == id) {
                this.list.splice(index, 1);
              }
            });
          } else {
            this.$toast(result.msg);
          }
        })
        .catch(err => {
          this.loadingMsg.clear();
          this.$toast(this.ERRORNETWORK);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.alipay {
  margin-top: 6px;
}
.add-address-area {
  padding-top: 6px;
  position: fixed;
  bottom: 6px;
  left: 0;
  width: 100%;
  .van-button {
    width: 80%;
    margin-left: 10%;
  }
}
.address-item {
  background-color: #fff;
  .van-swipe-cell__right {
    & > div {
      height: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
  .item-cont {
    padding: 18px;
    padding-left: 30px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .left {
      flex: 1;
      padding-right: 10px;
      box-sizing: border-box;
      .top {
        font-size: 14px;
        display: flex;
        align-items: center;
        .van-image {
          padding-left: 10px;
        }
      }
      .bottom {
        padding-top: 10px;
        box-sizing: border-box;
        font-size: 12px;
      }
    }
  }
  .right-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ff480c;
    color: #fff;
    height: 100%;
    &:first-child {
      background-color: #eee;
      color: #666;
    }
  }
}
.address-list {
  margin-top: 6px;
}
</style>