<template>
  <Chat
    v-if="qa && qa.length > 0"
    :name="qa[0].contactName"
    :contact-id="qa[0].contactId"
    :data="qa"
    @qa="addChatItems"
    @del="delChat0"
  ></Chat>
</template>
<script setup>
import Chat from "@/components/Chat";
import { listChatItem } from "@/repo/chatItemRepository";
import { saveChatItem, delChat } from "@/service/chatService";
import { useRoute, useRouter } from "vue-router";
import { computedAsync } from "@vueuse/core";

const route = useRoute();
const router = useRouter();

const qa = computedAsync(
  async () => {
    return (
      route.params.id && (await listChatItem(Number.parseInt(route.params.id)))
    );
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

async function delChat0() {
  await delChat(Number.parseInt(route.params.id));
  qa.value = [];
  router.go(-1);
}
</script>
