<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <span class="mr-2">How Long To Beat Game Pass</span>

      <v-spacer></v-spacer>

      {{ GamePassGames.length + " / " + totalGames + " games loaded" }}
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import * as howLongToBeat from "./server/client.js";
export default {
  name: "App",

  data: () => ({}),
  mounted() {
    this.getAllGamePassGames();
    window.GetGamePass = () => this.GamePassGames;
  },
  computed: {
    ...mapState(["GamePassGames", "totalGames"]),
  },
  methods: {
    async getAllGamePassGames() {
      let allGamePassIdsLink =
        "https://catalog.gamepass.com/sigls/v2?id=fdd9e2a7-0fee-49f6-ad69-4354098401ff&language=en-us&market=US";
      let eaPlayIdsLink =
        "https://catalog.gamepass.com/sigls/v2?id=b8900d09-a491-44cc-916e-32b5acae621b&language=en-us&market=US";
      let allGamePassJSON = await fetch(allGamePassIdsLink).then((res) => res.json());
      let eaPlayJSON = await fetch(eaPlayIdsLink).then((res) => res.json());
      allGamePassJSON = allGamePassJSON.filter((x) => x.hasOwnProperty("id")).map((x) => x.id);
      eaPlayJSON = eaPlayJSON.filter((x) => x.hasOwnProperty("id")).map((x) => x.id);
      let joinedJSON = [...new Set([...allGamePassJSON, ...eaPlayJSON])];
      let data = await this.fetchGamepassIds(joinedJSON);
      // set this data in the state

      data = data.Products;

      this.$store.commit("setTotalGames", data.length);
      for (let i = 0; i < data.length; i++) {
        const game = data[i];
        let name = game.LocalizedProperties[0].ProductTitle;
        try {
          game.HowLongToBeat = await howLongToBeat.search(name);
        } catch {
          console.warn("Could not find game: " + name);
        }
        this.$store.commit("addGame", game);
      }
      // console.log(data);
    },
    fetchGamepassIds(ids) {
      let link = `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${ids.join(
        ","
      )}&market=US&languages=en-us&MS-CV=DGU1mcuYo0WMMp+F.1`;
      return fetch(link).then((response) => response.json());
    },
  },
};
</script>
