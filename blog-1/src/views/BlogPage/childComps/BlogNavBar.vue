<template>
  <div>
    <nav-bar class="blog-nav-bar">
      <div slot="left" >
        <common-progress-bar :side-length="20"
                             :max="1"
                             :min="0"
                             :default-bar-value="0.08"
                             class="opacityBar"
                             @btnXChange="valChange"/>
      </div>
      <div slot="center"></div>
      <div slot="right">
        <div class="login">
          <div v-if="!isLogIn">
            <span><a @click="login">登录/注册</a></span>
          </div>
          <div v-else>
            <span v-if="isShowUserHomeTag"><a @click="showUserCenter">个人中心</a></span>
            <span><a @click="logOut">注销</a></span>
            <span >
              <a v-if="Number.parseInt(this.$route.params.uid) === this.user.userId"
                @click="toDefaultPage">主站</a>
              <a v-else @click="toDefaultPage">个人主页</a>
            </span>
          </div>
        </div>
      </div>
    </nav-bar>
    <UserHome ref="userHome"/>
  </div>

</template>

<script>

  import {mapGetters} from  'vuex'

  import NavBar from "../../../components/common/NavBar/NavBar";
  import CommonProgressBar from "../../../components/common/CommonProgressBar/CommonProgressBar";
  import UserHome from "../../../components/content/UserHome/UserHome";
  import {logout} from "../../../network/blogpage";
  import {setToken} from "../../../common/cache";
  import * as types from "../../../store/mutations-type";

  export default {
    name: "BlogNavBar",
    data() {
      return {}
    },
    components: {
      UserHome,
      CommonProgressBar,
      NavBar
    },
    methods: {
      login() {
        this.$router.push('/loginpage')
      },
      valChange(barValue) {
        const isSupported =
          window.CSS &&
          window.CSS.supports &&
          window.CSS.supports('--a', 0);
        if (isSupported) {
          document.body.style.setProperty('--global-opacity', 1 - barValue)
        }
      },
      showUserCenter(){
        if(this.isShowUserHomeTag) {
          this.$refs.userHome.showFrame()
        }
      },
      logOut() {
        // 向后台请求logout,then
        logout().then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.$store.commit(types.SET_LOGIN, false)
            setToken(undefined)
            window.location.href = '/'
          }
        })
      },
      toDefaultPage(){
        // this.$router.push(`/${this.defaultUserId}`)  activaed 无法探知 params 发生变化
        // window.location.href = `/${this.defaultUserId}`
        // 未登录，或者 默认页面用户 和 登录用户 一样时，不进行路由跳转
        if( !this.isLogIn || this.user.userId != this.defaultUserId ) {
          if ( Number.parseInt(this.$route.params.uid) === this.user.userId) {
            this.$router.push(`/${this.defaultUserId}`)
          } else {
            this.$router.push(`/${this.user.userId}`)
          }
        }
      }
    },
    mounted() {
      //初始值
      this.valChange(0.08)
    },
    computed:{
      ...mapGetters([
        'isLogIn',
        'defaultUserId',
        'pageUser',
        'user'
      ]),
      isShowUserHomeTag(){
        return this.pageUser.userId === this.user.userId
      }
    }
  }
</script>

<style lang="scss" scoped>
  .blog-nav-bar {
    position: relative;
    top: 0;
    z-index: 10;
    width: 100%;
    background: {
      /*image: url("../../../assets/img/blog_page/blog_head.jpg");*/
      image: url("http://r.photo.store.qq.com/psc?/V53RZdap02olQB1qJRDI0kxlEl44wN9A/45NBuzDIW489QBoVep5mcdJ34HRrrD17V6kUw.XD1L*LOBx4ktwmbXjk5W0yXxpikWxDHANZdcXxoTnDVBDMYkEwokhAhJDmCCXLMMc3gyg!/r");
      size: cover;
      position: 0 40%;
    };
    height: 125px;

    .opacityBar {
      position: absolute;
      left: 15px;
      width: 50px;
      bottom: 2px;
      transition: width .5s;
      z-index: 20;
      &:hover {
        width: 170px;
      }
    }

    .login {
      color: rgba(246, 185, 167, 0.45);
      font-size: 1.4rem;
      font-weight: bold;
      padding: 7px 15px;
      user-select: none;
      position: relative;
      span {
        cursor: pointer;
        margin-right: 10px;
      }
      a {
        text-decoration: none;
        color: inherit;
      }
    }
  }
</style>
