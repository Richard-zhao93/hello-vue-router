/*
 * @path: src/hello-vue-router/history/html5.js
 * @Description: 路由模式 HTML5History 子类
 */
import { History } from "./base";

export class HTML5History extends History {
  constructor(router) {
    // 继承父类
    super(router);
  }

  // 启动路由监听
  setupListeners() {
    // 路由监听回调
    const handleRoutingEvent = () => {
      this.transitionTo(getLocation(), () => {
        console.log(`HTML5路由监听跳转成功！`);
      });
    };

    window.addEventListener("popstate", handleRoutingEvent);
    this.listeners.push(() => {
      window.removeEventListener("popstate", handleRoutingEvent);
    });
  }

  // 更新 URL
  ensureURL() {
    if (getLocation() !== this.current.fullPath) {
      window.history.pushState(
        { key: Date.now().toFixed(3) },
        "",
        this.current.fullPath
      );
    }
  }

  // 路由跳转方法
  push(location, onComplete) {
    this.transitionTo(location, onComplete);
  }

  // 路由前进后退
  go(n) {
    window.history.go(n);
  }

  // 跳转到指定 URL，替换 history 栈中最后一个记录
  replace(location, onComplete) {
    this.transitionTo(location, route => {
      window.history.replaceState(window.history.state, "", route.fullPath);
      onComplete && onComplete(route);
    });
  }

  // 获取当前路由
  getCurrentLocation() {
    return getLocation();
  }
}

// 获取 location HTML5 路由
function getLocation() {
  let path = window.location.pathname;
  return path;
}
