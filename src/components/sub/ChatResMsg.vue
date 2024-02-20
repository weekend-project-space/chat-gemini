<template>
  <div class="chat-item-warp">
    <v-avatar color="primary" size="small"
      ><v-icon icon="mdi-link"></v-icon
    ></v-avatar>
    <div>
      <div class="name">极速ai</div>
      <div class="message">
        <div
          v-html="
            micromark(
              item.content +
                (isLast && generating ? '<span class=generating></span>' : '')
            )
          "
        ></div>
      </div>
      <div class="message-actions">
        <div class="actions-warp" v-if="!generating">
          <v-tooltip text="复制" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-content-copy"
                variant="text"
                size="small"
                @click="copy(micromark(item.content).replace(/<[^>]*>/g, ''))"
              ></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="复制成markdown" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon=" mdi-language-markdown-outline"
                variant="text"
                size="small"
                @click="copy(item.content)"
              ></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="重新生成" location="bottom" v-if="isLast">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon=" mdi-replay"
                variant="text"
                size="small"
                @click="emit('regenerate', '')"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { copy as copy0 } from "@/utils/copySupport";
import micromark from "@/service/micromark";
import alert from "@/compose/useAlert";
const props = defineProps(["value", "isLast", "generating"]);
const emit = defineEmits(["regenerate"]);
const item = computed(() => props.value);

function copy(text) {
  copy0(text);
  alert({ text: "复制成功" });
}
</script>
<style lang="less" scoped>
.chat-item-warp {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1rem;
  margin-bottom: 1rem;
  .name {
    font-weight: 600;
    margin-bottom: 0.3rem;
  }

  .message-actions {
    display: flex;
    justify-content: flex-start;
    min-height: 28px;
    // margin-top: 0.5rem;
  }
  .actions {
    // margin: 0 auto;
    .v-btn {
      margin-right: 1rem;
    }
  }

  .actions-warp {
    .v-btn {
      margin-right: 0.5rem;
    }
  }
}
</style>
