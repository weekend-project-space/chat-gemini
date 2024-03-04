<template>
  <v-app>
    <v-app-bar height="56" app>
      <v-app-bar-nav-icon @click="show = !show" />
      <img
        src="/logo.png"
        alt=""
        class="ml-2"
        style="widht: 36px; height: 36px"
      />
      <v-toolbar-title>德信AI</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="show" width="320">
      <div class="nav">
        <div>
          <v-list nav>
            <v-list-item
              v-for="item in data"
              :title="item.name"
              :value="item.name"
              :subtitle="item.desc"
              :key="item.key"
              @click="() => (id = item.key)"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" size="small">
                  {{ item.name.substring(0, 1) }}
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </div>
        <div>
          <v-list nav>
            <v-list-item
              v-for="item in data2"
              :title="item.name"
              :value="item.name"
              :subtitle="item.desc"
              :key="item.key"
              @click="goChat(item)"
            >
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-navigation-drawer>

    <v-main>
      <ChatGc
        v-if="current.name"
        :name="current.name"
        :prompt="current.prompt"
      />
      <v-card v-else class="text-center ma-3 pa-8">
        <img src="/logo.png" style="width: 60px" alt="" />
        <div>
          德信AI <br />
          <br />
          <small>请点击右侧选择你要使用的工具</small>
        </div>
      </v-card>
    </v-main>
  </v-app>
</template>
<script setup>
import ChatGc from "@/components/ChatGc.vue";
import { discoverList, discover } from "@/api/discover";
import { nextTick, onMounted, ref } from "vue";
import { computedAsync } from "@vueuse/core";
const show = ref(true);
const data = ref([]);
const id = ref("");
const current = ref({});
onMounted(async () => {
  data.value = await discoverList();
  nextTick(() => {
    document.querySelectorAll(".v-list-item ")[0].click();
  });
});
const data2 = computedAsync(async () => {
  const array = data.value.filter((o) => o.key == id.value);
  if (array.length) {
    const item = array[0];
    return await discover(item.url);
  }
});

async function goChat(item) {
  current.value.name = item.name;
  if (item.hint) {
    const content = `(textarea ${item.hint} = '')(${item.content.replace(
      "[PROMPT]",
      "${" + item.hint + "}"
    )})`;
    current.value.prompt = content;
  } else {
    current.value.prompt = item.content;
  }
}
</script>
<style lang="less" scoped>
.nav {
  display: grid;
  grid-template-columns: 150px auto;
  > div {
    height: calc(100vh - 56px);
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
