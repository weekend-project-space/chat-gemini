<template>
  <div class="warp">
    <v-card flat>
      <v-list density="compact" nav>
        <div class="mb-3">
          <div class="justify-between">
            <span>发现</span> <span>{{ name }}</span>
          </div>
          <input
            class="search-input mt-1"
            type="text"
            placeholder="search"
            v-model="value"
          />
        </div>
        <v-list-item
          v-for="item in d"
          :title="item[actKey]"
          :value="item[promptKey]"
          :key="item[actKey]"
          :subtitle="item[promptKey]"
          @click="goChat(item)"
        >
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>
<script setup>
import { discover, discoverList } from "@/api/discover";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createChat } from "@/service/chatService";
const route = useRoute();
const router = useRouter();
const data = ref([]);
const value = ref("");
const actKey = ref("act");
const promptKey = ref("prompt");
const name = ref("");
let hint = false;
onMounted(loadData);
watch(route, loadData);
async function loadData() {
  const array = (await discoverList()).filter((o) => o.key == route.params.id);
  if (array.length) {
    const item = array[0];
    data.value = await discover(item.url);
    actKey.value = item.act || "act";
    promptKey.value = item.prompt || "prompt";
    hint = item.hint || false;
    name.value = item.name;
  }
}
const d = computed(() => {
  const r = data.value.filter(
    (o) =>
      o[promptKey.value].toLowerCase().indexOf(value.value.toLowerCase()) >
        -1 ||
      o[actKey.value].toLowerCase().indexOf(value.value.toLowerCase()) > -1
  );
  return r.slice(0, r.length > 60 ? 60 : r.length);
});
// function toUrl(item) {
//   return `/prompts/setup?name=${item[actKey.value]}&prompt=${
//     item[promptKey.value]
//   }`;
// }
async function goChat(item) {
  let content = item[promptKey.value];
  if (hint) {
    content = `(textarea ${item.hint} = '')(${item.content.replace(
      "[PROMPT]",
      "${" + item.hint + "}"
    )})`;
  }
  const chatId = await createChat([
    {
      promptId: item[actKey.value],
      name: item[actKey.value],
      role: "user",
      content,
    },
  ]);
  router.push("/chats/" + chatId);
}
</script>
<style lang="less" scoped>
.search-input {
  width: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 1.2rem;
  height: 2.5rem;
  line-height: 2.5rem;
  padding-inline-start: 1rem;
}
.justify-between {
  display: flex;
  justify-content: space-between;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  display: flex;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
  margin: 0.5rem 0.2rem;
}
.warp .v-list--nav {
  padding-inline: 0;
}
</style>
