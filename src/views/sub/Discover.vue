<template>
  <div class="warp my-5">
    <!-- <v-card flat>
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
    </v-card> -->
    <div class="mb-5">
      <div class="justify-between">
        <span>创作</span> <span>{{ name }}</span>
      </div>
      <input
        class="search-input mt-1"
        type="text"
        placeholder="搜索"
        v-model="value"
      />
    </div>
    <div>
      <div v-for="a in d" :key="a.name">
        <div for="" class="my-3 justify-between">
          {{ a.name }}
        </div>
        <div class="explore-list">
          <div
            v-for="item in a.data"
            :key="item.act || item.name"
            class="explore"
            @click="goChat(item)"
          >
            <div>
              <p>
                <v-avatar color="primary" size="small" class="mr-3">
                  {{ (item.name || item.act).substring(0, 1) }} </v-avatar
                >{{ item.name || item.act }}
              </p>
              <small>{{ item.desc || "开始对话吧" }}</small>
            </div>
            <div class="icon">
              <v-icon>mdi-fountain-pen-tip</v-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <v-row>
      <v-col v-for="(item, i) in d" :key="i" cols="auto">
        <v-card
          class="mx-auto"
          width="226"
          variant="outlined"
          @click="goChat(item)"
        >
          <v-card-item>
            <div class="text-overline mb-2 d-flex">
              <v-avatar color="primary" size="small" class="mr-2">
                {{ item[actKey].substring(0, 1) }}
              </v-avatar>
              <div>
                {{ item[actKey] }}
              </div>
            </div>
            <div class="text-caption">{{ item[promptKey] }}</div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row> -->
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
let hint = true;
onMounted(loadData);
watch(route, loadData);
async function loadData() {
  const array = (await discoverList()).filter(
    (o) => route.params.id == "all" || o.key == route.params.id
  );
  if (array.length) {
    const item = array[0];
    actKey.value = item.act || "act";
    promptKey.value = item.prompt || "prompt";
    name.value = route.params.id == "all" ? "全部" : item.name;
  }
  if (array.length == 1) {
    const item = array[0];

    name.value = item.name;
    data.value = [{ name: name.value, data: await discover(item.url) }];
  } else {
    data.value = [];
    array.forEach(async (item) => {
      const r = await discover(item.url);
      data.value = data.value.concat([{ name: item.name, data: r }]);
    });
  }
}
const d = computed(() => {
  const r = data.value
    .map((a) => ({
      name: a.name,
      data: a.data.filter(
        (o) =>
          (o.name || o.act).toLowerCase().indexOf(value.value.toLowerCase()) >
            -1 ||
          (o.content || o.desc || o.prompt || o[promptKey.value])
            .toLowerCase()
            .indexOf(value.value.toLowerCase()) > -1
      ),
    }))
    .filter((o) => o.data.length);
  return r;
});
// function toUrl(item) {
//   return `/prompts/setup?name=${item[actKey.value]}&prompt=${
//     item[promptKey.value]
//   }`;
// }
async function goChat(item) {
  console.log(item);
  let content = item.content || item.prompt || item[promptKey.value];
  if (hint && content.indexOf("[PROMPT]") > -1) {
    content = `(textarea ${item.hint} = '')(${item.content.replace(
      "[PROMPT]",
      "${" + item.hint + "}"
    )})`;
  }
  let name = item.name || item.act || item[actKey.value];
  console.log(content);
  const chatId = await createChat([
    {
      promptId: name,
      name: name,
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
.v-card--variant-outlined {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.explore-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.8rem;
  > * {
    font-size: 0.8rem;
    display: grid;
    grid-template-columns: 1fr 1rem;
    align-items: center;
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding: 0.5rem 1rem;
    border-radius: 0.8rem;
    p {
      margin-bottom: 0.3rem;
    }
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
