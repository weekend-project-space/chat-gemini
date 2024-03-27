<template>
  <div
    class="chat-warp"
    :class="{ hiddenoverflow: !loading && cloneData && cloneData.length === 0 }"
    :style="{
      height: clientHeight - 26 - (inputRef ? inputRef.height : 54) + 'px',
    }"
    ref="chatPanelRef"
    v-show="clientHeight - 26 - (inputRef ? inputRef.height : 54) > 0"
  >
    <ChatHeader v-model="tools" />

    <div class="warp">
      <template v-for="(item, i) in cloneData" :key="chatId + '@' + item.id">
        <ChatReqContent
          v-if="item.role === 'user'"
          :index="i"
          ref="inputRefs"
          :modelValue="item"
          @update:modelValue="(v) => (cloneData[i] = v)"
          @apply-edit="applyEdit"
        />
        <ChatResContent
          v-else-if="item.role === 'model'"
          :isLast="cloneData.length - 1 === i"
          :generating="generating"
          :value="item"
          :style="'--chat-requst-height:' + lastReqChatItemHeight + 'px'"
          @regenerate="regenerate"
        />
        <ChatFunContent
          v-else-if="item.role === 'functionCall'"
          :isLast="cloneData.length - 1 === i"
          :generating="generating"
          :loadfun="loadfun"
          :modelValue="item.content.content"
          :funcall="item.content.functionCall"
          :style="'--chat-requst-height:' + lastReqChatItemHeight + 'px'"
          @update:modelValue="(v) => updateItem(item, v)"
          @regenerate="regenerate"
          @nextgenerate="nextgenerate"
        />
      </template>
      <template v-if="!loading && cloneData && cloneData.length === 0">
        <ChatEmpty />
        <ChatExplore
          @update:modelValue="(v) => emit('selectedUserType', v)"
          :items="explore"
          :types="userTypes"
          @click="(item) => goChat(item, router)"
        />
      </template>
      <div v-if="generating" class="text-align my-3">
        <v-btn prepend-icon="mdi-stop-circle-outline" @click="clickBtn"
          >停止生成</v-btn
        >
      </div>
      <div v-else-if="regenerateBtn" class="text-align my-3">
        <v-btn prepend-icon="mdi-replay" color="primary" @click="regenerate"
          >重新生成</v-btn
        >
      </div>
    </div>
  </div>
  <div class="warp">
    <ChatInput
      ref="inputRef"
      :generating="generating"
      :prompts="prompts"
      @send="send"
      @stop="clickBtn"
      @tochat="toChat"
      v-model:tools="tools"
    />
    <div class="text-center tip">
      <!-- <small
        >如发现站点功能异常，<a href="https://zhidayingxiao.cn/to/06g6xX"
          >加微信群</a
        >。极速ai可能会犯错误。请考虑核实重要信息。
      </small> -->
    </div>
  </div>
</template>
<script setup>
import {
  nextTick,
  onMounted,
  ref,
  watch,
  onUnmounted,
  isProxy,
  toRaw,
} from "vue";
import { useRouter } from "vue-router";
import { llm } from "@/service/llmAdapter";
import { goChat } from "@/utils/chatSupport";
import { copy as copy0 } from "@/utils/copySupport";
import alert from "@/compose/useAlert";
import ChatHeader from "./sub/ChatHeader.vue";
import ChatReqContent from "./sub/ChatReqMsg.vue";
import ChatResContent from "./sub/ChatResMsg.vue";
import ChatFunContent from "./sub/ChatFunMsg.vue";
import ChatEmpty from "./sub/ChatEmpty.vue";
import ChatExplore from "./sub/ChatExplore.vue";
import ChatInput from "./sub/ChatInput.vue";
import { createChat } from "@/service/chatService";
const props = defineProps([
  "modelValue",
  "chatId",
  "prompts",
  "loading",
  "userTypes",
  "explore",
  "loadfun",
]);
const emit = defineEmits(["update:modelValue", "selectedUserType"]);
const router = useRouter();
const value = ref("");
const generating = ref(false);
const inputRef = ref();
const chatPanelRef = ref();
const cloneData = ref([]);
const editIndex = ref(-1);
const tools = ref(false);
const regenerateBtn = ref(false);
const clientHeight = ref(window.document.body.clientHeight);
const inputRefs = ref([]);
const lastReqChatItemHeight = ref(0);

let controller = new AbortController();

const scrollToBottom = () => {
  if (scrollIsUp) {
    return;
  }
  const domWrapper = chatPanelRef.value;
  const currentScroll = domWrapper.scrollTop; // 已经被卷掉的高度
  const clientHeight = domWrapper.offsetHeight; // 容器高度
  const scrollHeight = domWrapper.scrollHeight; // 内容总高度
  if (scrollHeight - 10 > currentScroll + clientHeight) {
    domWrapper.scrollTo(0, scrollHeight - clientHeight);
  }
  // window.scrollTo(0, document.body.scrollHeight);
};

