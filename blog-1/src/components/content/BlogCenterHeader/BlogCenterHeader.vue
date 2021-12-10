<template>
  <div class="center-header">
    <nav-bar class="center-bar">
      <div slot="left" style="height: 100%">
        <div class="home">
          <center-home-icon @click.native="homeClick"/>
        </div>
      </div>
      <div slot="center">
        <div class="category-list">
          <span v-for="( item,index ) in blogsCountInfo.categoryInfo"
                @click="itemClick(item)"
                class="category" >
            <a>{{ item.categoryName }}</a>
            <div class="category-count"
                 :style="categoryColorStyle(index)">
              {{ item.categoryCount }}
            </div>
          </span>
        </div>
      </div>
      <div slot="right" class="operation">
        <div class="edit" title="在线编辑" @click="editClick">
          <svg class="icon">
            <use xlink:href="#iconshuxieti"></use>
          </svg>
        </div>
        <div class="upload" title="上传MD" @click="uploadClick">
          <svg class="icon">
            <use xlink:href="#iconshangchuan"></use>
          </svg>
        </div>
      </div>
    </nav-bar>
    <upload-frame ref="uploadFrame" />
  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import * as types from  '@/store/mutations-type'
  import {getBlogInfos, getBlogTypeInfo} from "../../../network/blogpage";
  import NavBar from "../../common/NavBar/NavBar";
  import CenterHomeIcon from "../CenterHomeIcon/CenterHomeIcon";
  import UploadFrame from "../UploadFrame/UploadFrame";
  import {getRainbowRgba} from "../../../common/utils";

  export default {
    name: "CenterHeader",
    components: {
      UploadFrame,
      CenterHomeIcon,
      NavBar
    },
    data(){
      return {
        colors:[]
      }
    },
    methods:{
      homeClick(){
        if(this.$route.fullPath.match(/\/content\//)) {
          this.$router.back()
        }
        getBlogTypeInfo(this.pageUser.userId).then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.$store.commit(types.SET_BLOGS_COUNT_INFO, res.data.data)
          }
        })
        getBlogInfos('all',this.pageUser.userId,'all').then(res=>{
          if(res.data.code === 200 && res.data.data) {
            this.$store.commit(types.SET_BLOGS_INFO,res.data.data)
          }
        })
      },
      itemClick( item ){
        getBlogInfos('category',this.pageUser.userId,item.categoryName).then(res=>{
          // [] 放在 if 中 作条件 和  []==false 结果是不一样的！！！
          if (res.data.code === 200 && res.data.data ) {
            this.$store.commit(types.SET_BLOGS_INFO,res.data.data)
            if(this.$route.fullPath.match(/\/content\//)) {
              this.$router.back()
            }
          }
        })
      },
      editClick(){
        alert('在线编辑功能还未开放哦~~可尝试在线上传')
      },
      uploadClick(){
        if( !this.isLogIn ) {
          alert('请先登录')
          return
        }
        if( Number.parseInt(this.$route.params.uid) !== Number.parseInt( this.user.userId)  ) {
          alert('请到个人主页上传')
          return
        }
        this.$refs.uploadFrame.showFrame()
      },
      categoryColorStyle(index){
        if(index < this.colors.length) {
          return {'background-color':this.colors[index]}
        }else {
          return {}
        }
      }
    },
    computed:{
      ...mapGetters([
        'blogsCountInfo',
        'pageUser',
        'user',
        'isLogIn'
      ]),
    },
    watch:{
      blogsCountInfo:{
        handler(newVal){
          if(newVal && newVal.tagInfos){
            this.colors = getRainbowRgba(newVal.tagInfos.length,40,230)
          }
        },
        deep:true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .center-header {
    position: relative;
    padding: 10px 10px;
    background-color: rgba( 250,250,250,var(--global-opacity,1));
    border-radius: 15px;
    min-width: 80px;
    .center-bar {
      height: 100%;
    }
    .home {
      height: 100%;
      margin-right: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .category-list {
      display: flex;
      flex-wrap: wrap;
      .category {
        font-size: 1.3em;
        white-space: nowrap;
        transition: color .3s;
        margin: 4px 5px;
        cursor: pointer;
        &:hover {
          color: #03b4fa;
        }
        .category-count {
          color: black;
          position: relative;
          display: inline-block;
          background-color: darkgrey;
          text-align: center;
          width: 40px;
          height: 100%;
          border-radius: 60%;
        }
      }
    }
    .operation {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      .edit,.upload {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80px;
        margin-right: 7px;
        > .icon {
          font-size: 2.7em;
        }
      }
    }

  }
</style>
