/*
 * @path: src/hello-vue-router/create-route-map.js
 * @Description: 生成路由映射
 */

export function createRouteMap(routes, oldPathMap, parentRoute) {
  // let routeMap = Object.create(null); old
  const pathMap = oldPathMap || Object.create(null); // new

  // 递归处理路由记录，最终生成路由映射
  routes.forEach(route => {
    // 生成一个 RouteRecord 并更新 pathMap
    // addRouteRecord(pathMap, route, null) old
    addRouteRecord(pathMap, route, parentRoute); // new

    pathMap[route.path] = route;
  });

  return pathMap;
}

// 添加路由记录
function addRouteRecord(pathMap, route, parent) {
  const { path, name } = route;

  // 生成格式化后的 path(子路由会拼接上父路由的 path)
  const normalizedPath = normalizePath(path, parent);

  // 生成一条路由记录
  const record = {
    path: normalizedPath, // 规范化后的路径
    regex: "", // 利用 path-to-regexp 包生成用来匹配 path 的增强正则对象，用来匹配动态路由（/a/:b）
    components: route.component, // 保存路由组件，省略了命名视图解析
    name,
    parent, // 父路由记录
    redirect: route.redirect, // 重定向路由配置对象
    beforeEnter: route.beforeEnter, // 路由独享的守卫
    meta: route.meta || [], // 元信息
    props: route.props == null ? {} : route.props // 动态路由传参
  };

  // 递归处理子路由情况
  if (route.children) {
    // 遍历生成子路由记录
    route.children.forEach(child => {
      addRouteRecord(pathMap, child, record);
    });
  }

  // 若 pathMap 中不存在当前路径，则添加 pathList 和 pathMap
  if (!pathMap[record.path]) {
    pathMap[record.path] = record;
  }
}

// 规范化路径
function normalizePath(path, parent) {
  // 下标 0 为 / ，则为最外层 path
  if (path[0] === "/") return path;
  // 无父级，则为最外层 path
  if (!parent) return path;
  // 清除 path 中双斜杠中的一个
  return `${parent.path}/${path}`.replace(/\/\//g, "/");
}
