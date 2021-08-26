/*
 * @path: src/hello-vue-router/index.js
 * @Description: 入口文件 VueRouter类
 */
import { install } from "./install";
import { createMatcher } from "./create-matcher";
import { HashHistory } from "./history/hash";
import { HTML5History } from "./history/html5";
import { AbstractHistory } from "./history/abstract";
const inBrowser = typeof window !== "undefined";

export default class VueRouter {
  constructor(options) {
    // 路由配置
    this.options = options;
    // 创建路由 matcher 对象，传入 routes 路由配置列表及 VueRouter 实例，主要负责 url 匹配
    this.matcher = createMatcher(options.routes);

    let mode = options.mode || "hash";
    // 支持所有 JavaScript 运行环境，非浏览器环境强制使用 abstract 模式，主要用于 SSR
    if (!inBrowser) {
      mode = "abstract";
    }
    this.mode = mode;

    // 根据不同 mode，实例化不同 history 实例
    switch (mode) {
      case "history":
        this.history = new HTML5History(this);
        break;
      case "hash":
        this.history = new HashHistory(this);
        break;
      case "abstract":
        this.history = new AbstractHistory(this);
        break;
      default:
        if (process.env.NODE_ENV !== "production") {
          throw new Error(`[vue-router] invalid mode: ${mode}`);
        }
    }
  }

  // 匹配路由
  match(location) {
    return this.matcher.match(location);
  }

  // 获取所有活跃的路由记录列表
  getRoutes() {
    return this.matcher.getRoutes();
  }

  // 动态添加路由（添加一条新路由规则）
  addRoute(parentOrRoute, route) {
    this.matcher.addRoute(parentOrRoute, route);
  }

  // 动态添加路由（参数必须是一个符合 routes 选项要求的数组）
  addRoutes(routes) {
    this.matcher.addRoutes(routes);
  }
}

VueRouter.install = install;
