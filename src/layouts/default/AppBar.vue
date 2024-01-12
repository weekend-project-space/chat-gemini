<template>
  <v-app-bar color="primary" elevation="1">
    <v-app-bar-nav-icon icon="mdi-link"></v-app-bar-nav-icon>
    <v-toolbar-title>伊娃</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      v-for="btn in barBtns"
      icon
      :to="btn.to"
      :href="btn.href"
      :key="btn.to"
    >
      <v-icon :icon="btn.icon"></v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
defineProps(["barBtns"]);
</script>
