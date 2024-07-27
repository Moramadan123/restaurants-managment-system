import { createStore } from "vuex";
import router from "../router/index";
import axios from "axios";

const state = {
  isUserLoggedin: false,
  loggedInUserId: "",
  numOfcategories: 0,
  listofCategories: [],
  listofLocations: [],
  listofitems: [],
};

const getters = {};

const mutations = {
  redirectTo(state, payload) {
    router.push({ name: payload });
  },
  isLoggedinuser(state) {
    let user = localStorage.getItem("user-info");
    if (user) {
      state.isUserLoggedin = true;
      state.loggedInUserId = JSON.parse(user).id;
    } else {
      state.isUserLoggedin = false;
    }
  },
  setCategories(state, categories) {
    state.listofCategories = categories;
    state.numOfcategories = categories.length;
  },
  async displayAllCategories(state, payload) {
    try {
      console.log(
        `Fetching categories for userId: ${payload.userIdIs} and locationId: ${payload.locationIdIs}`
      );
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${payload.userIdIs}&locationId=${payload.locationIdIs}`
      );
      if (result.status === 200) {
        state.listofCategories = result.data.filter(
          (cat) => cat.locationId === parseInt(payload.locationIdIs)
        );
        state.numOfcategories = state.listofCategories.length;
      } else {
        console.error(`Unexpected response status: ${result.status}`);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  },
  async canuseraccessthislocation(state, payload) {
    try {
      console.log(
        `Checking access for userId: ${payload.userIdIs} and locationId: ${payload.locationIdIs}`
      );
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${payload.userIdIs}&id=${payload.locationIdIs}`
      );
      if (result.status === 200) {
        state.listofLocations = result.data;
        if (state.listofLocations.length !== 1) {
          this.commit("redirectTo", payload.redirectToPage);
        }
      } else {
        console.error(`Unexpected response status: ${result.status}`);
      }
    } catch (error) {
      console.error("Error checking access:", error);
    }
  },
  async canuseraccessthiscategory(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${payload.userIdIs}&locationId=${payload.locationIdIs}&id=${payload.catIdIs}`
    );
    if (result.status === 200) {
      state.listofLocations = result.data;
      if (state.listofLocations.length !== 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    } else {
      console.error(`Unexpected response status: ${result.status}`);
    }
  },
  async canuseraccessthisitem(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/items?userId=${payload.userIdIs}&locationId=${payload.locationIdIs}&id=${payload.itemIdIs}`
    );
    if (result.status === 200) {
      state.listofitems = result.data;
      if (state.listofitems.length < 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    } else {
      console.error(`Unexpected response status: ${result.status}`);
    }
  },
};

const actions = {
  redirectTo({ commit }, payload) {
    commit("redirectTo", payload.val);
  },
};

export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {},
});
