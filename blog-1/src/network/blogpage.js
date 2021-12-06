import {request2} from "./request";
import {blogHost} from "./host";
import {getToken} from "../common/cache";
import {getParamsMd5Str} from "../common/utils";

/*
  登录
 */
export function login(data,fid) {

  let paramsData = {
    userName:data.username,
    password:data.password,
  }

  return request2({
    method:'post',
    url:`${blogHost}/login`,
    headers:{fid},
    params:{
      ...paramsData,
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  当进入或切换页面时，需要验证登录逻辑
 */
export function autoLogin(fid,isAutoLogin) {

  let paramsData = {
    isAutoLogin
  }

  return request2({
    method:'post',
    url: `${blogHost}/autologin`,
    headers: {'Authorization':getToken(),'fid':fid},
    params:{
      ...paramsData,
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  提交注册信息
 */
export function register(data) {

  let paramsData = {
    userName: data.username,
    password: data.password,
    email: data.email,
    vericode: data.vericode
  }

  return request2({
    method: 'post',
    url: `${blogHost}/register`,
    params: {
      ...paramsData,
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  发送邮件
 */
export function sendEmail(email) {

  let paramsData = {
    email
  }

  return request2({
    method:'post',
    url:`${blogHost}/mail`,
    params: {
      ...paramsData,
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  登出
 */
export function logout() {

  let paramsData = {}

  return request2({
    url:`${blogHost}/logout`,
    params:{
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  得到blog的统计信息
 */
export function getBlogTypeInfo(usedId) {

  let paramsData = {
    uid:usedId
  }

  return request2({
    url:`${blogHost}/blogcount`,
    params:{
      ...paramsData,
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  上传blog时，提交form表单
 */
export function upload(formData,signData,fid) {

  let md5Str = getParamsMd5Str(signData)
  formData.append('sign',md5Str)

  return request2({
    method: 'post',
    headers: {
      'Authorization': getToken(),
      'fid': fid,
      'Content-Type':'application/x-www-form-urlencoded'},
    url: `${blogHost}/upload`,
    data: formData
  })
}

/*
  得到blog的信息
 */
export function getBlogInfos(type,userId,name) {

  let paramsData = {
    type,
    uid:userId,
    name
  }

  return request2({
    url:`${blogHost}/bloginfos`,
    params:{
      ...paramsData,
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  单独查询blog的内容
 */
export function getBlogContent(articleId) {

  let paramsData = {
    articleid:articleId
  }


  return request2({
    url:`${blogHost}/blogcontent`,
    params:{
      ...paramsData,
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  得到默认主页展示的用户的id
 */
export function getDefaultUserId() {

  let paramsData = {}

  return request2({
    url:`${blogHost}/defaultuid`,
    params:{
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  得到用户信息
 */
export function getUserInfo(userId) {

  let paramsData = {
    uid:userId
  }

  return request2({
    url:`${blogHost}/userInfo`,
    params:{
      ...paramsData,
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  更新用户头像的url
 */
export function submitHeadImgUrl(fid,url,uid) {

  let paramsData = {
    url,
    uid
  }

  return request2({
    method:'post',
    url:`${blogHost}/setheadimgurl`,
    headers:{
      'Authorization': getToken(),
      'fid': fid,
    },
    params:{
      ...paramsData,
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  更新公告栏的内容
 */
export function submitAnnouncement(fid,annon,uid) {

  let paramsData = {
    annon,
    uid
  }

  return request2({
    method:'post',
    url:`${blogHost}/setannon`,
    headers:{
      'Authorization': getToken(),
      'fid': fid,
    },
    params:{
      ...paramsData,
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  根据tag查询响应的articleId
 */
export function getTagsByArticleId(articleId) {

  let paramsData = {
    articleId
  }
  return request2({
    url:`${blogHost}/tags`,
    params:{
      ...paramsData,
      sign:getParamsMd5Str(paramsData)
    }
  })
}

/*
  更新 github 和 bilibili 主页 url
 */
export function submitGithubBilibiliUrl(userId,githubUrl,bilibiliUrl,fid) {
  let paramsData = {
    'githubUrl':githubUrl,
    'bilibiliUrl':bilibiliUrl,
    uid:userId
  }

  return request2({
    method:'post',
    url:`${blogHost}/setgburl`,
    headers:{
      'Authorization': getToken(),
      'fid': fid,
    },
    params:{
      ...paramsData,
      sign:getParamsMd5Str(paramsData)
    }
  })
}

export function downloadBlogFileUrl(articleId) {
  return `${blogHost}/download?articleid=${articleId}`
}

/*
  根据 articleId删除 对应的article
 */
export function deleteArticleByArticleId(userId,articleId,fid) {
  let paramsData = {
    'uid':userId,
    'aid':articleId
  }
  return request2({
    method:'post',
    url:`${blogHost}/deletearticle`,
    headers:{
      'Authorization': getToken(),
      'fid': fid,
    },
    params:{
      ...paramsData,
      sign:getParamsMd5Str( paramsData )
    }
  })
}


