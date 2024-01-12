<template>
  <div class="chat-warp" ref="chatPanelRef">
    <div class="warp">
      <div class="chat-line" v-for="(item, i) in cloneData" :key="i">
        <div class="eva" v-if="item.role == 'user'">
          <v-avatar color="secondary" size="small">Y</v-avatar>
          <div>
            <div class="name">你</div>
            <div class="message">
              <textarea
                class="textarea"
                :disabled="i != editIndex"
                v-model="item.content"
                :style="{
                  height: lineSize(item.content) * 2 + 'rem',
                }"
              />
            </div>
            <div class="message-actions">
              <div class="actions" v-if="i == editIndex">
                <v-btn size="small" color="secondary" @click="applyEdit(item)">
                  确认
                </v-btn>
                <v-btn size="small" @click="cancleEdit(item)"> 取消 </v-btn>
              </div>
              <div class="actions-warp" v-else>
                <v-tooltip text="编辑" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-pencil"
                      variant="text"
                      size="small"
                      @click="edit(item.content, i)"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="eva" v-else-if="item.role == 'model'">
          <v-avatar color="secondary" size="small"
            ><v-icon icon="mdi-link"></v-icon
          ></v-avatar>
          <div>
            <div class="name">Eywa</div>
            <div class="message">
              <span v-html="micromark(item.content)"></span>
              <span
                v-if="i == cloneData.length - 1 && generating"
                class="generating"
              ></span>
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
                      @click="
                        copy(micromark(item.content).replace(/<[^>]*>/g, ''))
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
                      @click="copy(item.content)"
                    ></v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip
                  text="重新生成"
                  location="bottom"
                  v-if="i == cloneData.length - 1"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon=" mdi-replay"
                      variant="text"
                      size="small"
                      @click="regenerate"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="cloneData.length == 0" class="empty">
        <v-avatar color="secondary" size="64">
          <v-icon icon="mdi-link" size="36"></v-icon>
        </v-avatar>
        <div class="mt-5">需要我做点什么</div>
      </div>
    </div>
  </div>
  <div class="warp">
    <div class="input-warp">
      <div>
        <v-menu>
          <template v-slot:activator="{ props: menu }">
            <v-btn
              id="extBtn"
              :disabled="generating"
              icon="mdi-square-rounded-badge-outline"
              v-bind="menu"
              variant="text"
            ></v-btn>
          </template>
          <v-list density="compact" nav class="extmenu">
            <v-list-item
              v-for="(item, index) in prompts"
              :key="index"
              @click="changePrompt(item.prompt)"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <textarea
        class="textarea"
        placeholder="请输入问题或#获取快捷指令"
        v-model="value"
        @keydown.enter="send()"
        :disabled="generating"
        :style="{
          height: lineSize(value, 630) * 2 + 'rem',
        }"
        ref="inputRef"
      />
      <v-btn
        :icon="
          generating ? 'mdi-stop-circle-outline' : 'mdi-apple-keyboard-caps'
        "
        variant="text"
        :disabled="!value && !generating"
        @click="clickBtn()"
      ></v-btn>
    </div>
  </div>
</template>
<script setup>
import { nextTick, onMounted, ref, watch, unref } from "vue";
import { llm } from "@/service/llmAdapter";
import micromark from "@/service/micromark";
import alert from "@/compose/useAlert";
const props = defineProps(["data", "chatId", "prompts"]);
const emit = defineEmits(["qa", "replaceAllChatItems"]);
const value = ref("");
const generating = ref(false);
const inputRef = ref();
const chatPanelRef = ref();
const cloneData = ref([]);
const editIndex = ref(-1);
let controller = new AbortController();

const scrollToBottom = () => {
  const domWrapper = chatPanelRef.value;
  const currentScroll = domWrapper.scrollTop; // 已经被卷掉的高度
  const clientHeight = domWrapper.offsetHeight; // 容器高度
  const scrollHeight = domWrapper.scrollHeight; // 内容总高度
  if (scrollHeight - 10 > currentScroll + clientHeight) {
    domWrapper.scrollTo(0, scrollHeight - clientHeight);
  }
  // window.scrollTo(0, document.body.scrollHeight);
};

let tempContent = "";
function edit(content, index) {
  tempContent = content;
  editIndex.value = index;
}

function cancleEdit(item) {
  item.content = tempContent;
  editIndex.value = -1;
}

async function applyEdit() {
  cloneData.value = cloneData.value.slice(0, editIndex.value + 1);
  editIndex.value = -1;
  //重新生成
  await gen();
  // console.log(cloneData);
  //替换所有
  emit("replaceAllChatItems", unref(cloneData));
}

function lineSize(content, widht = 710) {
  let n = content.pxWidth() / widht;
  let line =
    n > Number.parseInt(n) ? Number.parseInt(n) + 1 : Number.parseInt(n);
  return (line < 1 ? 1 : line) + content.split("\n").length - 1;
}

function clickBtn() {
  if (generating.value) {
    controller.abort();
  } else {
    send();
  }
}

function initEl() {
  generating.value = false;
  cloneData.value = props.data;
  inputRef.value.focus();

  nextTick(() => {
    scrollToBottom();
  });
}

