/*
 * @path: src/hello-vue-router/install.js
 * @Description: 插件安装方法 install
 */
import View from "./components/view";
import Link from "./components/link";

export let _Vue;

export function install(Vue) {
  if (install.installed && _Vue === Vue) return;
  install.installed = true;
  _Vue = Vue;

  // 全局注册混入，每个 Vue 实例都会被影响
  Vue.mixin({
    // Vue 创建前钩子，此生命周期 $options 已经挂载完成
    beforeCreate() {
      // 通过判断组件实例 this.$options 有无 router 属性，来判断是否为根实例
      // 根实例初始化时挂载了 VueRouter 实例 router（main.js 中 new Vue({ router }) 处）
      if (this.$options.router) {
        this._routerRoot = this;
        // 在 Vue 根实例添加 _router 属性 （VueRouter 实例）
        this._router = this.$options.router;

        // 调用 VueRouter 实例初始化方法
        // _router 即 VueRouter 实例，此处 this 即 Vue 根实例
        this._router.init(this);

        // this._route = {}; old
        this._route = this._router.history.current; // new
      } else {
        //为每个组件实例定义 _routerRoot ，回溯查找 _routerRoot
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
    }
  });

  // 在 Vue 原型上添加 $router 属性（VueRouter)，并代理到 this._routerRoot._router
  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      return this._routerRoot._router;
    }
  });

  // 在 Vue 原型上添加 $route 属性（当前路由对象)，并代理到 this._routerRoot._route
  Object.defineProperty(Vue.prototype, "$route", {
    get() {
      return this._routerRoot._route;
    }
  });

  Vue.component("RouterView", View);
  Vue.component("RouterLink", Link);
}
