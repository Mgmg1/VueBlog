<template>
  <div class="blog-page" :style="blogPageStyle">
    <vue-scroll ref="vs"
                @handle-scroll="handleScroll">
      <div >
        <blog-nav-bar/>
        <div class="blog-main">
          <blog-left-side class="blog-left"/>
          <blog-center class="content"/>
          <blog-right-side class="blog-right"/>
        </div>
        <blog-footer/>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import * as types from "../../store/mutations-type";
  import {getAutoLogin, setToken} from "../../common/cache";
  import {autoLogin, getBlogInfos, getBlogTypeInfo, getDefaultUserId, getUserInfo} from "../../network/blogpage";

  import BlogNavBar from "./childComps/BlogNavBar";
  import BlogLeftSide from "./childComps/BlogLeftSide";
  import BlogCenter from "./childComps/BlogCenter";
  import BlogRightSide from "./childComps/BlogRightSide";
  import BlogFooter from "./childComps/BlogFooter";

  export default {
    name: "BlobPage",
    data(){
      return {
        barProcess:0
      }
    },
    components: {
      BlogFooter,
      BlogRightSide,
      BlogCenter,
      BlogLeftSide,
      BlogNavBar
    },
    methods:{
      handleScroll(vertical, horizontal, nativeEvent){
        this.barProcess = vertical.process
      },
      autoLogin() {
        let isAutoLogin = getAutoLogin();
        if (!isAutoLogin) {
          //undefine 转 false
          isAutoLogin = false
        }
        autoLogin().then(res => {
          if (res.data.code === 200) {
            if (res.data.data) {
              this.$store.commit(types.SET_LOGIN, true)
              this.$store.commit(types.SET_USER, res.data.data.user)
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
      //请求blog数据
      setPageInfo(){
        let pageUserId = Number.parseInt(this.$route.params.uid)
        getDefaultUserId().then(res=>{
          //查询得到默认userId ,设置默认userId
          if(res.data.code === 200 && res.data.data ) {
            let defaultUserId = res.data.data
            this.$store.commit(types.SET_DEFAULT_USER_ID,Number.parseInt(defaultUserId))
            new Promise((resolve, reject) => {
              if( !Number.isInteger(pageUserId) || pageUserId === 1){
                //设置默认pageUserId
                pageUserId = defaultUserId
                //查询pageUser
              }
              getUserInfo(pageUserId).then(res=>{
                if(res.data.code === 200 && res.data.data) {
                  this.$store.commit(types.SET_PAGE_USER,res.data.data)
                  resolve(res.data.data.userId)
                }else {
                  //说明找不到用户，自动跳到主站
                  this.$router.replace(`/${defaultUserId}`)
                }
              })
            }).then(userId=>{
              getBlogTypeInfo(userId).then(res => {
                if (res.data.code === 200 && res.data.data) {
                  this.$store.commit(types.SET_BLOGS_COUNT_INFO, res.data.data)
                }
              })
              getBlogInfos(this.currentBlogType.type,userId,this.currentBlogType.info).then(res=>{
                if(res.data.code === 200 && res.data.data) {
                  this.$store.commit(types.SET_BLOGS_INFO,res.data.data)
                }
              })
            })
          }
        })
      }
    },
    computed:{
      ...mapGetters([
        'user',
        'isLogIn',
        'currentBlogType'
      ]),
      blogPageStyle() {
        return {'background-position-y': `${this.barProcess * 100}%` }
      }
    },
    //初次创建组件会触发
    activated() {
      this.autoLogin()
      this.setPageInfo()
      this.$bus.$on('blogItemClick',(time)=>{
        this.$refs["vs"].scrollTo({
            y: 170
          },
          time,
          "ease"
        );
      })
    },
    deactivated() {
      this.$bus.$off('blogItemClick')
    },
    //初次创建组件时不会触发，创建完成后改变组件url才会触发
    watch:{
      $route(newRoute,oldRoute){
        if(oldRoute.params.uid !== newRoute.params.uid) {
          this.autoLogin()
          this.setPageInfo()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

.blog-page {
  position: relative;
  z-index: 11;
  height: 100vh;
  background:{
    size: cover;
    attachment: fixed;
    /*image: url("../../assets/img/blog_page/blog_bg2.jpg") ;*/
    image: url('http://r.photo.store.qq.com/psc?/V53RZdap02olQB1qJRDI0kxlEl0h2BPA/45NBuzDIW489QBoVep5mcecQEaplkek0RkNvZADeO978ruCO7hVSnT48oXT4qlmPB.LjS3HTr7k4L0ZAWM1kCYCSLSg7HnSebDXJdk5AARQ!/r') ;
  }
  .blog-main {
    display: flex;
    width: 85%;
    margin: 30px auto 0;
    position: relative;
    @media all and (max-width: 900px) {
      .blog-left,.blog-right {
        display: none;
      }
    }
    .blog-left {
      width: 360px;
      flex: 0 0 auto;
    }
    .content {

      flex: 1 1 auto;
    }
    .blog-right {
      width: 280px;
      flex: 0 0 auto;
    }
  }
}
</style>
