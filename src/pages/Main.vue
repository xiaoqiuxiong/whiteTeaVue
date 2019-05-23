<template>
  <div>
    <div class="main-div">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
    <van-tabbar v-model="active" active-color="#F44C16" @change="changeTabbar(active)">
      <van-tabbar-item>
        <span>首页</span>
        <img slot="icon" slot-scope="props" :src="props.active ? icon.active1 : icon.normal1">
      </van-tabbar-item>
      <van-tabbar-item>
        <span>社区中心</span>
        <img slot="icon" slot-scope="props" :src="props.active ? icon.active2 : icon.normal2">
      </van-tabbar-item>
      <van-tabbar-item>
        <span>个人中心</span>
        <img slot="icon" slot-scope="props" :src="props.active ? icon.active3 : icon.normal3">
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>   

<script>
export default {
  data() {
    return {
      active: 0,
      icon: {
        normal1: require("../assets/images/home.png"),
        active1: require("../assets/images/home_active.png"),
        normal2: require("../assets/images/community.png"),
        active2: require("../assets/images/community_active.png"),
        normal3: require("../assets/images/user.png"),
        active3: require("../assets/images/user_active.png")
      }
    };
  },
  created() {
    this.active = this.$route.meta.index;
  },
  methods: {
    changeTabbar(active) {
      switch (active) {
        case 0:
          this.$router.push({ name: "Home" });
          break;
        case 1:
          this.$router.push({ name: "Community" });
          break;
        case 2:
          this.$router.push({ name: "User" });
          break;
        case 3:
          break;
      }
    }
  }
};
</script>

<style scoped>
.main-div{
  padding-bottom: 1.33333rem;
}
</style>