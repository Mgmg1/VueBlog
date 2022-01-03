<template>
  <div class="blog-content">
    <div class="content-header" >
      <svg class="icon return" @click="back" ><use xlink:href="#iconfengche"></use></svg>
      <svg class="icon more" @click="isShowMoreSelector=!isShowMoreSelector"><use xlink:href="#iconzhuye"></use></svg>
    </div>
    <transition name="more-selector">
      <div class="more-selector" v-show="isShowMoreSelector">
        <ul>
          <li @click="moreSelect(1)">编辑</li>
          <li @click="moreSelect(2)"><a  target="_blank" ref="download">导出</a></li>
          <li @click="moreSelect(3)">删除</li>
        </ul>
      </div>
    </transition>
    <div class="title">
      {{ this.currentBlog.title }}
    </div>
    <div class="detail-info">
      <svg class="icon" ><use xlink:href="#iconrili-copy"></use></svg>
      <span>{{ formatDate( this.currentBlog.createDate ) }}</span>
      <svg class="icon" ><use xlink:href="#icondushu"></use></svg>
    </div>
    <div v-if="tags.length" class="tag-list">
      标签:
      <span v-for="item in tags">
        {{ item.tagName }}
      </span>
    </div>
    <h6 class="summary">
      {{ this.currentBlog.summary }}
    </h6>
    <div class="editor-container">
      <div class="navigation-btn" @click="navigationBtnClick">导航</div>
      <mavon-editor v-model="markdownText" class="editor"
                    :subfield='false' :editable='false'
                    :toolbarsFlag='false' defaultOpen="preview"
                    :navigation='true'
                    ref="editor"/>
    </div>
  </div>
</template>

<script>

  import {mapGetters,mapActions} from 'vuex'
  import {
    getBlogContent,
    getTagsByArticleId,
    getBlogTypeInfo,
    getBlogInfos,
    downloadBlogFileUrl,
  } from "../../../network/blogpage";
  import * as types from "../../../store/mutations-type";
  import {formatDate,until} from "../../../common/utils";

  export default {
    name: "BlogContent",
    data(){
      return {
        markdownText:'',
        isShowNavigation:true,
        isShowMoreSelector:false,
        tags:[]
      }
    },
    methods:{
      /*
        事件
       */
      navigationBtnClick(event){
        let navigationWrapper =this.$refs.editor.$el.getElementsByClassName('v-note-navigation-wrapper')[0]
        if(this.isShowNavigation) {
          navigationWrapper.style.display = 'none'
          this.isShowNavigation = false
        }else {
          navigationWrapper.style.display = 'block'
          this.isShowNavigation = true
        }
      },
      back(){
        this.$router.push(`/${this.$route.params.uid}`)
      },
      moreSelect(index) {
        /*
          根据选项执行对应more-selector的逻辑
          index : { 1,2,3 }
         */
        if( index === 1 ) { //index1 对应的 li
          alert("编辑功能尚未开放~")
        }else if( index === 3 ) {
          if( confirm("是否删除当前博客?") ) {
            this.$store.dispatch({
              type:'deleteArticleByArticleIdInAction',
              router:this.$router
            })
          }
        }
      },
      formatDate(date) {
        return formatDate(new Date(date),'yyyy-MM-dd hh-mm-ss'  )
      },
      initialize(){
        // let blogId = this.$route.fullPath.match(/\d+$/)[0]
        let blogId = this.$route.params.articleid
        getBlogContent(blogId).then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.$store.commit(types.SET_CURRBLOG, res.data.data)
            this.markdownText = res.data.data.content
            until(()=>this.$refs.download,()=>{
              this.$refs.download.setAttribute('href',downloadBlogFileUrl(blogId))
            })
          }
        })
        getTagsByArticleId( blogId ).then(res=>{
          if(res.data && res.data.code === 200 && res.data.data ) {
            this.tags = res.data.data
          }
        })
      },
      //对编辑器做一些小改造 , 这里无法使用vue的动画过渡，
      //考虑使用 create-keyframe-animation 做改造（待定）
      // editorInitial(){
      //   until(()=> this.$refs.editor&&this.$refs.editor.$el,()=>{
      //     let closeBtn = this.$refs.editor.$el.getElementsByClassName('v-note-navigation-close')[0]
      //     closeBtn.style.display = 'none'
      //     let navigationWrapper =this.$refs.editor.$el.getElementsByClassName('v-note-navigation-wrapper')[0]
      //     navigationWrapper.style.display = ''
      //     navigationWrapper.style.opacity = '0'
      //     navigationWrapper.style.zIndex = '-1'
      //     navigationWrapper.style.borderRadius = '20px'
      //     //visibility占用原始位置，transition无法对 display 起效，无法使用vue动画和过渡，考虑使用 create-keyframe-animation 做改造（待定）
      //     navigationWrapper.style.transition = 'all .3s'
      //   },.3)
      // }
      // ...mapActions([
      //   'deleteArticleByArticleId'
      // ])
    },
    computed:{
      ...mapGetters([
        'currentBlog',
        'user',
        'pageUser',
        'currentBlogType'
      ]),
    },
    activated() {
      this.initialize()
    },
    /*
      在router改变前获取信息，有beforeRouteLeave （ from ）  和beforeRouteEnter （to）两种做法
      前者拿不到this。。。。所以不能接触到 vuex
    */
    beforeRouteLeave( to,from,next ) {
      if( !isNaN(parseInt(to.params.uid)) ) {
        let userId =  parseInt(to.params.uid)
        let _this = this;
        Promise.all( [getBlogTypeInfo(userId),
          //参数解构还不能用在 箭头函数上
          getBlogInfos(this.currentBlogType.type,userId,this.currentBlogType.info) ] ).then(  function ([res1,res2]) {
          if (res1.data.code === 200 && res1.data.data) {
            _this.$store.commit(types.SET_BLOGS_COUNT_INFO, res1.data.data)
          }
          if(res2.data.code === 200 && res2.data.data) {
            _this.$store.commit(types.SET_BLOGS_INFO,res2.data.data)
          }
        }).finally(()=>{
          next();
        })
        // getBlogTypeInfo(userId).then(res => {
        //   if (res.data.code === 200 && res.data.data) {
        //     this.$store.commit(types.SET_BLOGS_COUNT_INFO, res.data.data)
        //   }
        // })
        // getBlogInfos(this.currentBlogType.type,userId,this.currentBlogType.info).then(res=>{
        //   if(res.data.code === 200 && res.data.data) {
        //     this.$store.commit(types.SET_BLOGS_INFO,res.data.data)
        //   }
        // })
      }else {
        next()
      }
    }
  }
