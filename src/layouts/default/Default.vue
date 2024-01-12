<template>
  <v-app>
    <!-- <default-bar :barBtns="store.barBtns" /> -->
    <app-side-bar :comp="sideComp" />
    <app-view :comp="mainComp" />
  </v-app>
</template>

<script setup>
import appView from "./AppView.vue";
import AppSideBar from "./AppSideBar.vue";
import { useRoute } from "vue-router";
import { computed, watch } from "vue";
import { useDisplay } from "vuetify";
const route = useRoute();
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

watch(sideCom, () => (mainCom = undefined));
</script>
