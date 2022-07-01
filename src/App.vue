<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <span class="mr-2">Game Pass scraper</span>

      <v-spacer></v-spacer>

      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
let hltb = require("howlongtobeat");
let hltbService = new hltb.HowLongToBeatService();
export default {
  name: "App",

  data: () => ({}),
  mounted() {
    this.getAllGamePassGames();
  },
  methods: {
    async getAllGamePassGames() {
      let allGamePassIdsLink =
        "https://catalog.gamepass.com/sigls/v2?id=fdd9e2a7-0fee-49f6-ad69-4354098401ff&language=en-us&market=US";
      let allGamePassJSON = await fetch(allGamePassIdsLink).then((res) => res.json());
      allGamePassJSON = allGamePassJSON.filter((x) => x.hasOwnProperty("id")).map((x) => x.id);
      let data = await this.fetchGamepassIds(allGamePassJSON);
      // set this data in the state
      console.log(data);

      data = data.Products;

      // for (let i = 0; i < data.length; i++) {
      //   const game = data[i];
      //   let name =
      //     game.LocalizedProperties[0].ShortTitle || game.LocalizedProperties[0].ProductTitle;
      //   game.HowLongToBeat = await hltbService.search(name);
      // }

      this.$store.commit("setGamePassData", data);
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
