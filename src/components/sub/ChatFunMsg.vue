<template>
  <div class="chat-item-warp">
    <v-avatar color="blue" size="small"
      ><v-icon icon="mdi-robot-industrial-outline"></v-icon
    ></v-avatar>
    <div>
      <div class="d-flex justify-space-between">
        <div class="name" v-text="functionCall.name"></div>
        <v-tooltip
          :text="isDebug ? '关闭调试' : '查看调用信息'"
          location="bottom"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              :icon="isDebug ? 'mdi-bug-stop-outline' : 'mdi-bug-outline'"
              v-bind="props"
              variant="text"
              size="sm"
              @click="() => (isDebug = !isDebug)"
            ></v-btn>
          </template>
        </v-tooltip>
      </div>
      <!-- debug -->
      <v-card v-show="isDebug" class="my-3" variant="tonal">
        <v-tabs v-model="tab" color="primary">
          <v-tab value="fun">函数信息</v-tab>
          <v-tab value="args">函数参数</v-tab>
          <v-tab value="res">返回结果</v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="fun">
              <div v-text="functionCall"></div>
            </v-window-item>
            <v-window-item value="args">
              <div v-text="functionCall.args"></div>
            </v-window-item>
            <v-window-item value="res">
              <div ref="resRef"></div>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
      <div class="message" ref="messageRef"></div>
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
import { computed, h, render, ref, onMounted, watch, nextTick } from "vue";
import { copy as copy0 } from "@/utils/copySupport";
import micromark from "@/service/micromark";
import alert from "@/compose/useAlert";
const props = defineProps(["value", "isLast", "generating", "loadfun"]);
const emit = defineEmits(["regenerate", "nextgenerate"]);
const item = computed(() => props.value);
const functionCall = computed(() => JSON.parse(props.value.content));
const messageRef = ref();
const resRef = ref();
const tab = ref("");
const isDebug = ref(false);

function copy(text) {
  copy0(text);
  alert({ text: "复制成功" });
}

async function _render() {
  const t = await props.loadfun(functionCall.value.name);
  console.log(t);
  const f = await (await fetch("/fun/weath.js")).text();
  const fun = eval(f);
  let el = await fun(functionCall.value.args, {
    h,
    alert,
    copy: copy0,
    next: () => {
      emit("nextgenerate");
    },
    micromark,
  });
  render(el, messageRef.value);
  watch(tab, () => {
    if (tab.value == "res") {
      nextTick(() => {
        if (resRef.value) {
          render(el, resRef.value);
        }
      });
    }
  });
}

onMounted(_render);
watch(() => props.item, _render);
</script>
<style lang="less" scoped>
.chat-item-warp {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1rem;
  margin-bottom: 1rem;
  .name {
    font-weight: 600;
  }

  .message {
    line-height: 2rem;
    overflow: hidden;
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
