/*
 * @path: src/hello-vue-router/components/view.js
 * @Description: router-view
 */

export default {
  name: "RouterView",
  functional: true, // 函数式组件
  render(h) {
    return h("div", "This is RouterPage");
  }
};
