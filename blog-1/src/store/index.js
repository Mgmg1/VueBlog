import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex)

import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

const state = {
  //已登录的用户信息
  user:{
    userName:'',
    announcement:'',
    userId:0
  },
  blogsInfo:[

  ],
  currentBlog:[
  ],
  isLogIn:false,
  fingerPrintId:'',
  blogsCountInfo:{},
  //当前页面的用户信息
  pageUser:{

  },
  defaultUserId:1,
  currentBlogType:{
    type:'all', //blogType : all，notetype，category, tag
    info:'all' //携带的查询信息
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})

export default store
