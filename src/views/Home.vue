<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>虚拟智者</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="setupDialog = !setupDialog">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon @click="dialog = !dialog">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs v-model="tab">
          <v-tab v-for="item in items" :key="item.name" :value="item.name">
            {{ item.name }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer">
      <v-list density="compact" nav>
        <v-list-subheader>好友</v-list-subheader>
        <v-list-item
          v-for="item in prompts"
          :title="item.name"
          :value="item.name"
          :key="item.name"
          @click="chat(item)"
        >
          <template v-slot:prepend>
            <v-avatar color="primary" size="small">
              {{ item.name.substring(0, 1) }}
            </v-avatar>
          </template></v-list-item
        >
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-window v-model="tab">
        <v-window-item
          v-for="item in items"
          :key="item.name"
          :value="item.name"
        >
          <Chat :prompt="item.prompt" :name="item.name" />
        </v-window-item>
      </v-window>
    </v-main>
    <v-dialog v-model="dialog" max-width="640">
      <v-card>
        <v-card-title class="text-h5"> 设置 </v-card-title>
        <v-card-text>
          <v-text-field label="geminiApi" v-model="geminiApi"></v-text-field>
          <v-text-field label="geminiKey" v-model="geminiKey"></v-text-field>
          <a href="https://makersuite.google.com/app/apikey" target="_blank"
            >获取apiKey</a
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="ok"> 确定 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="setupDialog" max-width="640">
      <v-card>
        <v-card-title>
          <div class="d-flex between">
            <div class="d-flex align-center">
              <v-icon>mdi-magnify</v-icon> 查找
            </div>
            <v-btn
              icon="mdi-close"
              variant="text"
              @click="setupDialog = false"
            ></v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <Setup v-model="prompts" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, watch } from "vue";
import Chat from "@/components/Chat.vue";
import Setup from "@/components/Setup.vue";
const tab = ref("");
const items = ref([]);
const drawer = ref(true);
const dialog = ref(false);
const setupDialog = ref(false);

const vwmansStr = localStorage.getItem("vwmans");
const prompts = ref(
  vwmansStr
    ? JSON.parse(vwmansStr)
    : [
        {
          name: "孔子",
          prompt: "现在你是孔子,请用200字介绍一下自己和所处时代及主张及成就",
        },
        {
          name: "老子",
          prompt: "现在你是老子,请用200字介绍一下自己和所处时代及主张及成就",
        },
        {
          name: "釋迦牟尼",
          prompt:
            "现在你是釋迦牟尼,请用200字介绍一下自己和所处时代及主张及成就",
        },
        {
          name: "杨朱",
          prompt: "现在你是杨朱,请用200字介绍一下自己和所处时代及主张及成就",
        },
        {
          name: "墨子",
          prompt: "现在你是墨子,请用200字介绍一下自己和所处时代及主张及成就",
        },
      ]
);

const geminiKey = ref(localStorage.getItem("geminiKey"));
const geminiApi = ref(
  localStorage.getItem("geminiApi") ||
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="
);
function chat(item) {
  if (!items.value.filter((i) => i.name == item.name).length) {
    items.value.push(item);
  }
  tab.value = item.name;
}
function ok() {
  localStorage.setItem("geminiKey", geminiKey.value);
  localStorage.setItem("geminiApi", geminiApi.value);
  dialog.value = false;
}
watch(prompts, (v) => {
  localStorage.setItem("vwmans", JSON.stringify(v));
});
</script>
<style lang="less" scoped>
.between {
  justify-content: space-between;
}
</style>
