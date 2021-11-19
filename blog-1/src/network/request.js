import axios from "axios";
//不提交复杂格式的请求
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

//requestConfig : url,method,params
export function request(instanceConfig,requestConfig) {
  const instance = new axios.create({
    timeout:10000,
    ...instanceConfig
  })

  instance.interceptors.response
    .use(res => {
    return res.data
  }, error => {
  })

  return instance(requestConfig)
}

export function request2(config) {
 return axios({
   withCredentials:true,
   ...config
 })
}
