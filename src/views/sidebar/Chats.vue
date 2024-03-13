<template>
  <div class="mx-3 my-2">
    <div class="d-flex flex">
      <v-list-subheader> 对话</v-list-subheader>
      <v-btn
        prepend-icon=" mdi-file-edit-outline"
        size="small"
        color="primary"
        @click="newChat0"
      >
        新建对话
      </v-btn>
    </div>
    <input
      class="search-input mt-2"
      type="text"
      placeholder="search"
      v-model="value"
    />
  </div>
  <div class="list">
    <v-list nav>
      <v-list-item
        v-for="item in chatList"
        :title="item.name"
        :value="item.id"
        :key="item.id"
        :data-id="item.id"
        :to="'/chats/' + item.id"
      >
        <template #append>
          <div class="actions">
            <v-btn
              size="small"
              variant="text"
              icon="mdi-delete-outline"
              @click.prevent="delChat0(item.id)"
            ></v-btn>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>
<script setup>
import { useList } from "@/compose/useQuery";
import { listAll, getByPromptId } from "@/repo/chatRepository";
import { delChat, newChat } from "@/service/chatService";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, watch } from "vue";
import { useDisplay } from "vuetify";
import { format } from "@/utils/dateUtils";
const { value, data: chats } = useList(listAll);
const defaultChatText = "新对话";
const route = useRoute();
const router = useRouter();
const { mobile } = useDisplay();
const chatList = computed(
  () => chats.value && chats.value.filter((o) => o.name != defaultChatText)
);
async function goChat() {
  if (route.query.promptid) {
    const chatId = (await getByPromptId(Number.parseInt(route.query.promptid)))
      .id;
    router.push("/chats/" + chatId);
  } else if (!route.path.includes("/chats/") && !mobile.value) {
    setTimeout(newChat0, 300);
  }
}

async function newChat0() {
  if (route.fullPath.includes("/chats")) {
    const newchats = chats.value.filter((o) => o.name == defaultChatText);
    if (newchats.length) {
      router.push("/chats/" + newchats[0].id);
    } else {
      createChat();
    }
  }
}

async function createChat() {
  const chatId = await newChat(defaultChatText);
  setTimeout(() => {
    router.push("/chats/" + chatId);
  }, 100);
}

async function delChat0(id) {
  await delChat(id);
  if (!mobile.value && route.params.id == id) {
    newChat0();
  }
}

function formatData(time) {
  return format(new Date(time), "yyyy-MM-dd");
}

onMounted(goChat);
watch(route, goChat);
</script>
<style lang="less" scoped>
small {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-background), 0.6);
}
.list .v-list {
  .v-btn--icon.v-btn--density-default {
    width: 30px;
    height: 30px;
  }
  .actions {
    display: none;
  }
  .v-list-item:hover {
    .actions {
      display: block;
    }
  }
}
.search-input {
  width: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 1.2rem;
  height: 2.5rem;
  line-height: 2.5rem;
  padding-inline-start: 1rem;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
