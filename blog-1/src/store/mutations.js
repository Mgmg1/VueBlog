import * as types from "./mutations-type";

const mutations = {

  [types.SET_CURRBLOG](state,currentBlog){
    state.currentBlog =  currentBlog
  },

  [types.SET_BLOGS_INFO](state,blogsInfo){
    state.blogsInfo = blogsInfo
  },

  [types.SET_CURBLOGS_BYIDS](state,currentBlogIds){
    let blogs = []
    for (const id of currentBlogIds) {
      let blog  = state.blogs.find(blog=>blog.articleId === id)
      if(blog){
        blogs.push(blog)
      }
    }
    state.currentBlogs = blogs
  },
  [types.SET_LOGIN](state,isLogin){
    state.isLogIn = isLogin
  },
  [types.SET_USER](state,user){
    state.user = user
  },
  [types.SET_FINGERPRINTF_ID](state,fid){
    state.fingerPrintId = fid
  },
  [types.SET_BLOGS_COUNT_INFO](state,blogsCountInfo){
    state.blogsCountInfo = blogsCountInfo
  },
  [types.SET_PAGE_USER](state,pageUser){
    state.pageUser = pageUser
  },
  [types.SET_DEFAULT_USER_ID](state,defaultUserId){
    state.defaultUserId = defaultUserId
  },
  [types.SET_HEAD_IMG_URL](state,headImgUrl) {
    state.user.headImgUrl = headImgUrl
  },
  [types.SET_ANNOUNCEMENT](state,announcement) {
    state.user.announcement = announcement
    if( state.user.userId === state.pageUser.userId ) {
      state.pageUser.announcement = announcement
    }
  },
  [types.SET_PAGE_USER_ANNON](state,announcement) {
    state.pageUser.announcement = announcement
  },
  [types.SET_GITHUBBILIBILI_URL](state,payload) {
    state.user.githubUrl = payload.data.githubUrl
    state.user.bilibiliUrl = payload.data.bilibiliUrl
    if( state.user.userId === state.pageUser.userId ) {
      state.pageUser.githubUrl = payload.data.githubUrl
      state.pageUser.bilibiliUrl = payload.data.bilibiliUrl
    }
  }

}

export default mutations
