<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      v-if="$route.query.isUser"
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="$router.push({name: 'User'})"
    />
    <van-nav-bar
      v-if="!$route.query.isUser"
      class="nav-area"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- 地址列表 -->
    <div class="no-list" v-if="!list.length">亲，没有收货地址信息无法购物哦</div>
    <div v-if="list.length" class="address-list">
      <div class="address-item" v-for="(item, index) in list" :key="index">
        <van-swipe-cell :right-width="160">
          <van-cell-group>
            <div v-if="!isSureOrder" class="item-cont" @click="skipAddress(item.address_id)">
              <div class="left">
                <div class="top">
                  {{item.consignee}}&nbsp;&nbsp;&nbsp;{{item.mobile}}
                  <van-image
                    v-if="item.default_address == 1"
                    width="1.2rem"
                    height="0.5rem"
                    :src="defaultAddress"
                  />
                </div>
                <div class="bottom">
                  {{
                  allAddress.province.filter(item1 => {
                  return (item1.region_id == item.province);
                  })[0].region_name
                  }}
                  {{
                  allAddress.citys.filter(item1 => {
                  return (item1.region_id == item.city);
                  })[0].region_name
                  }}
                  {{
                  allAddress.district.filter(item1 => {
                  return (item1.region_id == item.district);
                  })[0].region_name
                  }}
                  {{item.address}}
                </div>
              </div>
              <div class="right">
                <van-icon name="edit" size="20"/>
              </div>
            </div>
            <div
              v-if="isSureOrder"
              class="item-cont"
              @click="$router.push({path: `${fullPath}&address_id=${item.address_id}`})"
            >
              <div class="left">
                <div class="top">
                  {{item.consignee}}&nbsp;&nbsp;&nbsp;{{item.mobile}}
                  <van-image
                    v-if="item.default_address == 1"
                    width="1.2rem"
                    height="0.5rem"
                    :src="defaultAddress"
                  />
                </div>
                <div class="bottom">
                  {{
                  allAddress.province.filter(item1 => {
                  return (item1.region_id == item.province);
                  })[0].region_name
                  }}
                  {{
                  allAddress.citys.filter(item1 => {
                  return (item1.region_id == item.city);
                  })[0].region_name
                  }}
                  {{
                  allAddress.district.filter(item1 => {
                  return (item1.region_id == item.district);
                  })[0].region_name
                  }}
                  {{item.address}}
                </div>
              </div>
              <div class="right">
                <van-icon name="edit" size="20"/>
              </div>
            </div>
          </van-cell-group>
          <div slot="right">
            <span class="right-btn" @click="setDefault(item.address_id)">设为默认</span>
            <span class="right-btn" @click="del(item.address_id)">删 除</span>
          </div>
        </van-swipe-cell>
      </div>
    </div>
    <!-- 增加地址 area -->
    <div class="add-address-area">
      <van-button @click="$router.push({name: 'AddAddress'})" round type="primary">+ 新建收货地址</van-button>
    </div>
  </div>
</template>

<script>
import {
  apiUserAddress,
  apiSetDefaultAddress,
  apiAddUserAddress,
  apiDelUserAddress
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
let isSureOrder1 = false;
let fullPath1 = "";
export default {
  data() {
    return {
      loadingMsg: "",
      list: [],
      defaultAddress: require("@/assets/images/default_address.png"),
      isSureOrder: false,
      fullPath: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    isSureOrder1 = from.name == "SureOrder";
    fullPath1 = from.fullPath;
    next();
  },
  created() {
    this.loadingMsg = Toast.loading({
      duration: 0,
      forbidClick: true,
      loadingType: "spinner",
      message: "loading..."
    });
    apiUserAddress()
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
  mounted() {
    this.isSureOrder = isSureOrder1;
    this.fullPath = fullPath1;
    if (this.fullPath.indexOf("&") == -1) {
      return false;
    }
    if (this.fullPath.indexOf("type") == -1) {
      this.fullPath = this.fullPath.substring(0, this.fullPath.indexOf("&"));
    } else {
      if (this.fullPath.indexOf("address_id") != -1) {
        this.fullPath = this.fullPath.substring(
          0,
          this.find(this.fullPath, "&", 1)
        );
      }
    }
  },
  methods: {
    find(str, cha, num) {
      var x = str.indexOf(cha);
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
      }
      return x;
    },
    skipAddress(id) {
      this.$router.push({ name: "AddressEdit", query: { address_id: id } });
    },
    setDefault(id) {
      this.loadingMsg = Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: "spinner",
        message: "loading..."
      });
      apiSetDefaultAddress({
        data: crypto.encrypt(
          JSON.stringify({
            address_id: id
          })
        )
      })
        .then(result => {
          this.loadingMsg.clear();
          if (result.code == 0) {
            this.$toast("默认收货地址设置成功");
            this.list.filter((item, index) => {
              this.list[index].default_address = 0;
              if (item.address_id == id) {
                this.list[index].default_address = 1;
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
    },
    del(id) {
      this.loadingMsg = Toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: "spinner",
        message: "loading..."
      });
      apiDelUserAddress({
        data: crypto.encrypt(
          JSON.stringify({
            address_id: id
          })
        )
      })
        .then(result => {
          this.loadingMsg.clear();
          if (result.code == 0) {
            this.$toast("删除收货地址成功");
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
    },
    onAdd() {
      this.$toast("新增地址");
    },

    onEdit(item, index) {
      this.$toast("编辑地址:" + index);
    }
  },
  computed: {
    allAddress() {
      return JSON.parse(this.$store.state.allAddress);
    }
  }
};
</script>

<style lang="less" scoped>
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
  padding-bottom: 70px;
}
.no-list {
  margin-top: 20px;
  text-align: center;
  color: #666;
}
</style>