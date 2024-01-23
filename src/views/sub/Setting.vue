<template>
  <div class="warp">
    <v-card flat>
      <v-card-subtitle class="mt-3">Settings</v-card-subtitle>
      <v-card-text>
        <v-text-field label="geminiApi" v-model="geminiApi"></v-text-field>
        <v-text-field label="geminiKey" v-model="geminiKey"></v-text-field>
        <a href="https://makersuite.google.com/app/apikey" target="_blank"
          >获取apiKey</a
        >
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="ok"> Submit </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import confirm from "@/compose/useConfirm";
const router = useRouter();
const geminiKey = ref(localStorage.getItem("geminiKey"));
const geminiApi = ref(
  localStorage.getItem("geminiApi") ||
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="
);
async function ok() {
  localStorage.setItem("geminiKey", geminiKey.value);
  localStorage.setItem("geminiApi", geminiApi.value);
  await confirm({ text: "保存成功, 立刻开始对话?" });
  router.push("/chats");
}
</script>
