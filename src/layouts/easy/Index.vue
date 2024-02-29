<template>
  <v-app>
    <v-navigation-drawer width="60">
      <img src="/logo.png" alt="" style="widht: 60px; height: 60px" />
      <h1 class="pa-5">德信AI</h1>
    </v-navigation-drawer>
    <v-navigation-drawer width="160">
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
    </v-navigation-drawer>
    <v-navigation-drawer>
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
    </v-navigation-drawer>
    <v-main>
      <ChatGc
        v-if="current.name"
        class="px-5"
        :name="current.name"
        :prompt="current.prompt"
      />
    </v-main>
  </v-app>
</template>
<script setup>
import ChatGc from "@/components/ChatGc.vue";
import { discoverList, discover } from "@/api/discover";
import { nextTick, onMounted, ref } from "vue";
import { computedAsync } from "@vueuse/core";
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
