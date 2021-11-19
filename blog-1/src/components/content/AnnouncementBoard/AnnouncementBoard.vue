<template>
  <div class="announcement-board">
    <h4 class="title">
      <svg class="icon" ><use xlink:href="#iconhelanfengche"></use></svg>
      公告栏
      <svg class="icon" ><use xlink:href="#iconhelanfengche"></use></svg>
    </h4>
    <div class="announcement-content-wrap">
      <div v-html="pageUser.announcement">
      </div>
    </div>
    <div class="boadr-footer">
      <svg class="icon" v-for="i in 13">
        <use xlink:href="#iconhuawen2"></use>
      </svg>
    </div>
  </div>
</template>

<script>

  import {mapGetters} from 'vuex'

  export default {
    name: "AnnouncementBoard",
    computed:{
      ...mapGetters([
        "pageUser"
      ])
    }
  }
</script>

<style lang="scss" scoped>
.announcement-board {
  background-color: rgba(255,255,255,var(--global-opacity,1));
  padding: 0 5px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 5px 1px gainsboro inset;
  .title {
    user-select: none;
    text-align: center;
    color: transparent;
    font-size: 1.5rem;
    padding: 5px 0 5px;
    border-bottom:4px solid rgba(93,238,238,var(--global-opacity,1));
    -webkit-background-clip: text;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-shadow: 0 1px 1px 1px #e7e4e4 ;
    background-image: linear-gradient(to right,rgba(3,98,213,1) 0%, rgba(127,248,89,1) 51%, rgba(21,197,12,1) 75%);
    /*background-image: linear-gradient(to right,red, orange, yellow, green, blue, indigo, violet);*/
  }
  .announcement-content-wrap {
    flex: 1 1 auto;
    flex-basis: 260px;
    border-radius: 15px;
    background-clip: padding-box;
    margin-top: 5px;
    padding: 4px;
    background-image: linear-gradient(to right, rgba(90,158,241,var(--global-opacity,1)) 0%, rgba(8,195,212,var(--global-opacity,1)) 51%, rgba(150, 116, 232,var(--global-opacity,1)) 75%);
    display: flex;
    > div {
      padding: 5px 8px;
      width: 100%;
      color: #af9e2a;
      border-radius: 15px;
      background-color: rgba(255, 254, 252, var(--global-opacity,1));
      padding-bottom: 50px;
    }
  }
  .boadr-footer {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
