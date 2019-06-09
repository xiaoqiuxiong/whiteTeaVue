<template>
  <div>
    <!-- menu -->
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      actions: [
        { name: "首页", pathName: "Home" },
        { name: "社区中心", pathName: "Community" },
        { name: "个人中心", pathName: "User" }
      ]
    };
  },
  methods: {
    onSelect(item) {
      this.$router.push({ name: item.pathName });
    },
    isShow(flag){
        this.show = flag
    }
  }
};
</script>

<style lang="less" scoped>
</style>