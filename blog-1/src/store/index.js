import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex)

import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

const state = {
  user:{
    userName:'二刺螈',
    announcement:'<p>这里是公告~~~</p>',
    userId:2
  },
  blogsInfo:[

  ],
  currentBlog:[
  ],
  isLogIn:false,
  fingerPrintId:'',
  blogsCountInfo:{},
  pageUser:{

  },
  defaultUserId:1
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})

export default store
