<template>
  <div class="blog-footer">
    <a target="_blank" href="https://beian.miit.gov.cn"> 互联网ICP备案: 粤ICP备2021025975号-1 </a>
  </div>
</template>

<script>
  export default {
    name: "BlogFooter"
  }
</script>

<style lang="scss" scoped>
.blog-footer {
  margin-top: 40px;
  height: 150px;
  width: 100%;
  > a {
    color: #c9a8ef;
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    text-decoration: none;
    display: block;
    margin: auto;
    outline: none;
  }
}
</style>
