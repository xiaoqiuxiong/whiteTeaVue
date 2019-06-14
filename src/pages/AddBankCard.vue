<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area addaddress"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- 内容 area -->
    <div class="cont-area">
      <van-cell-group>
        <van-field
          v-model="card_num"
          clearable
          type="number"
          label="银行卡账号："
          placeholder="请输入银行卡卡号"
        />
        <van-field v-model="name" clearable label="持卡人姓名：" placeholder="请输入持卡人姓名"/>
        <van-field v-model="id_card" type="number" clearable label="身份证号码：" placeholder="请输入身份证号码"/>
        <van-field v-model="phone" clearable type="tel" label="手机号码：" placeholder="请输入银行预留手机号码"/>
        <!-- <van-field v-model="sms" center clearable label="手机验证码：" placeholder="请输入手机验证码">
          <van-button slot="button" size="small" type="primary" round>获取验证码</van-button>
        </van-field>-->
      </van-cell-group>
      <div class="btn-box">
        <van-button type="primary" round @click="actionData">提 交</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiUserAddBankCard } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      card_num: "",
      name: "",
      id_card: "",
      phone: "",
      sms: ""
    };
  },
  methods: {
    actionData() {
      // 判断数据
      if (this.card_num == "") {
        Toast(this.APPNAME+"请正确输入银行卡号");
        return false;
      }
      if (!/^[\u4e00-\u9fa5]+$/.test(this.name)) {
        Toast(this.APPNAME+"请正确输入姓名");
        return false;
      }
      if (!/^[0-9a-zA-Z]+$/.test(this.id_card) || this.id_card.length != 18) {
        Toast(this.APPNAME+"请正确输入身份证号");
        return false;
      }
      if (this.phone.length != 11) {
        Toast(this.APPNAME+"请正确输入手机号码");
        return false;
      }
      apiUserAddBankCard({
        data: crypto.encrypt(
          JSON.stringify({
            card_num: this.card_num,
            name: this.name,
            id_card: this.id_card,
            phone: this.phone
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            Toast({
              message: this.APPNAME+"添加银行卡成功",
              type: 'success',
              duration: 1500,
              onClose: ()=>{
                this.$router.push({ name: "BankCard" });
              }
            });
            
          } else {
            Toast(this.APPNAME+result.msg);
          }
        })
        .catch(err => {
          Toast(this.APPNAME+"网络故障，请刷新重试");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.cont-area {
  margin-top: 6px;
  padding: 0 10px;
  background-color: #fff;
  .van-cell {
    padding-top: 20px;
  }
  .btn-box {
    width: 80%;
    margin: 0 auto;
    padding: 20px 0;
    button {
      width: 100%;
    }
  }
}
</style>