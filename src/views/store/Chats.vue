<template>
  <v-window :model-value="store.currentChatName">
    <v-window-item
      v-for="item in store.chats"
      :key="item.name"
      :value="item.name"
    >
      <Chat :prompt="item.prompt" :name="item.name" />
    </v-window-item>
  </v-window>
</template>
<script setup>
import Chat from "@/components/Chat.vue";
import { useAppStore } from "@/store/app";
const store = useAppStore();
</script>
