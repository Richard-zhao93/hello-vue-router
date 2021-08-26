/*
 * @path: src/hello-vue-router/history/base.js
 * @Description: 路由模式父类
 */
// 导入初始化route对象
import { START } from "../utils/route";

export class History {
  constructor(router) {
    this.router = router;
    // 当前 route 对象
    //     this.current = {};
    // =>  this.current = START;
    this.current = START;
    // 路由监听器数组，存放路由监听销毁方法
    this.listener = [];
  }

  // 启动路由监听
  setupListeners() {}

  // 路由跳转
  transitionTo(location) {
    // 路由匹配，解析 location 匹配到其路由对应的数据对象
    let route = this.router.matcher(location);

    // 更新current
    this.current = route;

    // 跳转成功抛出回调
    onComplete && onComplete(route);

    // 更新URL
    this.ensureURL();
  }

  // 卸载
  teardown() {
    this.listeners.forEach(cleanupListener => {
      cleanupListener();
    });

    this.listeners = [];
    this.current = "";
  }
}
