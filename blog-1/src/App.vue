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
  import {getFingerPrintId} from "./common/utils";

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
    initialize(fingerPrintId){
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
        autoLogin(fingerPrintId, isAutoLogin).then(res => {
          if (res.data.code === 200 && res.data.data) {
            setToken(res.data.data.token)
            this.$store.commit(types.SET_LOGIN, true)
            this.$store.commit(types.SET_USER, res.data.data.user)
          }
        })
      }
    }
  },
  created() {
    this.requireIconFont()
    getFingerPrintId().then(fingerPrintId=>{
      this.$store.commit(types.SET_FINGERPRINTF_ID,fingerPrintId)
      this.initialize(fingerPrintId)
    })
  },
  computed:{
    ...mapGetters([
      'fingerPrintId',
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
