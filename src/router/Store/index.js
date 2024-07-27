import { createStore } from "vuex";
import router from "../index";

const state = {};
const getters = {};
const mutations = {};
const actions = {
  redirectTo(payload) {
    router.push({ name: payload.val });
  },
};

export default createStore({
  state,
  mutations,
  getters,
  actions,
  modules: {},
});
