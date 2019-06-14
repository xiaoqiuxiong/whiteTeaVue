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
        <van-field
          @click="setAddressShow"
          v-model="addressCity"
          right-icon="arrow"
          placeholder="请选择所在省份市区"
        />
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
import { apiAddUserAddress } from "@/request/api";
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
      address: ""
    };
  },
  created() {
    this.columns = [
      {
        values: this.allAddress.province
      },
      {
        values: this.allAddress.citys
      },
      {
        values: this.allAddress.district
      }
    ];
  },
  mounted() {
    let cityData = this.allAddress.citys.filter(item => {
      return item.parent_id == 2;
    });
    this.$refs.addressEdit.setColumnValues(1, cityData);
    let districtData = this.allAddress.district.filter(item => {
      return item.parent_id == 52;
    });
    this.$refs.addressEdit.setColumnValues(2, districtData);
    this.addressShow = false;
    this.$refs.addressEditSheetBox.style.display = "block";
  },

  methods: {
    actionApiAddUserAddress() {
      console.log(this.addressCityArray[2].region_id);
      apiAddUserAddress({
        data: crypto.encrypt(
          JSON.stringify({
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
            this.$router.push({ name: "Address" });
          } else {
            Toast(this.APPNAME + result.msg);
          }
        })
        .catch(err => {
          Toast(this.APPNAME + "网络故障，请刷新重试");
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
      let cityData = this.allAddress.citys.filter(item => {
        return item.parent_id == values[0].region_id;
      });
      picker.setColumnValues(1, cityData);
      let districtData;
      if (
        this.values.length == 0 ||
        this.values[0].region_id != values[0].region_id
      ) {
        districtData = this.allAddress.district.filter(item => {
          return item.parent_id == cityData[0].region_id;
        });
      } else {
        districtData = this.allAddress.district.filter(item => {
          return item.parent_id == values[1].region_id;
        });
      }
      picker.setColumnValues(2, districtData);
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