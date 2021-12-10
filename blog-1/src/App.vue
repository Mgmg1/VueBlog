<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>

  import BlobPage from "./views/BlogPage/BlogPage";
  import {getAutoLogin, setToken} from "./common/cache";
  import * as types from "./store/mutations-type";
  import {autoLogin, getDefaultUserId} from "./network/blogpage";
  import {mapGetters} from "vuex";
  import { getToken } from "./common/cache";

  export default {
  name: 'App',
  components: {
    BlobPage
  },
  methods:{
    //引入 alibaba标签库
    requireIconFont(){
      let script = document.createElement('script')
      script.src = '//at.alicdn.com/t/font_2358351_0pamhcya2yj.js'
      document.body.appendChild(script)
    },
    initialize(){
      if(!this.isLogIn) {
        let isAutoLogin = getAutoLogin();
        if(!isAutoLogin) {
          //undefine 转 false
          isAutoLogin = false
        }
        //查询得到默认userId ,设置默认userId
        getDefaultUserId().then(res=>{
          if(res.data.code === 200 && res.data.data ) {
            this.$store.commit(types.SET_DEFAULT_USER_ID,Number.parseInt(res.data.data))
          }
        })
        autoLogin(getToken()).then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.$store.commit(types.SET_LOGIN, true)
            this.$store.commit(types.SET_USER, res.data.data.user)
          }
        })
      }
    }
  },
  created() {
    this.requireIconFont()
    this.initialize()
  },
  computed:{
    ...mapGetters([
      'user',
      'isLogIn'
    ])
  }


}
</script>

<style>
  @import "./assets/css/base.css";
  #app {
    height: 100%;
  }
</style>
