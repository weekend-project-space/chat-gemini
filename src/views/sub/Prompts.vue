<template>
  <div class="warp" v-if="contact">
    <v-card-title>
      <div class="title my-3">
        <v-avatar color="primary">
          {{ contact.name.substring(0, 1) }}
        </v-avatar>
        <div class="line">
          <input
            class="ml-3 editor"
            type="text"
            data-id="name"
            :disabled="!editable.name"
            v-model="contact.name"
          />
          <v-btn
            class="btn"
            variant="text"
            size="small"
            icon="mdi-pencil"
            @click="editable.name = !editable.name"
          ></v-btn>
        </div>
      </div>
    </v-card-title>
    <v-card-subtitle>
      <div class="line">
        <!-- <textarea
          class="ml-3 editor textarea"
          type="text"
          data-id="prompt"
          :disabled="!editable.prompt"
          v-model="contact.prompt"
        /> -->
        <autotextarea
          class="ml-3 editor textarea"
          type="text"
          data-id="prompt"
          :disabled="!editable.prompt"
          v-model="contact.prompt"
        />
        <v-btn
          class="btn"
          variant="text"
          size="small"
          icon="mdi-pencil"
          @click="editable.prompt = !editable.prompt"
        ></v-btn>
      </div>
    </v-card-subtitle>
    <v-card-actions>
      <v-tooltip text="开始对话" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-message-outline"
            v-bind="props"
            @click="click(contact)"
          ></v-btn>
        </template>
      </v-tooltip>
      <v-tooltip text="分享" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-share-outline"
            v-bind="props"
            @click="share(contact)"
          ></v-btn>
        </template>
      </v-tooltip>
    </v-card-actions>
  </div>
</template>
<script setup>
import { ref, reactive, watch, computed } from "vue";

import { useRouter, useRoute } from "vue-router";
import { get, save } from "@/repo/promptRepository";
import { createChat } from "@/service/chatService";
import { share as share0 } from "@/api/share";
import { copy as copy0 } from "@/utils/copySupport";
import alert from "@/compose/useAlert";
import { useActiveElement } from "@vueuse/core";
const props = defineProps(["id"]);
const route = useRoute();
const router = useRouter();
const activeElement = useActiveElement();
const key = computed(() => activeElement.value.dataset.id || null);
// const contact = ref({});
const editable = reactive({ name: false, prompt: false });

// const contact = computedAsync(
//   async () => {
//     return props.id && (await get(Number.parseInt(props.id)));
//   },
//   null // initial state
// );

const contact = ref({ name: " ", prompt: undefined });

watch(
  () => props.id,
  async () => {
    contact.value = await get(Number.parseInt(props.id));
  },
  { immediate: true }
);

watch(route, () => {
  editable.name = false;
  editable.prompt = false;
});

watch(key, async () => {
  if (!key.value) {
    editable.name = false;
    editable.prompt = false;
    await save(contact.value);
  }
});

async function share(item) {
  const id = await share0({
    title: item.name,
    url: `${window.location.origin}/prompts/setup?name=${item.name}&prompt=${item.prompt}`,
  });
  copy(
    `发现了一个好用的《${item.name}》AI机器人\n免费使用，点击链接🔗立即体验吧\n${id}`
  );
}

async function click(item) {
  const chatId = await createChat([
    {
      promptId: item.id,
      name: item.name,
      role: "user",
      content: item.prompt,
    },
    {
      role: "model",
      content: "好的",
    },
  ]);
  router.push("/chats/" + chatId);
}

function copy(text) {
  copy0(text);
  alert({ text: "链接复制成功，赶快分享给好友吧" });
}
</script>
<style lang="less" scoped>
.editor {
  resize: none;
  padding: 0;
  outline: none;
  width: calc(100% - 6rem);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 0 0.2rem;
  line-height: 2rem;
}
.editor[disabled] {
  border: none;
}
.textarea {
  outline: none;
  // padding-inline-start: 1rem;
  height: 8rem;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 8px;
    height: 20px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(var(--v-theme-on-background), 0.3);
  }
}
.line {
  display: flex;
  justify-content: space-between;
  min-height: 2.5rem;
  .btn {
    display: none;
  }
  &:hover .btn {
    display: block;
  }
}
.title {
  display: grid;
  grid-template-columns: auto 1fr auto;
  min-height: 2.5rem;
  line-height: 2.5rem;
}
</style>
