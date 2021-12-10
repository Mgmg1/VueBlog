<template>
  <div class="user-info">
    <div class="user-head" >
      <img :src="pageUser.headImgUrl" alt=""/>
    </div>
    <div class="user-name">{{ pageUser.userName }}</div>
    <div class="user-note-info">
      <div @click="displayDailyBlog" class="dailyblog-count">
        日常
        <div class="record-num">{{ dailyBlogCount }}</div>
      </div>
      <div @click="displayStudyNote" class="studyblog-count">
        笔记
        <div class="record-num">{{ studyBlogCount }}</div>
      </div>
      <div class="browse-count">
        浏览
        <div class="record-num">0</div>
      </div>
    </div>
    <div class="contacts">
      <div title="github">
        <a target="_blank" :href="pageUser.githubUrl">
          <svg class="icon" ><use xlink:href="#icongithub"></use></svg>
        </a>
      </div>
      <div :title="pageUser.email"><svg class="icon" ><use xlink:href="#iconyouxiang"></use></svg></div>
      <div title="bilibili">
        <a target="_blank" :href="pageUser.bilibiliUrl">
          <svg class="icon" ><use xlink:href="#iconbilibili-on"></use></svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex'
  import {getBlogInfos} from "../../../network/blogpage";
  import * as types from  '@/store/mutations-type'

  export default {
    name: "UserInfo",
    data(){
      return {
        userName:'二刺螈'
      }
    },
    methods:{
      displayDailyBlog(){
        getBlogInfos('notetype',this.pageUser.userId,'1').then(res=>{
          if (res.data.code === 200 && res.data.data ) {
            this.$store.commit(types.SET_BLOGS_INFO,res.data.data)
            if(this.$route.fullPath.match(/\/content\//)) {
              this.$router.back()
            }
          }
        })
      },
      displayStudyNote(){
        getBlogInfos('notetype',this.pageUser.userId,'2').then(res=>{
          if (res.data.code === 200 && res.data.data ) {
            this.$store.commit(types.SET_BLOGS_INFO,res.data.data)
            if(this.$route.fullPath.match(/\/content\//)) {
              this.$router.back()
            }
          }
        })
      },

    },
    computed:{
      ...mapGetters([
        'blogsCountInfo',
        'pageUser'
      ]),
      dailyBlogCount(){
        if(this.blogsCountInfo && this.blogsCountInfo.noteTypeInfo){
          for (const noteTypeInfo of this.blogsCountInfo.noteTypeInfo) {
            if( noteTypeInfo.noteType === '1'){
              return noteTypeInfo.noteTypeCount ;
            }
          }
        }
        return 0
      },
      studyBlogCount(){
        if(this.blogsCountInfo && this.blogsCountInfo.noteTypeInfo) {
          for (const noteTypeInfo of this.blogsCountInfo.noteTypeInfo) {
            if( noteTypeInfo.noteType === '2'){
              return noteTypeInfo.noteTypeCount ;
            }
          }
          return 0
        }
      }
    },
    created(){

    }
  }
</script>

<style lang="scss" scoped>
.user-info{
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  background-color: rgba(245,245,245,var(--global-opacity,1));
  overflow: hidden;
  border-radius: 12px;
  text-align: center;
  .user-head {
    position: relative;
    height: 130px;
    text-align: center;
    background: {
      image: url("http://r.photo.store.qq.com/psc?/V53RZdap02olQB1qJRDI0kxlEl0h2BPA/45NBuzDIW489QBoVep5mcYwqj2*5rcwhmxP.3kfqBwNfU6qTlNiO.1ySKOwMhpfdKAgjIn7xgu02GQ1kRjqbef63OGlZKbwVIkL3rsdtAeE!/r");
      position: center;
      repeat: no-repeat;
      size: cover;
    }
    box-shadow: 0 2px 10px rgb(150,150,150);
    img {
      position: absolute;
      bottom: 0;
      box-shadow: -1px -1px 3px 1px rgb(225,255,255);
      transform: translate(-50%,50%);
      width: 100px;
      height: 100px;
      border-radius: 50%;
      transition: all .3s;
      &:hover {
        transform: translate(-50%,50%) scale(1.2) rotate(1turn);
      }
    }
  }

  .user-name{
    margin-top: 70px;
    font-size: 20px;
  }

  .user-note-info {
    margin-top: 15px;
    display: flex;
    justify-content: space-around;
    font-size: 20px;
    .record-num {
      font-weight: bold;
    }
    .dailyblog-count,.studyblog-count {
      cursor: pointer;
      user-select: none;
    }
  }

  .contacts{
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 45px;
      width: 45px;
      border-radius: 50%;
      background-color: #eef2f3;
      cursor: pointer;
    }
    a {
      user-select: none;
      text-decoration: none;
      outline: none;
    }
    svg {
      height: 35px;
      width: 35px;
    }
  }
}
</style>
