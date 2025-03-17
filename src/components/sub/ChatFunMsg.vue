<template>
  <div class="chat-item-warp">
    <v-avatar color="#426Acd" size="small"
      ><v-icon icon="mdi-puzzle-outline"></v-icon
    ></v-avatar>
    <div>
      <div class="d-flex justify-space-between">
        <div class="name" v-text="name + '-插件'"></div>
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
      <v-expand-transition>
        <!-- debug -->
        <v-card v-show="isDebug" class="my-3" variant="outlined">
          <v-tabs v-model="tab" color="primary">
            <v-tab value="fun">函数信息</v-tab>
            <v-tab value="args">函数参数</v-tab>
            <v-tab value="res">返回结果</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="fun">
                <div v-text="formatJSON(functionCall)"></div>
              </v-window-item>
              <v-window-item value="args">
                <div v-text="functionCall.args"></div>
              </v-window-item>
              <v-window-item value="res">
                <div v-text="formatJSON(modelValue)"></div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-expand-transition>
      <div :class="isLast ? 'msgwap' : ''">
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
                  @click="
                    copy(
                      micromark(modelValue.content || modelValue).replace(
                        /<[^>]*>/g,
                        ''
                      )
                    )
                  "
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
                  @click="copy(modelValue.content || modelValue)"
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
                  @click="emit('regenerate')"
                ></v-btn>
              </template>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h, render, ref, onMounted, isReactive, toRaw } from "vue";
import { copy as copy0 } from "@/utils/copySupport";
import { loadfun as loadfun0 } from "@/service/toolService";
import micromark from "@/service/micromark";
import alert from "@/compose/useAlert";
const props = defineProps([
  "modelValue",
  "funcall",
  "isLast",
  "generating",
  "loadfun",
]);
const emit = defineEmits(["regenerate", "nextgenerate", "update:modelValue"]);
const functionCall = computed(() => props.funcall);
const messageRef = ref();
const tab = ref("");
const isDebug = ref(false);
const icon = computed(() => {
  const n = functionCall.value.name
    ? functionCall.value.name.replace("find_", "")
    : "";
  let icons = {
    weather: "mdi-weather-fog",
    webcrawer: "mdi-spider-outline",
    currenttime: "mdi-clock-outline",
    md2mindmap: " mdi-graphql",
  };
  return icons[n] || "mdi-robot-industrial-outline";
});
const name = computed(() => {
  const n = functionCall.value.name
    ? functionCall.value.name.replace("find_", "")
    : "";
  let names = {
    weather: "天气",
    webcrawer: "网络爬虫",
    currenttime: "当前时间助手",
    md2mindmap: "思维导图",
  };
  return names[n] || "-";
});
function copy(text) {
  copy0(text);
  alert({ text: "复制成功" });
}

function formatJSON(obj) {
  return JSON.stringify(isReactive(obj) ? toRaw(obj) : obj, null, 4);
}

let tmpfuncallstr = "";

async function _render() {
  // 防止重复渲染
  if (JSON.stringify(props.funcall) === tmpfuncallstr) {
    return;
  } else {
    tmpfuncallstr = JSON.stringify(props.funcall);
  }
  let content = props.modelValue;
  const convert = (content) => {
    if (typeof content === "string") {
      return { content: content };
    } else if (typeof content === "object") {
      return Object.assign({}, content);
    } else {
      return {};
    }
  };
  // console.log(content);
  if (content) {
    // skip
  } else {
    // const t = await props.loadfun(functionCall.value.name);
    // console.log(t);
    let holder = { next: false };
    const n = functionCall.value.name
      ? functionCall.value.name.replace("find_", "")
      : "";
    const fun = await loadfun0(n, "/fun/" + n + ".js");
    let data = await fun(functionCall.value.args, {
      nextGen: (text, enabledTools = false) => {
        holder.next = true;
        setTimeout(() => {
          emit("nextgenerate", [{ role: "user", content: text }], enabledTools);
        }, 300);
      },
      lab: {
        h,
        alert,
        copy: copy0,
        micromark,
      },
    });
    let res = {};
    if (holder.next) {
      if (typeof data === "object") {
        res = Object.assign({}, data, holder);
      } else if (typeof data == "string") {
        res = { content: data, next: holder.next };
      } else {
        res = data;
      }
    } else {
      res = data;
    }
    emit("update:modelValue", res);
    content = res;
  }
  let d = convert(content);
  if (!d.next) {
    messageRef.value.innerHTML = micromark(d.content);
    let iframes = messageRef.value.getElementsByTagName("iframe");
    if (iframes.length) {
      var iframe = iframes[0];
      iframe.addEventListener("load", function () {
        setTimeout(() => {
          eval(d.lazyfun)(messageRef.value, functionCall.value.args);
        }, 500);
      });
    } else {
      setTimeout(() => {
        eval(d.lazyfun)(messageRef.value, functionCall.value.args);
      }, 1000);
    }
  } else {
    render(
      h("span", {
        class:
          icon.value + " tip my-2 mdi v-icon notranslate  v-icon--size-default",
      }),
      messageRef.value
    );
  }
}

onMounted(() => {
  // 防止重复渲染
  if (props.isLast && props.generating) {
    //
  } else {
    _render();
  }
});
// watch(() => props.funcall, _render);
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
  .msgwap {
    min-height: calc(100vh - 56px - 78px - 50px - var(--chat-requst-height));
  }
  .message-actions {
    display: flex;
    justify-content: flex-start;
    min-height: 28px;
    margin-top: 0.5rem;
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
