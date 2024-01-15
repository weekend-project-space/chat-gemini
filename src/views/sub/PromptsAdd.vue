<template>
  <div class="warp-sm">
    <v-card-title class="mb-3">{{
      index > -1 ? "Prompts Edit" : "Prompts Add"
    }}</v-card-title>
    <v-card-text>
      <v-text-field label="简称" v-model="item.name"></v-text-field>
      <v-textarea label="提示词" v-model="item.prompt"></v-textarea>
    </v-card-text>
    <v-btn
      class="mx-4"
      :disabled="!(item.name && item.prompt)"
      @click="submit"
      color="secondary"
    >
      确定
    </v-btn>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { save } from "@/repo/promptRepository";
import { useRoute, useRouter } from "vue-router";
import alert from "@/compose/useAlert";
const route = useRoute();
const router = useRouter();
const item = ref({
  name: undefined,
  prompt: undefined,
});
onMounted(initItem);
watch(route, initItem);
function initItem() {
  if (route.query.prompt) {
    item.value = Object.assign({}, route.query);
  }
}
async function submit() {
  if (item.value.name && item.value.prompt) {
    try {
      await save(Object.assign({}, item.value));
      item.value = {
        name: undefined,
        prompt: undefined,
      };
      alert({ text: "保存成功" });
      router.push("/prompts");
    } catch (e) {
      alert({ text: e.message, type: "warn" });
    }
  } else {
    alert({ text: "请填写", type: "warn" });
  }
}
</script>
