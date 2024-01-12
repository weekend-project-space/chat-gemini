<template>
  <div class="warp-sm mt-5" v-if="contact">
    <v-card flat>
      <v-card-title>
        <div class="title my-3">
          <v-avatar color="secondary">
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
          <textarea
            class="ml-3 editor"
            type="text"
            data-id="prompt"
            :disabled="!editable.prompt"
            v-model="contact.prompt"
            :rows="contact.prompt.length / 35 + 2"
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
        <v-btn
          icon="mdi-message-outline"
          title="chat"
          @click="click(contact)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { get, save } from "@/repo/promptRepository";
import { createChat } from "@/service/chatService";
import { reactive, watch, computed } from "vue";
import { useActiveElement, computedAsync } from "@vueuse/core";
const route = useRoute();
const router = useRouter();
const activeElement = useActiveElement();
const key = computed(() => activeElement.value.dataset.id || null);
// const contact = ref({});
const editable = reactive({ name: false, prompt: false });

const contact = computedAsync(
  async () => {
    return route.params.id && (await get(Number.parseInt(route.params.id)));
  },
  null // initial state
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

async function click(item) {
  await createChat([
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
  router.push("/chats?promptid=" + item.id);
}
</script>
<style lang="less" scoped>
.editor {
  padding: 0;
  outline: none;
  width: calc(100% - 6rem);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 0 0.2rem;
}
.editor[disabled] {
  border: none;
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
