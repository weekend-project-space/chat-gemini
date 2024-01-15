<template>
  <app-side-bar v-if="mobile ? route.matched.length < 3 : showSidebar">
    <slot></slot>
  </app-side-bar>
  <app-view v-model:sidebar="showSidebar">
    <router-view></router-view>
  </app-view>
</template>
<script setup>
import appView from "./AppView.vue";
import AppSideBar from "./AppSideBar.vue";
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { useRoute } from "vue-router";
const route = useRoute();
const { mobile } = useDisplay();

const showSidebar = ref(true);
</script>
