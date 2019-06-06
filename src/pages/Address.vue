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
      <div class="address-item" v-for="(item, index) in list" :key="index" >
        <van-swipe-cell :right-width="160">
          <van-cell-group>
            <div class="item-cont" @click="skipAddress(item.address_id)">
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
export default {
  data() {
    return {
      list: [],
      defaultAddress: require("@/assets/images/default_address.png")
    };
  },
  created() {
    apiUserAddress()
      .then(result => {
        if (result.code == 0) {
          this.list = JSON.parse(crypto.decrypt(result.data));
        } else {
          Toast(result.msg);
        }
      })
      .catch(err => {
        Toast("网络故障，请刷新重试");
      });
  },

  methods: {
    skipAddress(id){
      this.$router.push({name: 'AddressEdit',query: {address_id: id}})
    },
    setDefault(id) {
      apiSetDefaultAddress({
        data: crypto.encrypt(
          JSON.stringify({
            address_id: id
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            Toast.success("默认收货地址设置成功");
            this.list.filter((item, index) => {
              this.list[index].default_address = 0;
              if (item.address_id == id) {
                this.list[index].default_address = 1;
              }
            });
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast("网络故障，请刷新重试");
        });
    },
    del(id) {
      apiDelUserAddress({
        data: crypto.encrypt(
          JSON.stringify({
            address_id: id
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            Toast.success("删除收货地址成功");
            this.list.filter((item, index) => {
              if (item.address_id == id) {
                this.list.splice(index,1);
              }
            });
          } else {
            Toast(result.msg);
          }
        })
        .catch(err => {
          Toast("网络故障，请刷新重试");
        });
    },
    onAdd() {
      Toast("新增地址");
    },

    onEdit(item, index) {
      Toast("编辑地址:" + index);
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
</style>