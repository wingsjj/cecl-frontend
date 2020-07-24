import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    type: "success",
    message: "",
    showMessage: false
  },
  mutations: {
    alert(state, payload) {
      state.message = payload.message;
      state.type = payload.messageType;
      state.showMessage = payload.showMessage;
    },
    removeAlert(state) {
      state.showMessage = false;
    }
  },
  actions: {}
});

export default store;
