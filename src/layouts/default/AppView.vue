<template>
  <v-main>
    <component :is="comp" v-bind="route.params" />
  </v-main>
</template>
<script setup>
import { useRoute } from "vue-router";
defineProps(["comp"]);
const route = useRoute();
</script>
