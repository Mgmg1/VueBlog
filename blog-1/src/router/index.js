import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const blogPage = () => import('../views/BlogPage/BlogPage')
const blobBox = () => import('../components/content/BlobBox/BlogBox')
const blogContent = () => import('../components/content/BlogContent/BlogContent')
const loginView = () => import('../views/Login/LoginView')



const routes = [
  {
    //  path:''  和 redirect:'/'    这会导致无限 redirect
    path:'',
    redirect:'/1'
  },
  {
    //配置顺序是有影响的!
    path: '/loginpage',
    component:loginView
  },
  {
    path:'/:uid',
    component:blogPage,
    children:[
      {
        // path:'/:uid' 路径和父组件相同，则能够拿到参数,且默认路由指向该子组件   其实 /  也取得到变量
        path:'',
        component:blobBox
      },
      {
        path:'content/:articleid',
        component:blogContent
      },
    ]
  },
]

export default new Router({
  routes,
  mode: 'history'
})
