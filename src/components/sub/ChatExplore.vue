<template>
  <div class="explore-warp">
    <v-chip-group
      @update:modelValue="(v) => emit('update:modelValue', v)"
      column
    >
      <v-chip
        v-for="type in types"
        filter
        variant="plain"
        :key="type"
        :value="type"
      >
        我是{{ type.name }}
      </v-chip>
    </v-chip-group>
    <div class="explore-list">
      <div
        v-for="item in items"
        :key="item.act || item.name"
        class="explore"
        @click="emit('click', item)"
      >
        <div>
          <p>{{ item.act || item.name }}</p>
          <small>{{ item.desc }}</small>
        </div>
        <div class="icon">
          <v-icon>mdi-fountain-pen-tip</v-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps(["items", "types", "modelValue"]);
const emit = defineEmits(["update:modelValue", "click"]);
</script>
<style lang="less" scoped>
@keyframes up {
  0% {
    transform: translateY(3rem);
    opacity: 0;
  }
  10% {
    transform: translateY(0);
    opacity: 0.3;
  }
  36% {
    opacity: 1;
    bottom: 0;
  }
  100% {
    bottom: 0;
  }
}
.explore-warp {
  position: sticky;
  margin-top: 36vh;
  bottom: 0rem;
  padding-bottom: 1rem;
  animation: up 3s;
  background-color: rgb(var(--v-theme-background));
  z-index: 10;
}
.explore-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.5rem;
  > * {
    font-size: 0.8rem;
    display: grid;
    grid-template-columns: 1fr 1rem;
    align-items: center;
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding: 0.5rem 1rem;
    border-radius: 0.8rem;
    small {
      opacity: 0.5;
    }
    &:hover {
      background: rgb(var(--v-theme-code));
      cursor: pointer;
      .v-icon {
        display: block;
      }
    }
    .v-icon {
      display: none;
    }
  }
}
</style>
