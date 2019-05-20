<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: "App",
  created() {
    document.title = this.$route.meta.title;
  }
};
</script>

<style>
html,body,#app{
  height: 100%;
}
.van-tabs__line {
  background-color: #ff711c;
  height: 2px;
  bottom: 0.56rem;
}
.van-field__control {
  background-color: #fff !important;
}
.van-button--primary {
  background: linear-gradient(
    91deg,
    rgba(250, 166, 51, 1) 0%,
    rgba(255, 70, 10, 1) 100%
  );
  border: 0;
}
</style>
