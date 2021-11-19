<template>
  <div class="blog-right-side">
    <AnnouncementBoard class="anno-board"/>
    <tags-board />
  </div>
</template>

<script>
  import AnnouncementBoard from "../../../components/content/AnnouncementBoard/AnnouncementBoard";
  import TagsBoard from "../../../components/content/TagsBoard/TagsBoard";
  export default {
    name: "BlogRightSide",
    components: {TagsBoard, AnnouncementBoard}
  }
</script>

<style lang="scss" scoped>
.blog-right-side {
  .anno-board {
    margin-bottom: 20px;
  }
}
</style>
