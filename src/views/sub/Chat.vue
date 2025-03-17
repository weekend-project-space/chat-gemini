<template>
  <template v-if="chat && chat.id">
    <ChatGc
      v-if="
        items &&
        items.length &&
        items[0].content &&
        items[0].content.indexOf('(') == 0
      "
      :name="items[0].name"
      :prompt="items[0].content"
    />
    <Chat
      v-else
      :chat-id="chat.id"
      :model-value="items"
      @update:modelValue="(v) => replaceItems(v, chat.id)"
      :loading="loading"
      :prompts="prompts"
      :userTypes="userTypes"
      :explore="morePrompts"
      :loadfun="findByName"
      @selectedUserType="(v) => (userType = v)"
    ></Chat>
  </template>
</template>
<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import Chat from "@/components/Chat";
import ChatGc from "@/components/ChatGc";
import { listChatItem, del } from "@/repo/chatItemRepository";
import { listAll } from "@/repo/promptRepository";
import { get, save } from "@/repo/chatRepository";
import { findByName } from "@/repo/toolRepository";
import { saveChatItems } from "@/service/chatService";
import { computedAsync } from "@vueuse/core";
import { discover } from "@/api/discover";
const props = defineProps(["id"]);
const model = ref(localStorage.getItem("llm-model") || "Gemini Pro");
watch(model, (v) => {
  localStorage.setItem("llm-model", v);
});

const router = useRouter();

const userType = ref("");

const userTypes = computedAsync(async () => {
  return await discover(`/user-types.json`);
});

const morePrompts = computedAsync(async () => {
  const randomNumber = userType.value
    ? userType.value.data[
        Math.floor(Math.random() * userType.value.data.length)
      ]
    : Math.floor(Math.random() * 17);
  const data = await discover(`/${randomNumber}.json`);
  let index = Math.floor(Math.random() * data.length - 5);
  index = index < 0 ? 0 : index;
  return data.slice(index, index + 4);
});

const chat = computedAsync(async () => {
  return props.id && (await get(Number.parseInt(props.id)));
}, {});

watch(chat, () => {
  if (!chat.value) {
    router.push("/chats");
  }
});

const loading = ref(false);

const items = computedAsync(
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

async function addChatItems(chatItems) {
  const items0 = props.id && (await listChatItem(Number.parseInt(props.id)));
  // 更新会话名称
  if (items0.length == 0) {
    const o = Object.assign({}, chat.value, { name: chatItems[0].content });
    await save(o);
    chat.value = o;
  }
  await saveChatItems(
    chatItems.map((msg) => ({
      chatId: Number.parseInt(msg.chatId),
      role: msg.role,
      content: msg.content,
    }))
  );
  items.value = await listChatItem(Number.parseInt(props.id));
}

async function replaceItems(items0, chatId) {
  items0 = items0.map((o) => {
    o.chatId = Number.parseInt(chatId);
    return o;
  });
  if (items.value.length == 0) {
    await addChatItems(items0);
    return;
  }
  // 查找更新的位置
  let len0 = items.value.length;
  let len1 = items0.length;
  let len = len1 > len0 ? len0 : len1;
  let updateIndex = len0 != len1 ? len : -1;
  for (let i = 0; i < len; i++) {
    if (
      JSON.stringify(items.value[i].content) !=
      JSON.stringify(items0[i].content)
    ) {
      updateIndex = i;
      break;
    }
  }
  if (updateIndex == -1) {
    return;
  }
  // console.log("updateIndex", updateIndex, items.value, items0);
  // 删除之后的数据

  for (let i = updateIndex; i < len0; i++) {
    await del(items.value[i].id);
  }

  // 更新之后的数据
  if (updateIndex > -1 && updateIndex < len1) {
    await addChatItems(items0.slice(updateIndex));
  }
}
</script>