</script>

<style lang="scss" scoped>
.blog-content {
  margin-top: 25px;
  background-color: rgba(246, 245, 245,var(--global-opacity,1));
  text-align: center;
  border-radius: 20px;
  position: relative;
  user-select: none;
  @keyframes returnIconRotate {
    50% {
      transform: rotate(90deg);
    }
    100% {
      transform: rotate(90deg);
    }
  }
  @keyframes twinkle {
    30% {
      opacity: 30%;
    }
    100% {
      opacity: 100%;
    }
  }
  .content-header {
    padding: 8px 15px 0 15px;
    text-align: left;
    overflow: hidden;
    svg {
      height: 35px;
      width: 35px;
    }
    .return {
      float: left;
      animation: returnIconRotate 1.5s infinite;
    }
    .more {
      float: right;
      animation: twinkle 3s ease-in-out infinite;
    }
  }
  .more-selector{
    border-radius: 10px;
    position: absolute;
    width: 100px;
    padding: 3px 10px ;
    right: 0;
    font-size: 17px;
    ul {
      list-style: none;
      border-radius: 8px;
      background-color: rgba(248,248,255,.8);
      li {
        &:not(:last-child){
          border-bottom: 1px solid rgb(176,196,222);
        };
        padding: 3px 0;
        &:hover {
          background-color: rgba(216,191,216,1);
        }
        a {
          text-decoration: none;
          color: black;
          cursor: inherit;
        }
      }
    }
  }
  .title {
    font-weight: bolder;
    font-size: 3rem;
    padding-bottom: 10px;
  }
  .detail-info{
    font-weight: bold;
    font-size: 1.2rem;
    padding-bottom: 10px;
  }
  .tag-list {
    font-size: 1.3em;
    padding-bottom: 10px;
    > span {
      color: #4a5bf3;
      padding: 5px 10px;
      font-size: 1.5rem;
    }
  }
  .summary {
    font-size: 1.4rem;
    padding: 3px 0 3px;
    margin: 0 15px;
  }
  .editor-container {
    word-break: break-word;
    user-select: text;
  }
  .navigation-btn {
    font-size: 1.3em;
    transition: color .3s;
    text-align: right;
    padding-right: 20px;
    padding-bottom: 10px;
    user-select: none;
    &:hover {
      color: #87ceeb;
    }
  }
}
</style>
<style >
  .v-note-wrapper {
    background-color: rgba(255,255,255,var(--global-opacity,1)) !important;
  }
  .v-note-op {
    background-color: rgba(255,255,255,var(--global-opacity,1)) !important;
  }
  .v-show-content {
    background-color: rgba(251,251,251,var(--global-opacity,1)) !important;
  }
  .v-note-navigation-close {
    display: none;
  }
  .v-note-navigation-wrapper {
    border-radius: 20px;
  }

  .more-selector-enter-active, .more-selector-leave-active {
    transition: opacity .5s;
  }
  .more-selector-enter, .more-selector-leave-to {
    opacity: 0;
  }
</style>
