<template>
  <div class="mask">
    <div class="confrim" v-if="text" :class="type">
      <p>{{ text }}</p>
      <div class="action">
        <button @click="cancel" v-text="cancelText"></button>
        <button @click="confirm" v-text="confirmText"></button>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps(["text", "type", "confirm", "cancel", "confirmText", "cancelText"]);
</script>

<style lang="less" scoped>
.mask {
  background-color: rgba(0, 0, 0, 0.7);
  width: 100vw;
  height: 100vh;
  z-index: 1100;
  position: fixed;
  top: 0;
}
@keyframes down {
  0% {
    top: 0;
  }
  10% {
    top: 30vh;
  }
  100% {
    top: 30vh;
  }
}
.confrim {
  position: fixed;
  z-index: 100;
  top: 30vh;
  left: 50%;
  min-width: 300px;
  transform: translate(-50%, -50%);
  padding: 1rem 1rem;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 5px;
  box-shadow: 0px 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 2px 2px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 1px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
  animation: down 3s ease;
  .action {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    grid-gap: 1rem;
  }
}
.confrim.success {
  border-left: 5px solid rgb(var(--v-theme-primary));
}
.confrim.warn {
  border-left: 5px solid rgb(var(--v-theme-warning));
}
</style>
