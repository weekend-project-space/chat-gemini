<template>
  <v-main>
    <v-tooltip v-if="!mobile" :text="sidebar ? '关闭侧边栏' : '打开侧边栏'">
      <template v-slot:activator="{ props }">
        <div class="bar-warp" v-bind="props" @click="toggleSideBar">
          <div :class="sidebar ? 'bar' : 'bar-out'"></div>
        </div>
      </template>
    </v-tooltip>
    <component :is="comp" v-bind="route.params" />
  </v-main>
</template>
<script setup>
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
const props = defineProps(["comp", "sidebar"]);
const emit = defineEmits(["update:sidebar"]);
const route = useRoute();
const { mobile } = useDisplay();

function toggleSideBar() {
  emit("update:sidebar", !props.sidebar);
}
</script>
<style lang="less" scoped>
.bar-warp {
  position: absolute;
  top: calc(50vh - 2.6rem);
  padding: 1rem 0.5rem 1rem 1rem;
  .bar {
    background: #999;
    width: 4px;
    height: 1.2rem;
    border-radius: 2px;
  }
  .bar-out {
    background: #999;
    width: 8px;
    height: 1.2rem;
    clip-path: polygon(
      0% 0%,
      50% 0%,
      100% 45%,
      100% 55%,
      50% 100%,
      0% 100%,
      50% 50%
    );
  }
  &:hover .bar-out {
    background: #666;
  }
  &:hover .bar {
    background: #666;
    width: 8px;
    clip-path: polygon(
      0% 55%,
      0% 45%,
      50% 0%,
      100% 0%,
      50% 50%,
      100% 100%,
      50% 100%
    );
  }
}
</style>
