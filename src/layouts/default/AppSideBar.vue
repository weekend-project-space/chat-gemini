<template>
  <template v-if="mobile">
    <slot></slot>
    <v-bottom-navigation v-if="route.matched.length < 3" grow>
      <v-btn
        v-for="bar in bars"
        :value="bar.icon"
        :key="bar.icon"
        :to="bar.value"
      >
        <v-icon :icon="bar.icon"></v-icon>
        <span v-text="bar.name"></span>
      </v-btn>
      <!-- <v-btn value="setting" to="/settings">
        <v-icon icon="mdi-cog-outline"></v-icon>
        <span> settings </span>
      </v-btn> -->
    </v-bottom-navigation>
  </template>
  <template v-else>
    <v-navigation-drawer class="drawer" theme="dark" width="130">
      <!-- <v-tooltip text="伊娃">
        <template v-slot:activator="{ props }">
          <v-list v-bind="props" nav>
            <v-avatar icon="mdi-link" color="secondary"></v-avatar>
          </v-list>
        </template>
      </v-tooltip>

      <v-divider></v-divider> -->

      <v-list density="compact" nav>
        <v-list-item
          v-for="bar in bars"
          :key="bar.icon"
          :prepend-icon="bar.icon"
          :title="bar.name"
          :value="bar.value"
          :to="bar.value"
        ></v-list-item>
      </v-list>
      <!-- <div class="bar-footer">
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-cog-outline"
            title="settings"
            value="settings"
            to="/settings"
          ></v-list-item>
        </v-list>
      </div> -->
    </v-navigation-drawer>
    <v-navigation-drawer class="drawer" theme="dark" width="260">
      <slot></slot>
    </v-navigation-drawer>
  </template>
</template>
<script setup>
import { useDisplay } from "vuetify";
import { useRoute } from "vue-router";
const route = useRoute();
const { mobile } = useDisplay();
const bars = [
  { icon: "mdi-message-outline", name: "对话", value: "/chats" },
  { icon: "mdi-pound-box-outline", name: "收藏", value: "/prompts" },
  { icon: "mdi-compass-outline", name: "发现", value: "/discover" },
];
</script>
<style lang="less" scoped>
.bar-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
<style lang="less">
.drawer .v-navigation-drawer__content {
  &::-webkit-scrollbar {
    width: 8px;
    height: 20px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(var(--v-theme-on-background), 0.3);
  }
}
</style>
