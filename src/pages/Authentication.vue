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
    <div class="cont-area" v-if="authenticationState == 0 || authenticationState == 3">
      <div v-if="authenticationState == 3" class="un-title">温馨提示：对不起，您的实名认证没有通过，请重新上传！</div>
      <van-cell-group>
        <van-field v-model="real_name" required clearable label="真实姓名：" placeholder/>
        <van-field v-model="id_card" clearable label="身份证号码：" placeholder required/>
        <van-field label-width="200px" required label="身份证正面照：" disabled/>
        <van-uploader id="upload" :after-read="onRead1">
          <van-image class="upload-avatar" fit="cover" :src="img1"/>
        </van-uploader>
        <van-field label-width="200px" required label="身份证正反照：" disabled/>
        <van-uploader id="upload" :after-read="onRead2">
          <van-image class="upload-avatar" fit="cover" :src="img2"/>
        </van-uploader>
      </van-cell-group>
      <div class="btn-box">
        <van-button type="primary" round @click="actionData">提 交</van-button>
      </div>
    </div>
    <!-- 实名认证通过 area -->
    <div v-else-if="authenticationState == 1" class="has-authentication-area">
      <van-cell-group>
        <van-cell class="has-authentication-title" title="已认证信息"/>
        <van-cell v-if="userInfo.real_name" title="真实姓名" :value="formatStar(userInfo.real_name)"/>
        <van-cell v-if="userInfo.card" title="身份证号码" :value="formatStar(userInfo.card)"/>
        <van-cell title="身份证照片" value="已上传"/>
      </van-cell-group>
    </div>
    <!-- 正在实名认证 area -->
    <div v-else-if="authenticationState == 2" class="in-authentication-area">
      <div>您已申请实名认证，请等待管理员的审核</div>
      <div>
        <van-button round type="primary" @click="$router.push({name: 'User'})">返回个人中心</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  apiGetUploadToken,
  apiUserQiniuKYC,
  apiUserIndex
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, CellGroup } from "vant";
export default {
  data() {
    return {
      real_name: "",
      id_card: "",
      key1: "",
      file1: "",
      key2: "",
      file2: "",
      param: new FormData(),
      img1: require("@/assets/images/idcard1.png"),
      img2: require("@/assets/images/idcard2.png"),
      authenticationState: -1,
      userInfo: {}
    };
  },
  created() {
    this.initUserInfo();
  },
  methods: {
    formatStar(name) {
      let newStr;
      if (name.length === 2) {
        newStr = name.substr(0, 1) + "*";
      } else if (name.length > 2) {
        let char = "";
        for (let i = 0, len = name.length - 2; i < len; i++) {
          char += "*";
        }
        newStr = name.substr(0, 1) + char + name.substr(-1, 1);
      } else {
        newStr = name;
      }

      return newStr;
    },
    initUserInfo() {
      apiUserIndex()
        .then(result => {
          if (result.code == 0) {
            this.authenticationState = result.data.user_info.status;
            this.userInfo = result.data.user_info;
          }
        })
        .catch(err => {
          Toast("网络故障，请刷新重试");
        });
    },
    actionData() {
      // 判断数据
      if (!/^[\u4e00-\u9fa5]+$/.test(this.real_name)) {
        Toast("请正确输入正式姓名");
        return false;
      }
      if (!/^[0-9a-zA-Z]+$/.test(this.id_card) || this.id_card.length != 18) {
        Toast("请正确输入身份证号码");
        return false;
      }
      if (this.key1 == "") {
        Toast("请上传身份证正面照");
        return false;
      }
      if (this.key2 == "") {
        Toast("请上传身份证反面照");
        return false;
      }
      apiUserQiniuKYC({
        data: crypto.encrypt(
          JSON.stringify({
            real_name: this.real_name,
            id_card: this.id_card,
            keys: [this.key1, this.key2]
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            this.authenticationState = 2;
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast("网络故障，请刷新重试");
        });
    },
    onRead1(file) {
      this.file1 = file;
      this.getToken(1);
      this.img1 = file.content;
    },
    onRead2(file) {
      this.file2 = file;
      this.getToken(2);
      this.img2 = file.content;
    },
    getToken(type) {
      apiGetUploadToken({
        data: crypto.encrypt(JSON.stringify({ tag: "gongxin" }))
      })
        .then(result => {
          if (result.code == 0) {
            if (type == 1) {
              this.key1 = crypto.decrypt(result.data);
              this.actionHeadimg(1, this.key1, this.file1);
            } else {
              this.key2 = crypto.decrypt(result.data);
              this.actionHeadimg(2, this.key2, this.file2);
            }
          }
        })
        .catch(err => {
          Toast.fail("上传身份证照片失败，请刷新重试");
        });
    },
    actionHeadimg(type, keyval, fileval) {
      this.param.append("file", fileval.file, fileval.file.name); //通过append向form对象添加数据
      this.param.append("token", keyval); //通过append向form对象添加数据
      axios
        .post("http://upload.qiniu.com/", this.param)
        .then(response => {
          if (type == 1) {
            this.key1 = response.data.key;
          } else {
            this.key2 = response.data.key;
          }
        })
        .catch(error => {
          Toast.fail("上传身份证照片失败，请刷新重试");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.has-authentication-title {
  background-color: #f5f5f5;
  font-size: 12px;
  color: #666;
}
.un-title {
  line-height: 40px;
  text-align: center;
  color: #f44;
  font-size: 12px;
}
.in-authentication-area {
  padding-top: 110px;
  text-align: center;
  font-size: 16px;
  div:last-child {
    width: 80%;
    margin: 0 auto;
    margin-top: 40px;
    button {
      width: 100%;
    }
  }
}
.cont-area {
  margin-top: 6px;
  padding: 0 10px;
  background-color: #fff;
  .van-cell {
    padding-top: 20px;
  }
  .red-star {
    position: absolute;
    left: -0.18667rem;
    color: #f44;
    font-size: 0.37333rem;
    z-index: 1;
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