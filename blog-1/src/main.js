import Vue from 'vue'
import App from './App'
import router from './router'
import storage from 'good-storage'
import store from  './store/index'
import Vuex from  'vuex'
import vuescroll from "vuescroll";
import vuescrollConfig from './vuescroll/index'
import FastClick from 'fastclick'

import toast from './components/common/Toast/index'

import mavonEditor  from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)
Vue.use(Vuex)
Vue.use(toast)
Vue.use(vuescroll)
FastClick.attach(document.body)
Vue.prototype.$vuescrollConfig = vuescrollConfig
Vue.prototype.$storage = storage
Vue.prototype.$bus = new Vue()


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
