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
      <v-btn value="group" href="https://zhidayingxiao.cn/to/06g6xX">
        <v-icon icon="mdi-wechat"></v-icon>
        <span> 微信群 </span>
      </v-btn>
    </v-bottom-navigation>
  </template>
  <template v-else>
    <v-navigation-drawer class="drawer" width="130">
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
      <div class="bar-footer">
        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item :title="surplusText"></v-list-item>
          <!-- <v-list-item
            prepend-icon="mdi-wechat"
            title="微信群"
            value="group"
            href="https://zhidayingxiao.cn/to/06g6xX"
          ></v-list-item> -->
        </v-list>
      </div>
    </v-navigation-drawer>
    <v-navigation-drawer class="drawer" width="260">
      <slot></slot>
    </v-navigation-drawer>
  </template>
</template>
<script setup>
import { useDisplay } from "vuetify";
import { useRoute } from "vue-router";
import { inject } from "vue";
const route = useRoute();
const { mobile } = useDisplay();

const bars = [
  { icon: "mdi-message-outline", name: "对话", value: "/chats" },
  { icon: "mdi-star-outline", name: "收藏", value: "/prompts" },
  { icon: "mdi-compass-outline", name: "应用", value: "/app" },
];

const surplusText = inject("surplusText");
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
