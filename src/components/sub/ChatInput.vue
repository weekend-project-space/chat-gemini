<template>
  <div class="input-warp">
    <!-- <div>
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props: menu }">
          <v-btn id="extBtn" v-bind="menu" variant="text"></v-btn>
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
    </div> -->

    <textarea
      class="textarea"
      placeholder="发送消息给极速ai或#打开收藏"
      v-model="value"
      @keyup.enter="quickEnter"
      ref="inputRef"
    />
    <v-tooltip :text="generating ? '停止生成' : '发送消息'" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          :icon="generating ? ' mdi-stop-circle' : 'mdi-arrow-up-box'"
          variant="text"
          :disabled="!value && !generating"
          @click="clickBtn"
        ></v-btn>
      </template>
    </v-tooltip>
  </div>
  <v-dialog max-width="500" v-model="favable">
    <v-card>
      <div class="d-flex justify-space-between align-center pr-3 pt-3">
        <v-card-title> 收藏 </v-card-title>
        <v-btn prepend-icon="mdi-plus" to="/prompts/setup">新建</v-btn>
      </div>
      <v-list class="ma-2" nav>
        <v-list-item
          v-for="(item, index) in prompts"
          :key="index"
          @click="clickPrompt(item)"
          :title="item.name"
          :subtitle="item.prompt"
        >
        </v-list-item>
        <div v-if="prompts.length == 0" class="my-2">
          <small>暂无收藏 </small>
        </div>
      </v-list>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { nextTick, onMounted, ref, watch } from "vue";

const props = defineProps(["prompts", "generating", "tools"]);
const emit = defineEmits(["send", "stop", "tochat", "update:tools"]);

const inputRef = ref();
const value = ref("");
const favable = ref(false);

function quickEnter(e) {
  if (e.keyCode === 13 && !e.shiftKey && !props.generating) {
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
        favable.value = false;
        //   document.getElementById("extBtn").click();
        extShow = false;
      }
      inputRef.value.focus();
    }, 100);
  }
}
const height = ref(54);
onMounted(() => {
  watch(value, (v) => {
    if (v === "#") {
      // document.getElementById("extBtn").click();
      // setTimeout(() => {
      //   document.getElementsByClassName("extmenu")[0].focus();
      // }, 300);
      extShow = true;
      favable.value = true;
    }
    nextTick(() => {
      inputRef.value.style.height = "2rem"; //先重置为auto
      inputRef.value.style.height = inputRef.value.scrollHeight + "px";
      height.value = inputRef.value.scrollHeight + 18;
    });
  });
});

defineExpose({ value, inputRef, height });
</script>
<style lang="less" scoped>
.input-warp {
  box-sizing: border-box;
  bottom: -70px;
  display: grid;
  grid-template-columns: 1fr 36px;
  grid-gap: 0.5rem;
  align-items: flex-end;
  background: rgb(var(--v-theme-background));
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0px 1px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
  .textarea {
    padding-inline-start: 0.5rem;
    outline: none;
    display: block;
    height: 36px;
    min-height: 36px;
    //max-height: 12rem;
    line-height: 36px;
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
.v-btn--icon.v-btn--density-default {
  width: calc(var(--v-btn-height));
  height: calc(var(--v-btn-height));
}
</style>
