<template>
  <v-main>
    <component :is="comp" />
  </v-main>
</template>
<script setup>
defineProps(["comp"]);
</script>