async function regenerate() {
  // 移除最后回答
  cloneData.value.pop();
  //重新生成
  await gen();
  //替换所有
  emit("replaceAllChatItems", unref(cloneData));
}

async function send(text) {
  cloneData.value = props.data.map((o) => ({
    role: o.role,
    content: o.content,
  }));
  text = text || value.value;
  const req = { role: "user", content: text, chatId: props.chatId };
  cloneData.value.push(req);
  value.value = "";
  nextTick(scrollToBottom);
  const content = await gen();
  emit("qa", [req, { role: "model", content, chatId: props.chatId }]);
}

async function gen() {
  if (generating.value) {
    alert({ text: "请等回复完后再重试" });
    return;
  }
  let content = "";
  let i = 0;
  generating.value = true;
  try {
    const reqData = multiTurn();
    const resItem = { role: "model", content: "", chatId: props.chatId };
    cloneData.value.push(resItem);
    controller = new AbortController();
    for await (const line of llm(reqData, controller.signal)) {
      for (let chat of line) {
        setTimeout(() => {
          i += 10;
          content += chat;
          resItem.content = content;
          cloneData.value.splice(
            cloneData.value.length - 1,
            cloneData.value.length - 1,
            Object.assign({}, resItem)
          );
          nextTick(scrollToBottom);
        }, i);
      }
    }
  } catch (e) {
    console.error(e);
    if (e.toString().indexOf("The user aborted a request")) {
      alert({ text: "取消成功" });
    } else {
      alert({ text: "出现点问题请稍候，或点击右上角设置", type: "warn" });
    }

    return new Promise((_, rej) => {
      generating.value = false;
      rej(e.toString());
    });
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      generating.value = false;
      resolve(content);
    }, i);
  });
}

function multiTurn() {
  return {
    contents: cloneData.value.map((o) => ({
      role: o.role,
      parts: [
        {
          text: o.content,
        },
      ],
    })),
  };
}

let extShow = false;

function copy(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
  alert({ text: "复制成功" });
}

function changePrompt(prompt) {
  value.value = prompt;
  setTimeout(() => {
    if (extShow) {
      document.getElementById("extBtn").click();
      extShow = false;
    }
    inputRef.value.focus();
  }, 100);
}

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
    () => props.data,
    () => {
      nextTick(initEl);
    }
  );
  watch(value, (v) => {
    if (v == "#") {
      document.getElementById("extBtn").click();
      setTimeout(() => {
        document.getElementsByClassName("extmenu")[0].focus();
      }, 100);
      extShow = true;
    }
  });
  setTimeout(() => {
    initEl();
  }, 30);
});
</script>
<style lang="less" scoped>
.chat-warp {
  height: 100vh;
  overflow: auto;
  padding: 2rem 1rem 5rem;
}
.chat-line {
  .eva {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 1rem;
    margin-bottom: 1rem;
  }
  .message {
    line-height: 2rem;
    overflow: auto;
  }
  .message-actions {
    display: flex;
    justify-content: flex-start;
    min-height: 28px;
  }
}
.input-warp {
  position: absolute;
  width: 100%;
  bottom: 1rem;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  grid-gap: 0.5rem;
  align-items: center;
  background: rgb(var(--v-theme-surface));
  padding: 0.5rem;
  border-radius: 1rem;
  box-shadow: 0px 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 2px 2px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 1px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
  input {
    outline: none;
    padding-inline-start: 1rem;
  }
}
.name {
  font-weight: 600;
}
.empty {
  text-align: center;
  font-weight: bold;
  margin-top: 30vh;
}
.chat-line {
  .message-actions .actions-warp {
    display: none;
    .v-btn--icon.v-btn--density-default {
      width: calc(var(--v-btn-height));
      height: calc(var(--v-btn-height));
    }
  }
  &:last-child {
    .message-actions .actions-warp {
      display: block;
    }
  }
  .message-actions:hover {
    .actions-warp {
      display: block;
    }
  }

  .actions {
    text-align: center;
    margin: 0 auto;
    .v-btn {
      margin: 0 1rem;
    }
  }
}
.textarea {
  resize: none;
  width: 100%;
  outline: none;
  overflow-y: hidden;
  line-height: 2rem;
}
.textarea:disabled {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
@keyframes likes {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(0.6);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
.generating {
  margin: 0.5rem;
  background: #333;
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  animation-name: likes; // 动画名称
  animation-direction: alternate; // 动画在奇数次（1、3、5...）正向播放，在偶数次（2、4、6...）反向播放。
  animation-timing-function: linear;
  animation-delay: 0s; // 动画延迟时间
  animation-iteration-count: infinite; //  动画播放次数，infinite：一直播放
  animation-duration: 1s; // 动画完成时间
}
</style>
<style lang="less">
.message ol,
.message ul {
  margin-inline-start: 1rem;
}
.message pre {
  max-width: calc(var(--v-warp-widht) - 32px - 1rem);
  overflow: auto;
  background: rgb(var(--v-theme-code));
  color: rgb(var(--v-theme-on-code));
  padding: 1.5rem;
  border-radius: 0.5rem;
  code {
    max-width: calc(var(--v-warp-widht) - 32px - 1rem);
  }
}
</style>
