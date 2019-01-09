import Vue from "vue";
import Vuex from "vuex";

// import * as cookie from "@/utils/cookie";

import * as mutations from "./mutations";
import * as actions from "./actions";
import * as getters from "./getters";

Vue.use(Vuex);

const state = {
  isLoading: false
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
