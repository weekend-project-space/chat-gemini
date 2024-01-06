<template>
  <div class="warp-sm mt-5" v-if="contact.name">
    <v-card flat>
      <v-card-title>
        <v-avatar color="primary" size="small">
          {{ contact.name.substring(0, 1) }}
        </v-avatar>
        <input class="ml-3" type="text" disabled v-model="contact.name" />
        <v-btn variant="text" size="small" icon="mdi-pencil"></v-btn>
      </v-card-title>
      <v-card-subtitle>
        {{ contact.prompt }}
        <v-btn variant="text" size="small" icon="mdi-pencil"></v-btn>
      </v-card-subtitle>
      <v-card-actions>
        <v-btn icon="mdi-chat-outline" @click="click(contact)"></v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script setup>
import { useApp } from "@/compose/app";
import { useRouter } from "vue-router";
const router = useRouter();
const { contact, pushChat } = useApp();

function click(item) {
  pushChat(item);
  router.push("/chats");
  setTimeout(() => {
    router.push("/chat");
  }, 30);
}
</script>
