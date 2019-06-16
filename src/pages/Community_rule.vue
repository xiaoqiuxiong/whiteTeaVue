<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- 内容 area -->
    <div class="cont-area">
      <div class="cont-title">
        <div class="line"></div>
        <span v-if="user_rank == 6">超级社区规则</span>
        <span v-else>社区规则</span>
      </div>
      <div v-if="user_rank == 6" class="cont">
        一、购买奖励:
        <br>购买商品1000元、获得1000等值“积贝”赠送，获得每天5‰算力用于挖掘积贝;
        <br>购买商品5000元、获得5000等值“积贝”赠送，获得每天7‰算力用于挖掘积贝;
        <br>购买商品10000元、获得10000等值“积贝”赠送，获得每天10‰算力用于挖掘积贝;
        <br>
        <br>二、邀请奖励:
        <br>直接邀请好友获得50%好友购买金额的等值积贝奖励；间接邀请好友获得25%好友购买金额的等值积贝奖励（二级以上间接邀请不获得奖励）;
        <br>
        <br>三、超级社区奖励:
        <br>享受超级社区的最高算力标准;
        <br>享受社区所有会员购买业绩的5%积贝收益;
        <br>享受社区所有会员兑换商品服务的3%积贝收益;
        <br>业绩达到500万以、1000万以上时，奖励不同比例的项目流通分红股;
        <br>享有公司赋能其他项目的优先合作权利;
        <br>
        <br>四、积贝的使用:
        <br>1、用于购买商品抵现：在购买商品时可以选择“使用积贝支付”，即可以1积贝=1元的比例，抵扣现金进行支付;
        <br>2、积贝对冲邀请：对冲机制下邀请好友购买商品，好友首次下单购买成功后，将会有该订单金额50%的对冲现金发放到您的账户，同时将会扣除您同等价值额度数量的可用积贝;
        <br>3、积贝兑换：您可以在“个人-积贝” 页面使用积贝进行相关商品或内容的兑换，包括：商品兑换、游戏充值兑换、区块链培训课程兑换、“企业崛起”课程兑换、系统内与公司合作企业产品的兑换、公司股权兑换、数字资产兑换等。
        <br>
      </div>
      <div class="cont" v-else>
        一、购买奖励
        <br>购买商品1000元、获得1000等值“积贝”赠送，获得每天5‰算力用于挖掘积贝
        <br>购买商品5000元、获得5000等值“积贝”赠送，获得每天7‰算力用于挖掘积贝
        <br>购买商品10000元、获得10000等值“积贝”赠送，获得每天10‰算力用于挖掘积贝
        <br>
        <br>二、邀请奖励
        <br>直接邀请好友获得50%好友购买金额的等值积贝奖励；间接邀请好友获得25%好友购买金额的等值积贝奖励（二级以上间接邀请不获得奖励）
        <br>
        <br>三、积贝的使用
        <br>1、用于购买商品抵现：在购买商品时可以选择“使用积贝支付”，即可以1积贝=1元的比例，抵扣现金进行支付
        <br>2、积贝对冲邀请：对冲机制下邀请好友购买商品，好友首次下单购买成功后，将会有该订单金额50%的对冲现金发放到您的账户，同时将会扣除您同等价值额度数量的可用积贝
        <br>3、积贝兑换：您可以在“个人-积贝” 页面使用积贝进行相关商品或内容的兑换，包括：商品兑换、游戏充值兑换、区块链培训课程兑换、“企业崛起”课程兑换、系统内与公司合作企业产品的兑换、公司股权兑换、数字资产兑换等
      </div>
    </div>
  </div>
</template>

<script>
import { apiUserIndex } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      user_rank: -1
    };
  },
  created() {
    this.initUserInfo();
  },
  methods: {
    initUserInfo() {
      apiUserIndex()
        .then(result => {
          if (result.code == 0) {
            this.user_rank = result.data.user_info.user_rank;
          }
        })
        .catch(err => {
          this.$toast(this.ERRORNETWORK);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.cont-area {
  margin-top: 6px;
  background-color: #fff;
  padding: 0 20px;
  padding: 20px;
  .cont-title {
    height: 46px;
    line-height: 46px;
    display: flex;
    align-items: center;
    font-size: 14px;
    .line {
      width: 2px;
      height: 14px;
      background-color: #ff7b14;
      margin-right: 6px;
    }
  }
  .cont {
    font-size: 12px;
    line-height: 1.6;
  }
}
</style>