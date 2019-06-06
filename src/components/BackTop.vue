<template>
  <div>
    <div @click="backTop" class="back-top-box" ref="backTop">
      <van-image class="back-top" width="1.2rem" height="1.2rem" fit="contain" :src="img"/>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  data() {
    return {
      img: require("@/assets/images/back_top.png")
    };
  },
  methods: {
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (this.$refs.backTop) {
        if (scrollTop > 1600) {
          this.$refs.backTop.style.display = "block";
        } else {
          this.$refs.backTop.style.display = "none";
        }
      }
    },
    backTop() {
      window.scrollTo(0, 0);
    }
  }
};
</script>

<style lang="less" scoped>
.back-top-box {
  display: none;
  position: fixed;
  bottom: 40px;
  right: 20px;
}
.back-top {
  opacity: 0.6;
}
</style>