<template>
  <div class="blog-left-side">
    <user-info/>
    <music-box />
  </div>
</template>

<script>
  import UserInfo from "../../../components/content/UserInfo/UserInfo";
  import MusicBox from "../../../components/content/MusicBox/MusicBox";
  export default {
    name: "BlogLeftSide",
    components: {
      MusicBox,
      UserInfo
    },
    methods:{
    }
  }
</script>

<style lang="scss" scoped>
.blog-left-side {
  margin-right: 20px;
}
</style>
