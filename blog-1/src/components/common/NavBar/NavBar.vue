<template>
  <div class="nav-bar">
    <div class="left"><slot name="left"></slot></div>
    <div class="center"><slot name="center"></slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
  export default {
    name: "NavBar"
  }
</script>

<style lang="scss" scoped>
.nav-bar{
  display: flex;
  .left {
    height: 100%;
  }
  .right {
    height: 100%;
  }
  .center {
    flex: 1 1 auto;
    height: 100%;
  }
}
</style>
