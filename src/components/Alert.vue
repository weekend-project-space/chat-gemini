<template>
  <div class="alert" v-if="text" :class="type" v-text="text"></div>
</template>
<script setup>
defineProps(["text", "type"]);
</script>

<style lang="less" scoped>
@keyframes down {
  0% {
    top: 0;
  }
  3% {
    top: 5vh;
  }
  100% {
    top: 5vh;
  }
}
.alert {
  position: fixed;
  top: 10vh;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.5rem 1rem;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 5px;
  box-shadow: 0px 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 2px 2px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 1px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
  animation: down 5s infinite;
  z-index: 100;
}
.alert.success {
  border-left: 5px solid rgb(var(--v-theme-primary));
}
.alert.warn {
  border-left: 5px solid rgb(var(--v-theme-warning));
}
</style>
