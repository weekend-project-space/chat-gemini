<template>
  <div class="warp-sm mt-5">
    <v-card flat>
      <v-card-title class="text-h5"> 设置 </v-card-title>
      <v-card-text>
        <v-text-field label="geminiApi" v-model="geminiApi"></v-text-field>
        <v-text-field label="geminiKey" v-model="geminiKey"></v-text-field>
        <a href="https://makersuite.google.com/app/apikey" target="_blank"
          >获取apiKey</a
        >
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="ok"> 确定 </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script setup>
import { ref } from "vue";

const geminiKey = ref(localStorage.getItem("geminiKey"));
const geminiApi = ref(
  localStorage.getItem("geminiApi") ||
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="
);
function ok() {
  localStorage.setItem("geminiKey", geminiKey.value);
  localStorage.setItem("geminiApi", geminiApi.value);
}
</script>
