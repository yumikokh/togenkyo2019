import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import globalMixin from "./mixins/globalMixin";

import insertUserAgentAttr from "@/utils/insertUserAgentAttr";

insertUserAgentAttr();

Vue.mixin(globalMixin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
