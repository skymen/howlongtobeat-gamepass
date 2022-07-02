import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    GamePassGames: [],
    totalGames: 0,
  },
  mutations: {
    addGame(state, payload) {
      state.GamePassGames = [...state.GamePassGames, payload];
    },
    setTotalGames(state, payload) {
      state.totalGames = payload;
    },
  },
  actions: {},
  modules: {},
});
