<template>
  <div class="input-warp">
    <div>
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props: menu }">
          <v-btn
            id="extBtn"
            :icon="tools ? 'mdi-puzzle-star-outline' : 'mdi-star-outline'"
            v-bind="menu"
            variant="text"
            size="small"
          ></v-btn>
        </template>
        <v-list density="compact" nav class="extmenu">
          <v-card min-width="300" flat>
            <v-list-item
              v-for="(item, index) in prompts"
              :key="index"
              @click="clickPrompt(item)"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
            <div v-if="prompts.length == 0" class="mx-5 my-2">
              <small>暂无收藏 </small>
            </div>
            <v-divider></v-divider>
            <v-checkbox
              :model-value="tools"
              @update:model-value="(v) => emit('update:tools', v)"
              label="开启插件（连接网络及生成思维导图）"
              hide-details
            ></v-checkbox>
          </v-card>
        </v-list>
      </v-menu>
    </div>

    <textarea
      class="textarea"
      placeholder="发送消息给极速ai或#打开收藏"
      v-model="value"
      @keyup.enter="quickEnter"
      :style="{
        height: value ? inputRef.scrollHeight + 'px' : '2rem',
      }"
      ref="inputRef"
    />
    <v-btn
      :icon="generating ? 'mdi-stop-circle-outline' : 'mdi-apple-keyboard-caps'"
      variant="text"
      size="small"
      :disabled="!value && !generating"
      @click="clickBtn"
    ></v-btn>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps(["prompts", "generating", "tools"]);
const emit = defineEmits(["send", "stop", "tochat", "update:tools"]);

const inputRef = ref();
const value = ref("");

function quickEnter(e) {
  if (e.keyCode == 13 && !e.shiftKey && !props.generating) {
    emit("send", value.value);
    value.value = "";
  }
}

function clickBtn() {
  if (props.generating) {
    emit("stop");
  } else {
    emit("send", value.value);
    value.value = "";
  }
}

let extShow = false;

function clickPrompt(item) {
  if (item.x) {
    emit("tochat", item);
    value.value = "";
  } else {
    value.value = item.prompt;
    setTimeout(() => {
      if (extShow) {
        document.getElementById("extBtn").click();
        extShow = false;
      }
      inputRef.value.focus();
    }, 100);
  }
}

onMounted(() => {
  watch(value, (v) => {
    if (v == "#") {
      document.getElementById("extBtn").click();
      setTimeout(() => {
        document.getElementsByClassName("extmenu")[0].focus();
      }, 300);
      extShow = true;
    }
  });
});
</script>
<style lang="less" scoped>
.input-warp {
  bottom: -70px;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  grid-gap: 0.5rem;
  align-items: center;
  background: rgb(var(--v-theme-background));
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0px 1px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
  .textarea {
    outline: none;
    display: block;
    height: 2rem;
    max-height: 12rem;
    line-height: 2rem;
    resize: none;

    overflow: auto;
    &::-webkit-scrollbar {
      width: 8px;
      height: 20px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(var(--v-theme-on-background), 0.3);
    }
  }
}
</style>
