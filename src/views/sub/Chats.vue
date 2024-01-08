<template>
  <Chat
    v-if="qa && qa.length > 0"
    :name="qa[0].contactName"
    :contact-id="qa[0].contactId"
    :data="qa"
    @qa="addChatItems"
  ></Chat>
</template>
<script setup>
import Chat from "@/components/Chat";
import { listChatItem } from "@/repo/chatItemRepository";
import { saveChatItem } from "@/service/chatService";
import { useRoute } from "vue-router";
import { computedAsync } from "@vueuse/core";

const route = useRoute();

const qa = computedAsync(
  async () => {
    return await listChatItem(Number.parseInt(route.params.id));
  },
  null // initial state
);

async function addChatItems(msgs) {
  msgs.map(
    async (msg) =>
      await saveChatItem({
        contactId: Number.parseInt(route.params.id),
        ...msg,
      })
  );
  qa.value = await listChatItem(Number.parseInt(route.params.id));
}
</script>
