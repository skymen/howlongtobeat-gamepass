<template>
  <div>
    <v-app-bar fixed style="top: 64px" color="secondary" dark>
      <!-- search bar -->
      <v-text-field
        v-model="search"
        label="Search"
        hide-details
        prepend-inner-icon="mdi-magnify"
        @input="updateSearch"
        style="margin-top: 10px"
      ></v-text-field>
      <v-divider vertical></v-divider>
      <!-- number input for main hours -->
      <v-text-field
        v-model="mainHoursMin"
        label="Main Min"
        hide-details
        prepend-inner-icon="mdi-access-time"
        @input="updateSearch"
        style="margin-top: 10px"
        type="number"
      ></v-text-field>
      <v-divider vertical></v-divider>
      <v-text-field
        v-model="mainHoursMax"
        label="Main Max"
        hide-details
        prepend-inner-icon="mdi-access-time"
        @input="updateSearch"
        style="margin-top: 10px"
        type="number"
      ></v-text-field>
      <v-divider vertical></v-divider>
      <!-- number input for mainExtra hours -->
      <v-text-field
        v-model="mainExtraHoursMin"
        label="Extra Min"
        hide-details
        prepend-inner-icon="mdi-access-time"
        @input="updateSearch"
        style="margin-top: 10px"
        type="number"
      ></v-text-field>
      <v-divider vertical></v-divider>
      <v-text-field
        v-model="mainExtraHoursMax"
        label="Extra Max"
        hide-details
        prepend-inner-icon="mdi-access-time"
        @input="updateSearch"
        style="margin-top: 10px"
        type="number"
      ></v-text-field>
      <v-divider vertical></v-divider>
      <!-- number input for completionist hours -->
      <v-text-field
        v-model="completionistHoursMin"
        label="Completionist Min"
        hide-details
        prepend-inner-icon="mdi-access-time"
        @input="updateSearch"
        style="margin-top: 10px"
        type="number"
      ></v-text-field>
      <v-divider vertical></v-divider>
      <v-text-field
        v-model="completionistHoursMax"
        label="Completionist Max"
        hide-details
        prepend-inner-icon="mdi-access-time"
        @input="updateSearch"
        style="margin-top: 10px; margin-right: 10px"
        type="number"
      ></v-text-field>
      <!-- checkbox for "add unsure games" -->
      <v-checkbox
        v-model="addUnsureGames"
        label="Add unsure games"
        hide-details
        @click="updateSearch"
      ></v-checkbox>
      <!-- checkbox for "add unkown games" -->
      <v-checkbox
        v-model="addUnknownGames"
        label="Add unknown games"
        hide-details
        @click="updateSearch"
      ></v-checkbox>
    </v-app-bar>
    <v-layout
      row
      style="
        top: 128px;
        padding-left: 15px;
        margin: 0;
        position: fixed;
        background-color: white;
        width: 100%;
        z-index: 999;
        height: 60px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        display: flex;
      "
    >
      <span style="align-self: center">{{
        "Showing " + FilteredGamePassGames.length + " / " + GamePassGames.length + " games"
      }}</span>
      <!-- sort dropdown -->
      <v-select
        v-model="sortBy"
        :items="sortOptions"
        label="Sort by"
        hide-details
        item-text="text"
        item-value="value"
        prepend-inner-icon="mdi-sort"
        @change="updateSort"
        style="margin-left: 15px; margin-right: 15px"
      ></v-select>
      <!-- sort direction dropdown -->
      <v-select
        v-model="sortDirection"
        :items="sortDirectionOptions"
        label="Sort direction"
        hide-details
        item-text="text"
        item-value="value"
        prepend-inner-icon="mdi-sort"
        @change="updateSort"
        style="margin-right: 15px"
      ></v-select>
    </v-layout>

    <v-layout
      row
      wrap
      style="
        width: 100%;
        align-items: center;
        justify-items: center;
        justify-content: space-around;
        margin: 0;
        margin-top: 120px;
      "
    >
      <v-card
        width="300px"
        height="400px"
        style="margin: 20px 10px"
        v-for="game in FilteredGamePassGames"
        :key="game.ProductId"
      >
        <v-card-title style="height: 100px">
          <div class="headline1">
            <span>{{ game.LocalizedProperties[0].ProductTitle }}</span>
            <br />
            <!-- <span class="subtitle">{{ game.LocalizedProperties[0].DeveloperName }}</span> -->
          </div>
        </v-card-title>

        <v-img
          width="300px"
          height="200px"
          :src="game.LocalizedProperties[0].Images[0].Uri"
          :alt="game.LocalizedProperties[0].Images[0].ImagePurpose"
        ></v-img>
        <v-layout
          row
          :style="`height: 100px;
          margin: 0;
          align-items: center;
          justify-items: center;
          text-align: center;
          ${game.HowLongToBeat.unsure ? 'background-color: rgba(255,200,200,1);' : ''}`"
        >
          <div style="flex: 0.6">
            Main:<br />
            {{ game.HowLongToBeat.results[0]?.gameplayMain ?? "?" }}
          </div>

          <v-divider vertical></v-divider>
          <div
            style="
              flex: 1;
              background-color: rgba(0, 0, 0, 0.06);
              height: 100%;
              vertical-align: middle;
              align-items: center;
              justify-content: center;
              display: flex;
            "
          >
            Main + extra:<br />
            {{ game.HowLongToBeat.results[0]?.gameplayMainExtra ?? "?" }}
          </div>

          <v-divider vertical></v-divider>
          <div
            style="
              flex: 1;
              background-color: rgba(0, 0, 0, 0.12);
              height: 100%;
              vertical-align: middle;
              align-items: center;
              justify-content: center;
              display: flex;
            "
          >
            Completionist:<br />
            {{ game.HowLongToBeat.results[0]?.gameplayCompletionist ?? "?" }}
          </div>
        </v-layout>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
  components: {},
  computed: {
    ...mapState(["GamePassGames"]),
  },
  data() {
    return {
      search: "",
      mainHoursMin: 2,
      mainExtraHoursMin: 2,
      completionistHoursMin: 2,
      mainHoursMax: 10,
      mainExtraHoursMax: 20,
      completionistHoursMax: 99999,
      addUnsureGames: true,
      addUnknownGames: true,
      FilteredGamePassGames: [],
      sortBy: "title",
      sortDirection: "asc",
      sortOptions: [
        { text: "Title", value: "title" },
        // { text: "Developer", value: "developer" },
        { text: "Main hours", value: "mainHours" },
        { text: "Main extra hours", value: "mainExtraHours" },
        { text: "Completionist hours", value: "completionistHours" },
      ],
      sortDirectionOptions: [
        { text: "Ascending", value: "asc" },
        { text: "Descending", value: "desc" },
      ],
    };
  },
  mounted() {
    this.updateSearch();
  },
  methods: {
    updateSearch() {
      this.FilteredGamePassGames = this.GamePassGames.filter((game) => {
        let search = this.search.toLowerCase();
        let title = game.LocalizedProperties[0].ProductTitle.toLowerCase();
        let developer = game.LocalizedProperties[0].DeveloperName.toLowerCase();
        let main = game.HowLongToBeat.results[0]?.gameplayMain ?? "?";
        let mainExtra = game.HowLongToBeat.results[0]?.gameplayMainExtra ?? "?";
        let completionist = game.HowLongToBeat.results[0]?.gameplayCompletionist ?? "?";
        let unknown = main === "?" || mainExtra === "?" || completionist === "?";
        let unsure = game.HowLongToBeat.unsure;
        if (!this.addUnknownGames && unknown) return false;
        if (!this.addUnsureGames && unsure) return false;
        if (search.trim() !== "" && !title.includes(search) /*  && !developer.includes(search) */)
          return false;
        if (main > this.mainHoursMax || main < this.mainHoursMin) return false;
        if (mainExtra > this.mainExtraHoursMax || mainExtra < this.mainExtraHoursMin) return false;
        if (
          completionist > this.completionistHoursMax ||
          completionist < this.completionistHoursMin
        )
          return false;
        return true;
      });
      this.updateSort();
    },
    updateSort() {
      this.FilteredGamePassGames.sort((a, b) => {
        let sortBy = this.sortBy;
        let sortDirection = this.sortDirection;
        if (sortBy === "title") {
          if (sortDirection === "asc")
            return a.LocalizedProperties[0].ProductTitle.localeCompare(
              b.LocalizedProperties[0].ProductTitle
            );
          else
            return b.LocalizedProperties[0].ProductTitle.localeCompare(
              a.LocalizedProperties[0].ProductTitle
            );
        } else if (sortBy === "developer") {
          if (sortDirection === "asc")
            return a.LocalizedProperties[0].DeveloperName.localeCompare(
              b.LocalizedProperties[0].DeveloperName
            );
          else
            return b.LocalizedProperties[0].DeveloperName.localeCompare(
              a.LocalizedProperties[0].DeveloperName
            );
        } else if (sortBy === "mainHours") {
          if (sortDirection === "asc")
            return (
              a.HowLongToBeat.results[0]?.gameplayMain - b.HowLongToBeat.results[0]?.gameplayMain
            );
          else
            return (
              b.HowLongToBeat.results[0]?.gameplayMain - a.HowLongToBeat.results[0]?.gameplayMain
            );
        } else if (sortBy === "mainExtraHours") {
          if (sortDirection === "asc")
            return (
              a.HowLongToBeat.results[0]?.gameplayMainExtra -
              b.HowLongToBeat.results[0]?.gameplayMainExtra
            );
          else
            return (
              b.HowLongToBeat.results[0]?.gameplayMainExtra -
              a.HowLongToBeat.results[0]?.gameplayMainExtra
            );
        } else if (sortBy === "completionistHours") {
          if (sortDirection === "asc")
            return (
              a.HowLongToBeat.results[0]?.gameplayCompletionist -
              b.HowLongToBeat.results[0]?.gameplayCompletionist
            );
          else
            return (
              b.HowLongToBeat.results[0]?.gameplayCompletionist -
              a.HowLongToBeat.results[0]?.gameplayCompletionist
            );
        } else {
          return 0;
        }
      });
    },
  },
};
</script>

<style>
.headline1 {
  font-size: 1.1rem !important;
  text-align: center !important;
  width: 100%;
  font-weight: bold;
  word-break: initial;
}

.subtitle {
  font-size: 0.6rem;
  word-break: initial;
}
</style>
