import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    GamePassGames: [],
  },
  mutations: {
    setGamePassData(state, payload) {
      state.GamePassGames = payload;
    },
  },
  actions: {},
  modules: {},
});
