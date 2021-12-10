import {deleteArticleByArticleId} from "../network/blogpage";
import {SET_BLOGS_INFO} from "./mutations-type";

const actions = {
  deleteArticleByArticleIdInAction( {commit,state}, {router} ) {
      let copy = {...state.blogsInfo};
      deleteArticleByArticleId(state.currentBlog.userId,state.currentBlog.articleId).then((res)=>{
        if( res.data != null && res.data.code === 200 ) {
          alert('已删除!')
          commit(SET_BLOGS_INFO,{})
          router.replace(`/${state.currentBlog.userId}`)
        }else {
          alert('遇到未知错误')
          commit(SET_BLOGS_INFO,copy)
        }
      }).catch(err=>{
        console.log(err)
      }).finally(()=>{
        ////
      })
  }
}


export default actions
