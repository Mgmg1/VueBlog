import Toast from "./Toast";
const obj = {};
obj.install = function (Vue) {
  //组件构造器
  const toastConstruct = Vue.extend(Toast);
  //创建组件
  const toast = new toastConstruct();
  //挂载组件
  toast.$mount(document.createElement('div'))
  document.body.appendChild(toast.$el);

  Vue.prototype.$toast = toast;

}
export default obj;
