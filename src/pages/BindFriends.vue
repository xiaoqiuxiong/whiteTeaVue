<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar class="nav-area" fixed :title="$route.meta.title"/>
  </div>
</template>

<script>
import { apiBindUser } from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      parent_id: "",
      key: ""
    };
  },
  created() {
    let info = this.getUrlParams(location.href);
    if (info.parent_id == "") {
      this.$router.replace({ name: "Home" });
    }
    this.parent_id = parseFloat(info.parent_id);
    this.key = info.key || "";
    console.log(info);
    apiBindUser({
      data: crypto.encrypt(
        JSON.stringify({
          parent_id: this.parent_id,
          key: this.key
        })
      )
    })
      .then(result => {
        if (result.code == 0) {
          Toast.success({
            mask: true,
            message: '绑定成功',
            onClose: () => {
              this.$router.replace({ name: "User" });
            }
          });
          
        } else {
          Toast({
            mask: true,
            message: result.msg,
            onClose: () => {
              this.$router.replace({ name: "Home" });
            }
          });
        }
      })
      .catch(err => {
        Toast({
          mask: true,
          message: this.ERRORNETWORK,
          onClose: () => {
            this.$router.replace({ name: "Home" });
          }
        });
      });
  },
  methods: {
    getUrlParams(search) {
      const queryList = search.split("?")[1].split("&");
      let result = {};
      search &&
        queryList.map(item => {
          let keyValue = item.split("=");
          result[keyValue[0]] = decodeURIComponent(keyValue[1]);
          if (keyValue[0] == "timestamp") {
            result[keyValue[0]] = decodeURIComponent(keyValue[1]).replace(
              "+",
              " "
            );
          }
        });
      return result;
    }
  }
};
</script>

<style lang="less" scoped>
</style>