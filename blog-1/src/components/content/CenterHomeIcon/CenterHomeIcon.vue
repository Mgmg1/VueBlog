<template>
  <div class="center-home-icon">
    <div class="home-body">
      <svg class="icon" style="margin-right: -10px">
        <use xlink:href="#iconhua"></use>
      </svg>
      <svg class="icon home-icon" >
        <use xlink:href="#iconHome"></use>
      </svg>
      <svg class="icon " style="margin-left: -10px">
        <use xlink:href="#iconhua"></use>
      </svg>
    </div>
    <div class="home-footer" >
      <svg class="icon" >
        <use xlink:href="#iconhuawen2"></use>
      </svg>
      <span>首页</span>
      <svg class="icon" >
        <use xlink:href="#iconhuawen2"></use>
      </svg>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CenterHomeIcon"
  }
</script>

<style lang="scss" scoped>
.center-home-icon {
  display: flex;
  flex-direction: column;
  height: 90px;
  user-select: none;
  justify-content: center;
  .home-body {
    white-space: nowrap;
  }
  .home-icon {
    font-size: 4em;
  }
  .home-footer {
    display: flex;
    justify-content: space-evenly;
  }
}

</style>
