const getters = {
  user : state => state.user,

  isLogIn : state => state.isLogIn,

  blogsInfo : state => state.blogsInfo,

  currentBlog: state => state.currentBlog,

  fingerPrintId: state => state.fingerPrintId,

  blogsCountInfo: state => state.blogsCountInfo,

  pageUser: state => state.pageUser,

  defaultUserId: state => state.defaultUserId,

  currentBlogType : state => state.currentBlogType
}


export default getters
