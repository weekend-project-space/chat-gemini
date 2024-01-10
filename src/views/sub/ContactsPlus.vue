<template>
  <div class="warp-sm mt-5">
    <v-card flat>
      <v-card-subtitle class="mt-3">{{
        index > -1 ? "Contact Edit" : "Contact Add"
      }}</v-card-subtitle>
      <v-card-text>
        <v-text-field label="名称" v-model="item.name"></v-text-field>
        <v-textarea label="提示词" v-model="item.prompt"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="submit"> Submit </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { save } from "@/repo/contactRepository";
import { useRoute, useRouter } from "vue-router";
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
    await save(Object.assign({}, item.value));
    item.value = {
      name: undefined,
      prompt: undefined,
    };
    router.push("/contacts");
  }
}
</script>
