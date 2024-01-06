<template>
  <v-app>
    <default-bar :barBtns="store.barBtns" />
    <default-view :comp="mainComp" />
    <AppSideBar :comp="sideComp" />
  </v-app>
</template>

<script setup>
import DefaultBar from "./AppBar.vue";
import DefaultView from "./View.vue";
import AppSideBar from "./AppSideBar.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useAppStore } from "@/store/app";
import { useDisplay } from "vuetify";
const route = useRoute();
const store = useAppStore();
const { mobile } = useDisplay();

let sideCom = undefined;

let mainCom = undefined;

const sideComp = computed(() => {
  const comp =
    route.meta.index &&
    route.matched.length > 1 &&
    route.matched[1].components.default;
  sideCom = comp ? comp : sideCom;
  return sideCom;
});

const mainComp = computed(() => {
  const comp =
    ((!route.meta.index && route.matched.length > 1) || mobile.value) &&
    route.matched[1].components.default;
  mainCom = comp ? comp : mainCom;
  return mainCom;
});
</script>
