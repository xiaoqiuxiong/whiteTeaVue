<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area addaddress"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- 银行卡列表 area -->
    <div class="cards-list-area">
      <van-swipe-cell :right-width="65" v-for="(item, index) in list" :key="index">
        <van-cell-group>
          <div class="item">
            <div class="left">
              <div class="top van-ellipsis">{{item.card_name}}</div>
              <div class="bottom">{{formatStar(item.card_num)}}</div>
            </div>
            <div class="right">
              <van-image width="1.6rem" height="1.6rem" fit="contain" :src="item.card_logo"/>
            </div>
          </div>
        </van-cell-group>
        <span slot="right">
          <van-icon @click="del(item.id)" class="delbtn" name="clear" color="#FF5159" size="2em"/>
        </span>
      </van-swipe-cell>
    </div>
    <!-- 增加银行卡 area -->
    <div class="add-card-area">
      <van-button round type="primary" @click="$router.push({name: 'AddBankCard'})">+ 添加银行卡</van-button>
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
      list: []
    };
  },
  created() {
    apiUserBanks({
      data: crypto.encrypt(JSON.stringify({ get_banks_info: true }))
    })
      .then(result => {
        if (result.code == 0) {
          this.list = JSON.parse(crypto.decrypt(result.data));
        }
      })
      .catch(err => {
        Toast(this.APPNAME+"网络故障，请刷新重试");
      });
  },
  methods: {
    del(id) {
      apiUserDelBankCard({
        data: crypto.encrypt(JSON.stringify({ card_id: id }))
      })
        .then(result => {
          if (result.code == 0) {
            this.list.filter((item, index) => {
              if (item.id == id) {
                this.list.splice(index, 1);
              }
            });
          }else{
            Toast(this.APPNAME+result.msg)
          }
        })
        .catch(err => {
          Toast(this.APPNAME+"网络故障，请刷新重试");
        });
    },
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
    }
  }
};
</script>

<style lang="less" scoped>
.delbtn {
  width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.add-card-area {
  width: 80%;
  margin: 0 auto;
  margin-top: 30px;
  button {
    width: 100%;
  }
}
.cards-list-area {
  padding: 4px;
  padding-top: 0;
  box-sizing: border-box;
  .item {
    margin-top: 4px;
    background-color: #ff5159;
    border-radius: 4px;
    color: #fff;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    .left {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .top {
      font-size: 16px;
    }
    .bottom {
      font-size: 14px;
      margin-top: 16px;
    }
    .right {
      padding-left: 10px;
      box-sizing: border-box;
    }
  }
}
</style>