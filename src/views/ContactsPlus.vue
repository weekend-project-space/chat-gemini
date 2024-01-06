<template>
  <div class="warp mt-5">
    <v-card flat>
      <v-card-title>{{ index > -1 ? "修改" : "添加" }}</v-card-title>
      <v-card-text>
        <v-text-field label="名称" v-model="item.name"></v-text-field>
        <v-textarea label="提示词" v-model="item.prompt"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-space></v-space>
        <v-btn color="primary" @click="submit">确定</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { save } from "@/repo/contactRepository";
const item = ref({
  name: undefined,
  prompt: undefined,
});
async function submit() {
  await save(Object.assign({}, item.value));
}
</script>