async function updateItem(item, v) {
  item.content.content = toRaw(v);
  setTimeout(() => {
    emit("update:modelValue", clone(cloneData));
  }, 1000);
  // emit("updateItem", clone(item));
}

async function applyEdit(index, next) {
  cloneData.value = cloneData.value.slice(0, index + 1);
  editIndex.value = -1;
  // const lastId = cloneData.value[cloneData.value.length - 1].id;
  next();
  //重新生成
  try {
    await gen();
    //替换所有
  } catch (e) {
    console.error(e);
  }
}

let genFuns = [];

function clickBtn() {
  if (generating.value) {
    controller.abort();
    generating.value = false;
    genFuns.forEach(clearTimeout);
  } else {
    send();
  }
}

async function send(text) {
  scrollIsUp = false;
  text = text || value.value;
  text = text.trim();
  const req = { role: "user", content: text, chatId: props.chatId };
  cloneData.value.push(req);
  value.value = "";
  nextTick(scrollToBottom);
  try {
    await gen();
    //替换所有
  } catch (e) {
    console.error(e);
  }
}

function initEl(disalbeScroll) {
  generating.value = false;
  cloneData.value = clone(props.modelValue);
  inputRef.value.inputRef && inputRef.value.inputRef.focus();
  setTimeout(() => {
    if (inputRefs.value && inputRefs.value.length) {
      lastReqChatItemHeight.value =
        inputRefs.value[inputRefs.value.length - 1].height;
    }
    if (!disalbeScroll) {
      scrollToBottom();
    }
  }, 10);
  nextTick(() => {
    setTimeout(() => {
      const buttons = document.querySelectorAll("pre");
      buttons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          copy(e.target.innerText);
        });
      });
    }, 1000);
  });
}

async function regenerate() {
  // 移除最后回答
  // const lastId = cloneData.value[cloneData.value.length - 1].id;
  cloneData.value.pop();
  // let index = cloneData.value.length;
  try {
    //重新生成
    await gen();
  } catch (e) {
    console.error(e);
  }
}

async function nextgenerate(data, enabledTools) {
  try {
    await gen(data, enabledTools);
  } catch (e) {
    console.error(e);
  }
}

async function gen(data, enabledTools) {
  setTimeout(() => {
    if (inputRefs.value) {
      lastReqChatItemHeight.value =
        inputRefs.value[inputRefs.value.length - 1].height;
    }
  }, 100);

  scrollIsUp = false;
  regenerateBtn.value = false;
  genFuns = [];
  if (generating.value) {
    alert({ text: "请等回复完后再重试" });
    return;
  }
  let i = 0;
  generating.value = true;
  const reqData = multiTurn(data);
  const resItem = { role: "model", content: "", chatId: props.chatId };
  try {
    cloneData.value.push(resItem);
    nextTick(scrollToBottom);
    controller = new AbortController();
    enabledTools =
      typeof enabledTools == "boolean" ? enabledTools : tools.value;
    for await (const line of llm(
      reqData,
      controller.signal,
      enabledTools
      // "openai"
    )) {
      if (line.type == "text") {
        resItem.content = line.data;
      } else {
        resItem.role = "functionCall";
        resItem.content = {
          functionCall: line.data,
          content: "",
        };
      }
    }
  } catch (e) {
    let eText = e.toString();
    if (eText.includes("The user aborted a request")) {
      eText = "取消成功";
    } else if (
      eText.includes(
        "An internal error has occurred. Please retry or report in"
      ) ||
      eText.includes("The model is overloaded")
    ) {
      eText = "提问太快了，请稍后重试";
    } else if (eText.includes("API key not valid")) {
      eText = "点击左下角设置您的key";
    } else {
      // alert({ text: "抱歉，请重新试下或换个问法", type: "warn" });
      regenerateBtn.value = true;
    }
    resItem.content = eText || "抱歉，请重新生成";
    alert({ text: eText, type: "warn" });
    return new Promise((_, rej) => {
      setTimeout(() => {
        emit("update:modelValue", clone(cloneData));
        generating.value = false;
        inputRef.value.inputRef && inputRef.value.inputRef.focus();
      }, 500);
      rej(eText);
    });
  }
  nextTick(() => {
    emit("update:modelValue", clone(cloneData));
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      setTimeout(() => {
        generating.value = false;
      }, 500);
      resolve(resItem);
    }, i + 300);
  });
}

