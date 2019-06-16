<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="nav-area addaddress"
      :title="$route.meta.title"
      left-arrow
      @click-left="returnPrePage"
    />
    <!-- 地址增加内容 area -->
    <div class="add-address-cont-area">
      <van-cell-group>
        <van-field v-model="consignee" clearable placeholder="收货人"/>
        <van-field v-model="mobile" type="tel" placeholder="手机号"/>
        <van-field v-model="addressCity" right-icon="arrow" placeholder="请选择所在省份市区"/>
        <div @click="setAddressShow" class="address-box"></div>
        <van-field
          v-model="address"
          type="textarea"
          placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元等"
          rows="2"
          autosize
        />
      </van-cell-group>
      <div ref="addressEditSheetBox" class="actionAddress-box">
        <van-action-sheet v-model="addressShow">
          <van-picker
            id="addressEdit"
            ref="addressEdit"
            show-toolbar
            value-key="region_name"
            :columns="columns"
            @change="onChange"
            @cancel="onCancel"
            @confirm="onConfirm"
          />
        </van-action-sheet>
      </div>
    </div>
    <!-- 增加地址 area -->
    <div class="add-address-area">
      <van-button round type="primary" @click="actionApiAddUserAddress">保 存</van-button>
    </div>
  </div>
</template>

<script>
import {
  apiUserAddress,
  apiAddUserAddress,
  apiUpdateRecAddress
} from "@/request/api";
import crypto from "@/cryptoUtil";
import { Toast } from "vant";
export default {
  data() {
    return {
      consignee: "",
      mobile: "",
      columns: [],
      values: [],
      addressShow: true,
      addressCity: "",
      addressCityArray: [],
      country: 0,
      province: 0,
      city: 0,
      district: 0,
      address: "",
      editAddress: {},
      index2id: -1,
      index3id: -1
    };
  },
  created() {
    // 判断是否有传address_id 过来，没有传，跳到地址列表页面，有则继续
    if (!this.$route.query.address_id) this.$router.push({ name: "Address" });
    apiUserAddress()
      .then(result => {
        if (result.code == 0) {
          JSON.parse(crypto.decrypt(result.data)).filter(item => {
            if (item.address_id == this.$route.query.address_id) {
              this.editAddress = item;
              this.consignee = this.editAddress.consignee;
              this.mobile = this.editAddress.mobile;
              this.address = this.editAddress.address;
              let province_region_name,
                city_region_name,
                district_region_name,
                cityData = [],
                districtData = [],
                index1,
                index2,
                index3;
              this.allAddress.province.filter((item, index) => {
                if (item.region_id == this.editAddress.province) {
                  index1 = this.allAddress.province.indexOf(item);
                  province_region_name = item.region_name;
                }
              });
              let item2;
              this.allAddress.citys.filter((item, index) => {
                if (item.region_id == this.editAddress.city) {
                  item2 = item;
                  this.index2id = item.region_id;
                  city_region_name = item.region_name;
                }
                if (item.parent_id == this.editAddress.province) {
                  cityData.push(item);
                }
              });
              index2 = cityData.indexOf(item2);
              let item3;
              this.allAddress.district.filter((item, index) => {
                if (item.region_id == this.editAddress.district) {
                  item3 = item;
                  this.index3id = item.region_id;
                  district_region_name = item.region_name;
                }
                if (item.parent_id == this.editAddress.city) {
                  districtData.push(item);
                }
              });
              index3 = districtData.indexOf(item3);
              this.addressCity = `${province_region_name} ${city_region_name} ${district_region_name}`;
              this.$refs.addressEdit.setColumnValues(1, cityData);
              this.$refs.addressEdit.setColumnValues(2, districtData);
              this.addressShow = false;
              this.$refs.addressEditSheetBox.style.display = "block";
              this.columns = [
                {
                  values: this.allAddress.province,
                  defaultIndex: index1
                },
                {
                  values: this.allAddress.citys.filter(item => {
                    return item.parent_id == this.editAddress.province;
                  }),
                  defaultIndex: index2
                },
                {
                  values: this.allAddress.district.filter(item => {
                    return item.parent_id == this.editAddress.city;
                  }),
                  defaultIndex: index3
                }
              ];
            }
          });
        } else {
          this.$toast(result.msg);
        }
      })
      .catch(err => {
        this.$toast(this.ERRORNETWORK);
      });
  },
  mounted() {},

  methods: {
    actionApiAddUserAddress() {
      apiUpdateRecAddress({
        data: crypto.encrypt(
          JSON.stringify({
            address_id: this.editAddress.address_id,
            consignee: this.consignee,
            country: this.country,
            province: this.addressCityArray[0].region_id,
            city: this.addressCityArray[1].region_id,
            district: this.addressCityArray[2].region_id,
            address: this.address,
            mobile: this.mobile
          })
        )
      })
        .then(result => {
          if (result.code == 0) {
            this.$router.push({ name: "Address", isUser: true });
          } else {
            this.$toast(result.msg);
          }
        })
        .catch(err => {
          this.$toast(this.ERRORNETWORK);
        });
    },
    setAddressShow() {
      this.addressShow = true;
    },
    onConfirm(value, index) {
      this.addressCityArray = value;
      this.addressCity = `${value[0].region_name} ${value[1].region_name} ${
        value[2].region_name
      }`;
      this.addressShow = false;
    },
    onCancel() {
      this.addressShow = false;
    },
    onChange(picker, values) {
      let cityData = [];
      let districtData = [];
      if (this.values.length == 0) {
        if (this.index2id != values[1].region_id) {
          this.allAddress.district.filter(item => {
            if (item.parent_id == values[1].region_id) districtData.push(item);
          });
          picker.setColumnValues(2, districtData);
        } else if (this.index3id != values[2].region_id) {
        } else {
          this.allAddress.citys.filter(item => {
            if (item.parent_id == values[0].region_id) {
              cityData.push(item);
            }
          });
          picker.setColumnValues(1, cityData);
          this.allAddress.district.filter(item => {
            if (item.parent_id == cityData[0].region_id)
              districtData.push(item);
          });
          picker.setColumnValues(2, districtData);
        }
      } else {
        if (this.values[0].region_id != values[0].region_id) {
          this.allAddress.citys.filter(item => {
            if (item.parent_id == values[0].region_id) {
              cityData.push(item);
            }
          });
          picker.setColumnValues(1, cityData);
          this.allAddress.district.filter(item => {
            if (item.parent_id == cityData[0].region_id)
              districtData.push(item);
          });
          picker.setColumnValues(2, districtData);
        }
        if (this.values[1].region_id != values[1].region_id) {
          this.allAddress.district.filter(item => {
            if (item.parent_id == values[1].region_id) districtData.push(item);
          });
          picker.setColumnValues(2, districtData);
        }
      }
      this.values = values;
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
.address-box {
  position: absolute;
  top: 1.17334rem * 2;
  left: 0;
  width: 100%;
  height: 0.26667rem * 2+0.64rem;
  z-index: 1;
}
.actionAddress-box {
  display: none;
}
.add-address-cont-area {
  margin-top: 4px;
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
</style>