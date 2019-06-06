<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <van-cell title="用户头像" is-link class="upload-avatar-box">
      <van-uploader id="upload" :after-read="onRead">
        <van-image class="upload-avatar" fit="cover" :src="userInfo.headimg"/>
      </van-uploader>
    </van-cell>
    <van-cell title="用户昵称" is-link :value="userInfo.user_name" @click="showDialog = true"></van-cell>
    <van-cell v-if="JSON.stringify(userInfo) != '{}'" @click="show=true" title="出生日期" is-link :value="dateToString(userInfo.birthday)"></van-cell>
    <van-cell
      v-show="item.value == userInfo.sex"
      v-for="(item, index) in actions"
      :key="index"
      @click="showSex = true"
      title="性别"
      is-link
      :value="item.name"
    />
    <van-cell @click="$router.push({name: 'Address'})" title="我的收货地址" is-link/>
    <van-action-sheet v-model="show">
      <van-datetime-picker
        v-model="userInfo.birthday"
        type="date"
        @confirm="confirmTime"
        @cancel="cancelTime"
      />
    </van-action-sheet>
    <van-dialog
      v-model="showDialog"
      title="用户昵称修改"
      show-cancel-button
      confirm-button-color="#fe672c"
      :before-close="beforeClose"
    >
      <div class="dialog-box">
        <van-cell-group>
          <van-field v-model="userInfo.user_name" placeholder="请输入用户昵称"/>
        </van-cell-group>
        <van-cell class="tips">4-20个字符，可由中英文、数字、“-”“_”组成。</van-cell>
      </div>
    </van-dialog>
    <van-action-sheet
      v-model="showSex"
      :actions="actions"
      cancel-text="取消"
      @select="onSelectSex"
      @cancel="onCancelSex"
    />
  </div>
</template>

<script>
import axios from "axios";
import {
  apiUserIndex,
  apiGetUploadToken,
  apiUploadQiniuHeadImage,
  apiUpdateUserInfo
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast, CellGroup } from "vant";
export default {
  data() {
    return {
      showDialog: false,
      userInfo: {},
      key: "",
      file: "",
      param: new FormData(),
      show: false,
      showSex: false,
      actions: [
        { name: "男", value: 1 },
        { name: "女", value: 2 },
        { name: "保密", value: 0 }
      ],
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
            this.userInfo = result.data.user_info;
            this.userInfo.birthday = new Date(
              this.userInfo.birthday.replace(/-/g, "/")
            );
          }
        })
        .catch(err => {
          Toast("网络故障，请刷新重试");
        });
    },
    onSelectSex(val) {
      this.userInfo.sex = val.value;
      this.actionUpdateUserInfo();
    },
    onCancelSex() {
      this.showSex = false;
    },
    beforeClose(action, done) {
      if (action == "confirm") {
        done(false);
        this.actionUpdateUserInfo("user_name");
      } else {
        done(true);
      }
    },
    // 修改用户资料
    actionUpdateUserInfo(type) {
      let regu = /^[\u4e00-\u9fa50-9a-zA-Z_\-]{2,20}$/;
      let params = {};
      if (type == "user_name") {
        if (!regu.test(this.userInfo.user_name)) {
          Toast("请输入4-20个字符");
          return false;
        }
      }
      params = {
        user_name: this.userInfo.user_name,
        year: this.userInfo.birthday.getFullYear().toString(),
        month: (this.userInfo.birthday.getMonth() + 1).toString(),
        day: this.userInfo.birthday.getDate().toString(),
        sex: this.userInfo.sex
      };
      apiUpdateUserInfo({
        data: crypto.encrypt(JSON.stringify(params))
      })
        .then(result => {
          if (result.code != 0) {
            Toast.fail(result.msg);
            return false;
          }
          if (type == "user_name") {
            this.showDialog = false;
          }
          this.showSex = false;
        })
        .catch(err => {
          Toast.fail("修改信息失败，请刷新重试");
        });
    },
    dateToString(date) {
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      var dateTime = year + "-" + month + "-" + day;
      return dateTime;
    },
    confirmTime(val) {
      this.show = false;
      this.actionUpdateUserInfo("time");
    },
    cancelTime(val) {
      this.show = false;
    },
    getToken() {
      apiGetUploadToken({
        data: crypto.encrypt(JSON.stringify({ tag: "gongxin" }))
      })
        .then(result => {
          if (result.code == 0) {
            this.key = crypto.decrypt(result.data);
            this.actionHeadimg();
          }
        })
        .catch(err => {
          Toast.fail("上传头像失败，请刷新重试");
        });
    },
    actionHeadimg() {
      this.param.append("file", this.file.file, this.file.file.name); //通过append向form对象添加数据
      this.param.append("token", this.key); //通过append向form对象添加数据
      axios
        .post("http://upload.qiniu.com/", this.param)
        .then(response => {
          apiUploadQiniuHeadImage({
            data: crypto.encrypt(JSON.stringify({ key: response.data.key }))
          })
            .then(result => {
              if (result.code == 0) {
                this.userInfo.headimg = crypto.decrypt(result.data);
                this.key = "";
                this.file = "";
                this.param = new FormData();
              } else {
                Toast.error(result.msg);
              }
            })
            .catch(err => {
              Toast.fail("上传头像失败，请刷新重试");
            });
        })
        .catch(error => {
          Toast.fail("上传头像失败，请刷新重试");
        });
    },
    onRead(file) {
      this.file = file;
      this.getToken();
    }
  },
  computed: {}
};
</script>

<style lang="less" scoped>
.van-uploader__input{
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
}
.dialog-box {
  padding: 20px;
  box-sizing: border-box;
  .van-field {
    box-sizing: border-box;
    background-color: #f5f5f5;
  }
  .tips {
    padding-left: 0;
    .van-cell__value--alone {
      font-size: 12px;
      color: #666;
    }
  }
}
.van-cell {
  align-items: center;
}
.upload-avatar-box {
  .van-cell__value {
    height: 60px;
  }
}
.upload-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}
</style>