// async function gen(data, enabledTools) {
//   scrollIsUp = false;
//   regenerateBtn.value = false;
//   genFuns = [];
//   if (generating.value) {
//     alert({ text: "请等回复完后再重试" });
//     return;
//   }
//   let i = 0;
//   generating.value = true;
//   const reqData = multiTurn(data);
//   const resItem = { role: "model", content: "", chatId: props.chatId };
//   try {
//     cloneData.value.push(resItem);
//     controller = new AbortController();
//     let content = "";
//     enabledTools =
//       typeof enabledTools == "boolean" ? enabledTools : tools.value;
//     for await (const line of llm(reqData, controller.signal, enabledTools)) {
//       if (line.type == "text") {
//         for (let chat of line.data) {
//           if (generating.value) {
//             i += 20;
//             const g = () => {
//               if (generating.value) {
//                 content += chat;
//                 resItem.content = content;
//                 cloneData.value.splice(
//                   cloneData.value.length - 1,
//                   cloneData.value.length - 1,
//                   Object.assign({}, resItem)
//                 );
//                 nextTick(scrollToBottom);
//               }
//             };
//             genFuns.push(setTimeout(g, i));
//           }
//         }
//       } else {
//         resItem.role = "functionCall";
//         resItem.content = {
//           functionCall: line.data,
//           content: "",
//         };
//       }
//     }
//   } catch (e) {
//     let eText = e.toString();
//     if (eText.includes("The user aborted a request")) {
//       eText = "取消成功";
//     } else if (
//       eText.includes(
//         "An internal error has occurred. Please retry or report in"
//       ) ||
//       eText.includes("The model is overloaded")
//     ) {
//       eText = "提问太快了，请稍后重试";
//     } else if (eText.includes("API key not valid")) {
//       eText = "点击左下角设置您的key";
//     } else {
//       // alert({ text: "抱歉，请重新试下或换个问法", type: "warn" });
//       regenerateBtn.value = true;
//     }
//     resItem.content = eText || "抱歉，请重新生成";
//     alert({ text: eText, type: "warn" });
//     return new Promise((_, rej) => {
//       setTimeout(() => {
//         emit("update:modelValue", clone(cloneData));
//         generating.value = false;
//         inputRef.value.inputRef && inputRef.value.inputRef.focus();
//       }, 500);
//       rej(eText);
//     });
//   }
//   nextTick(() => {
//     emit("update:modelValue", clone(cloneData));
//   });
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       setTimeout(() => {
//         generating.value = false;
//       }, 500);
//       resolve(resItem);
//     }, i + 300);
//   });
// }

function multiTurn(data) {
  let key = "";
  let array = [];
  data = data || clone(cloneData.value);
  for (let i in data) {
    let item = data[i];
    if (item.role === "functionCall") {
      // 最后一条角色转化为user
      item.role = i === data.length - 1 ? "user" : "model";
      if (typeof item.content.content === "string") {
        item.content = item.content.content;
      } else if (
        item.content.content.content &&
        typeof item.content.content.content === "string"
      ) {
        item.content = item.content.content.content;
      } else {
        item.content = JSON.stringify(item.content.content);
      }
    }
    if (item.role === key) {
      array[array.length - 1].parts.push({
        text: item.content,
      });
    } else {
      array.push({
        role: item.role,
        parts: [
          {
            text: item.content,
          },
        ],
      });
    }
    key = item.role;
  }
  return {
    contents: array,
  };
}

function copy(text) {
  copy0(text);
  alert({ text: "复制成功" });
}

async function toChat(item) {
  const chatId = await createChat([
    {
      promptId: item.id,
      name: item.name,
      role: "user",
      content: item.prompt,
    },
  ]);
  await router.push("/chats/" + chatId);
}

function clone(o) {
  if (o.value) {
    return JSON.parse(
      JSON.stringify(isProxy(o.value) ? toRaw(o.value) : o.value)
    );
  } else {
    return JSON.parse(JSON.stringify(o));
  }
}

let initFun = null;
let scrollIsUp = false;
onMounted(() => {
  watch(
    () => props.chatId,
    () => {
      if (generating.value) {
        controller.abort();
      }
      nextTick(initEl);
    }
  );
  watch(
    () => props.modelValue,
    () => {
      nextTick(() => initEl(true));
    }
  );

  initFun = setTimeout(() => {
    initEl();
    setTimeout(() => {
      if (sessionStorage.getItem("sendable")) {
        sessionStorage.removeItem("sendable");
        gen();
      }
    }, 100);
  }, 30);

  window.addEventListener("resize", () => {
    clientHeight.value = window.innerHeight;
  });
  const domWrapper = chatPanelRef.value;
  let lastScrollTop = 0;
  domWrapper.addEventListener("scroll", () => {
    let up = domWrapper.scrollTop < lastScrollTop;
    if (up) {
      scrollIsUp = true;
    }
    lastScrollTop = domWrapper.scrollTop;
  });
});

onUnmounted(() => {
  clearTimeout(initFun);
});
</script>
<style lang="less" scoped>
.text-align {
  text-align: center;
}
.chat-warp {
  position: relative;
  height: calc(100vh - 70px - 1.2rem);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 8px;
    height: 20px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(var(--v-theme-on-background), 0.3);
  }
  .warp {
    //padding: 2rem 1rem;
  }
}

.tip {
  opacity: 0.5;
}
</style>
