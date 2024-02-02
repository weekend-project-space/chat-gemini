<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
onMounted(() => {
  document.body.removeChild(document.getElementById("loading"));
});
</script>
<style lang="less">
.warp-sm {
  margin: 0 auto;
  max-width: 640px;
  position: relative;
}

:root {
  --v-warp-widht: 760px;
}
</style>
