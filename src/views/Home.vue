<template>
  <v-layout row wrap style="width: 100%">
    <v-card width="200px" style="margin: 20px" v-for="game in GamePassGames" :key="game.ProductId">
      <v-card-title>
        <v-card-title-text>
          <div class="headline">
            <span class="title">{{
              game.LocalizedProperties[0].ShortTitle || game.LocalizedProperties[0].ProductTitle
            }}</span>
            <br />
            <span class="subtitle">{{ game.LocalizedProperties[0].DeveloperName }}</span>
          </div>
        </v-card-title-text>
      </v-card-title>

      <v-img
        width="200px"
        height="200px"
        :src="game.LocalizedProperties[0].Images[0].Uri"
        :alt="game.LocalizedProperties[0].Images[0].ImagePurpose"
      ></v-img>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
  components: {},
  computed: {
    ...mapState(["GamePassGames"]),
  },
};
</script>

<style>
.headline {
  font-size: 1.5rem;
  font-weight: bold;
}

.subtitle {
  font-size: 0.8rem;
}

.title {
  font-size: 1.5rem;
}
</style>
