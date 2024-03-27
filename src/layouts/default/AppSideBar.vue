<template>
  <template v-if="mobile">
    <slot></slot>
    <div class="quicktext">
      <autotextarea
        v-model="value"
        placeholder="发送消息给极速ai"
        @keyup.enter="quickEnter"
      />
      <v-btn
        :disabled="value.length == 0"
        size="sm"
        icon="mdi-arrow-up-box"
        variant="text"
        @click="quickEnter"
      ></v-btn>
    </div>
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
      <!-- <v-list nav> -->
      <div v-if="domain.includes('jisu')" class="mx-auto text-center my-3">
        <v-avatar size="large" image="/logo.png" loading></v-avatar>
        <h5 class="mt-3">极速AI</h5>
      </div>
      <!-- </v-list> -->

      <!-- <v-divider></v-divider> -->

      <v-list nav>
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
import { useRoute, useRouter } from "vue-router";
import { inject, ref } from "vue";
import { createChat } from "@/service/chatService";
const route = useRoute();
const router = useRouter();
const { mobile } = useDisplay();
const value = ref("");

const bars = [
  { icon: "mdi-message-outline", name: "对话", value: "/chats" },

  { icon: "mdi-pencil-box-outline", name: "创作", value: "/app" },

  { icon: "mdi-star-outline", name: "收藏", value: "/prompts" },
];

const surplusText = inject("surplusText");

const domain = window.location.host;

function quickEnter() {
  const text = value.value;
  const content =
    text.lastIndexOf("\n") === text.length - 1 ? text.slice(0, -1) : text;
  goChat(content);

  // value.value = "";
}

async function goChat(content) {
  sessionStorage.setItem("sendable", "1");
  const chatId = await createChat([
    {
      promptId: "quick" + new Date().getTime(),
      name: content,
      role: "user",
      content,
    },
  ]);
  router.push("/chats/" + chatId);
}
</script>
<style lang="less" scoped>
.bar-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.quicktext {
  position: fixed;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: flex-end;
  bottom: 56px;
  width: calc(100% - 1rem);
  z-index: 100;
  margin: 0.5rem;
  background: rgb(var(--v-theme-background));
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0px 1px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
  textarea {
    width: 100%;
  }
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
