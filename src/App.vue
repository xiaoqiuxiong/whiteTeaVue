<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    this.checkToken();
    document.title = this.$route.meta.title;
  },
  methods: {
    checkToken() {
      // 判断缓存是否有token，如果没有就跳到登录页面
      if (this.$store.state.token) {
        if (this.$route.name == "Login" || this.$route.name == "Register") {
          this.$router.push({ name: "Home" });
        }
      } else {
        if (this.$route.name != "Login" || this.$route.name != "Register") {
          this.$router.push({ name: "Login" });
        }
      }
    }
  },
  watch: {
    $route(to, from) {
      document.title = this.$route.meta.title;
    }
  }
};
</script>

<style lang="less">
#app {
  font-size: 0.37333rem;
}
html,
body,
#app {
  height: 100%;
  color: #323233;
  background-color: #f2f3f5;
  font-family: "PingFang SC", Helvetica, "STHeiti STXihei", "Microsoft YaHei",
    Tohoma, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.van-tabs__line {
  background-color: #ff711c;
  height: 2px;
  bottom: 0.56rem;
}
.van-button--primary {
  background: linear-gradient(
    91deg,
    rgba(250, 166, 51, 1) 0%,
    rgba(255, 70, 10, 1) 100%
  );
  border: 0;
}
.van-nav-bar .van-icon {
  color: #333;
  font-size: 0.6rem;
}
.home-swipe-area {
  .van-swipe__indicator {
    height: 2px;
    width: 12px;
  }
  .van-swipe__indicator--active {
    background-color: #fff;
  }
}
</style>
