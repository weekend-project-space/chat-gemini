<template>
  <template v-if="chat && chat.id">
    <ChatGc
      v-if="qa && qa.length && qa[0].content.indexOf('(') == 0"
      :name="qa[0].name"
      :prompt="qa[0].content"
    />
    <Chat
      v-else
      :chat-id="chat.id"
      :data="qa"
      :loading="loading"
      :prompts="prompts"
      :explore="morePrompts"
      @qa="addChatItems"
      @replaceAllChatItems="replaceAllChatItems"
    ></Chat>
  </template>
</template>
<script setup>
import { ref, watch } from "vue";
import Chat from "@/components/Chat";
import ChatGc from "@/components/ChatGc";
import { listChatItem, del } from "@/repo/chatItemRepository";
import { listAll } from "@/repo/promptRepository";
import { get, save } from "@/repo/chatRepository";
import { saveChatItems } from "@/service/chatService";
import { computedAsync } from "@vueuse/core";
import { discover } from "@/api/discover";
const props = defineProps(["id"]);
const model = ref(localStorage.getItem("llm-model") || "Gemini Pro");
watch(model, (v) => {
  localStorage.setItem("llm-model", v);
});

const morePrompts = computedAsync(async () => {
  const randomNumber = Math.floor(Math.random() * 17);
  const data = await discover(`/${randomNumber}.json`);
  const index = Math.floor(Math.random() * data.length - 3);
  return data.slice(index, index + 2);
});

const chat = computedAsync(async () => {
  return props.id && (await get(Number.parseInt(props.id)));
}, {});

const loading = ref(false);

const qa = computedAsync(
  async () => {
    loading.value = true;
    const r = props.id && (await listChatItem(Number.parseInt(props.id)));
    setTimeout(() => {
      loading.value = false;
    }, 200);
    return r;
  },
  [] // initial state
);

const prompts = computedAsync(async () =>
  (await listAll()).map((o) => {
    o.x = o.prompt.indexOf("(") == 0;
    return o;
  })
);

async function addChatItems(items) {
  // 更新会话名称
  if (qa.value.length == 0) {
    const o = Object.assign({}, chat.value, { name: items[0].content });
    await save(o);
    chat.value = o;
  }
  await saveChatItems(
    items.map((msg) => ({
      chatId: Number.parseInt(msg.chatId),
      role: msg.role,
      content: msg.content,
    }))
  );
  qa.value = await listChatItem(Number.parseInt(props.id));
}

async function replaceAllChatItems(items) {
  del(Number.parseInt(items[0].chatId));
  addChatItems(items);
}
</script>
