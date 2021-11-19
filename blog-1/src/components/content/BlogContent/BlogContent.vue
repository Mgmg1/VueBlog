<template>
  <div class="blog-content">
    <div class="return-icon" >
      <svg class="icon" @click="back" ><use xlink:href="#iconfengche"></use></svg>
    </div>
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

  import {mapGetters} from 'vuex'
  import {getBlogContent, getTagsByArticleId} from "../../../network/blogpage";
  import * as types from "../../../store/mutations-type";
  import {formatDate} from "../../../common/utils";

  export default {
    name: "BlogContent",
    data(){
      return {
        markdownText:'',
        isShowNavigation:true,
        tags:[]
      }
    },
    methods:{
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
        this.$router.back()
      },
      formatDate(date) {
        return formatDate(new Date(date),'yyyy-MM-dd hh-mm-ss'  )
      },
      initialize(){
        // let blogId = this.$route.fullPath.match(/\d+$/)[0]
        let blogId = this.$route.params.articleid
        getBlogContent( blogId).then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.$store.commit(types.SET_CURRBLOG, res.data.data)
            this.markdownText = res.data.data.content
          }
        })
        getTagsByArticleId( blogId ).then(res=>{
          if(res.data && res.data.code === 200 && res.data.data ) {
            this.tags = res.data.data
          }
        })
      }
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
    },
    computed:{
      ...mapGetters([
        'currentBlog',
        'fingerPrintId'
      ]),

    },
    activated() {
      this.initialize()
    },
    watch:{
      fingerPrintId(){
        this.initialize()
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
  @keyframes returnIconRotate {
    50% {
      transform: rotate(90deg);
    }
    100% {
      transform: rotate(90deg);
    }
  }
  .return-icon {
    padding: 8px 0 0 15px;
    text-align: left;
    svg {
      height: 35px;
      width: 35px;
      animation: returnIconRotate 1s infinite;
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
    font-size: 1.5rem;
    padding: 3px 0 10px;
  }
  .editor-container {
    word-break: break-word;
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
</style>
