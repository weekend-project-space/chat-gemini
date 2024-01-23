<template>
  <v-app-bar :elevation="0" height="56">
    <template v-slot:prepend>
      <div class="llm-select-warp">
        <div class="select">
          <v-select
            variant="flat"
            density="compact"
            hide-details
            label="model"
            v-model="model"
            :items="['Gemini Pro']"
          ></v-select>
        </div>
      </div>
    </template>

    <!-- <v-app-bar-title>Application Bar</v-app-bar-title> -->
  </v-app-bar>

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
      :prompts="prompts"
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
const props = defineProps(["id"]);
const model = ref(localStorage.getItem("llm-model") || "Gemini Pro");
watch(model, (v) => {
  localStorage.setItem("llm-model", v);
});

const chat = computedAsync(async () => {
  return props.id && (await get(Number.parseInt(props.id)));
}, {});

const qa = computedAsync(
  async () => {
    return props.id && (await listChatItem(Number.parseInt(props.id)));
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
<style lang="less" scoped>
.llm-select-warp {
  ::v-deep(.select) {
    width: 150px;
    .v-field__input {
      --v-field-input-padding-top: 0;
      --v-field-input-padding-bottom: 0;
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}
</style>
