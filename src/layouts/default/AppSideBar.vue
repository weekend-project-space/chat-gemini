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
      <v-btn value="group" to="/user">
        <v-icon icon="mdi-account-outline"></v-icon>
        <span> 我的 </span>
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
          <div class="d-flex justify-space-between align-center mb-1 mt-2">
            <p class="font-sm" v-text="surplusText"></p>
            <v-dialog max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  color="primary"
                  size="small"
                  v-bind="activatorProps"
                  text="充值"
                  variant="text"
                ></v-btn>
              </template>

              <template v-slot:default>
                <v-card title="购买VIP">
                  <v-img class="mt-3" src="/sl.jpg"></v-img>
                  <v-card-text>
                    <div class="d-flex mt-3 mb-5">
                      <v-btn
                        text="卡密兑换"
                        color="primary"
                        to="/setup"
                      ></v-btn>
                      <v-spacer></v-spacer>

                      <v-btn
                        text="去购买"
                        color="primary"
                        href="https://item.taobao.com/item.htm?ft=t&id=771495870230&spm=a21dvs.23580594.0.0.47b33d0dHMMXEU"
                      ></v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </template>
            </v-dialog>
          </div>
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

  { icon: "mdi-compass-outline", name: "应用", value: "/app" },

  { icon: "mdi-star-outline", name: "收藏", value: "/prompts" },
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
