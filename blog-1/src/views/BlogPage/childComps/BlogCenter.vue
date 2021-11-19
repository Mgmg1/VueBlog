<template>
  <div class="blog-center">
    <blog-center-header/>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
  import BlogCenterHeader from "../../../components/content/BlogCenterHeader/BlogCenterHeader";
  import BlogBox from "../../../components/content/BlobBox/BlogBox";
  import TagsBoard from "../../../components/content/TagsBoard/TagsBoard";
  export default {
    name: "BlogContent",
    components: {
      TagsBoard,
      BlogBox,
      BlogCenterHeader
    },
    methods:{
      blogBoxClick(){
        this.push('/page/content')
      }
    }
  }
</script>

<style lang="scss" scoped>
.blog-center{
  @media all and (max-width: 900px) {
    .blog-center {
      margin-right: 0 !important;
    }
  }
  margin-right: 20px;
}
</style>
