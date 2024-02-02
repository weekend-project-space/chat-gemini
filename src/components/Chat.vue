<template>
  <div
    class="chat-warp warp"
    :class="{ hiddenoverflow: !loading && cloneData && cloneData.length == 0 }"
    ref="chatPanelRef"
  >
    <div class="warp">
      <div
        class="chat-line"
        v-for="(item, i) in cloneData"
        :key="chatId + '@' + i"
      >
        <div class="eva" v-if="item.role == 'user'">
          <v-avatar color="primary" size="small">Y</v-avatar>
          <div>
            <div class="name">你</div>
            <textarea
              v-if="i == editIndex"
              class="textarea"
              :key="i"
              v-model="item.content"
              ref="textAreaRef"
              :style="{
                height: item.content
                  ? textAreaRef && textAreaRef.scrollHeight + 'px'
                  : '2rem',
              }"
            />
            <div class="textarea" v-else v-text="item.content"></div>
            <div class="message-actions">
              <div class="actions" v-if="i == editIndex">
                <v-btn size="small" color="primary" @click="applyEdit(item)">
                  确认
                </v-btn>
                <v-btn size="small" @click="cancleEdit(item)"> 取消 </v-btn>
              </div>
              <div class="actions-warp" v-else>
                <v-tooltip text="编辑" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-pencil-outline"
                      variant="text"
                      size="small"
                      @click="edit(item.content, i)"
                    ></v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip text="新建收藏" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-pound-box-outline"
                      variant="text"
                      size="small"
                      :to="
                        '/prompts/setup?prompt=' +
                        item.content +
                        (item.name ? '&name=' + item.name : '')
                      "
                    ></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="eva" v-else-if="item.role == 'model'">
          <v-avatar color="primary" size="small"
            ><v-icon icon="mdi-link"></v-icon
          ></v-avatar>
          <div>
            <div class="name">Eywa</div>
            <div class="message">
              <div
                v-html="
                  micromark(
                    item.content +
                      (i == cloneData.length - 1 && generating
                        ? '<span class=generating></span>'
                        : '')
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
    </div>
    <template v-if="!loading && cloneData && cloneData.length == 0">
      <div class="empty">
        <v-avatar color="primary" size="80">
          <v-icon icon="mdi-link" size="60"></v-icon>
        </v-avatar>
        <div class="mt-5 bold">我今天能帮你做什么？</div>

        <div class="mt-5">
          <v-menu transition="scale-transition">
            <template v-slot:activator="{ props }">
              <v-btn color="secondary" v-bind="props"
                >支付宝领红包🧧 不领白不领
              </v-btn>
              <div class="mt-3">
                <small class="tip">收藏网站 每天领一次</small>
              </div>
            </template>
            <div class="py-3 text-align">
              <img src="/hongbao.png" alt="" />
            </div>
          </v-menu>
        </div>
        <div class="mt-5">
          <v-btn variant="text" to="/discover"> 👀查看更多功能 </v-btn>
        </div>
      </div>

      <div class="explore-warp">
        <div
          v-for="item in explore"
          :key="item.act || item.name"
          class="explore"
          @click="goChat(item, router)"
        >
          <div>
            <p>{{ item.act || item.name }}</p>
            <small>{{ item.desc }}</small>
          </div>
          <div class="icon">
            <v-icon size="sm">mdi-apple-keyboard-caps</v-icon>
          </div>
        </div>
      </div>
    </template>
  </div>

  <div class="warp">
    <div class="input-warp">
      <div>
        <v-menu>
          <template v-slot:activator="{ props: menu }">
            <v-btn
              id="extBtn"
              icon="mdi-square-rounded-badge-outline"
              v-bind="menu"
              variant="text"
              size="small"
            ></v-btn>
          </template>
          <v-list density="compact" nav class="extmenu">
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
          </v-list>
        </v-menu>
      </div>

      <textarea
        class="textarea"
        placeholder="请输入问题或#获取收藏"
        v-model="value"
        @keyup.enter="quickEnter"
        :style="{
          height: value ? inputRef.scrollHeight + 'px' : '2rem',
        }"
        ref="inputRef"
      />
      <v-btn
        :icon="
          generating ? 'mdi-stop-circle-outline' : 'mdi-apple-keyboard-caps'
        "
        variant="text"
        size="small"
        :disabled="!value && !generating"
        @click="clickBtn()"
      ></v-btn>
    </div>
    <div class="text-center tip">
      <small
        >Eywa可能会犯错误。请考虑核实重要信息。
        如发现站点功能异常，加QQ群截图反馈<a
          href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=6fc5B9qUuEANrhxu_NoFxYf0E7GRv00D&authKey=usE9I3Rs9Dca8Q3aC%2BpbUyI4WjF0Eahjku8psS5%2FyJ6axVKCTJuqqFEw8vLAGv6S&noverify=0&group_code=574528625"
          >574528625</a
        ></small
      >
    </div>
  </div>
</template>
<script setup>
import { nextTick, onMounted, ref, watch, unref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { llm } from "@/service/llmAdapter";
import { goChat } from "@/utils/chatSupport";
import { copy as copy0 } from "@/utils/copySupport";
import micromark from "@/service/micromark";
import alert from "@/compose/useAlert";
import { createChat } from "@/service/chatService";
const props = defineProps(["data", "chatId", "prompts", "loading", "explore"]);
const emit = defineEmits(["qa", "replaceAllChatItems"]);
const router = useRouter();
const value = ref("");
const generating = ref(false);
const inputRef = ref();
const chatPanelRef = ref();
const cloneData = ref([]);
const editIndex = ref(-1);
let controller = new AbortController();
const textAreaRef = ref();

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

function initEl() {
  generating.value = false;
  cloneData.value = props.data;
  inputRef.value && inputRef.value.focus();

  nextTick(() => {
    scrollToBottom();
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
  cloneData.value.pop();
  //重新生成
  await gen();
  //替换所有
  emit("replaceAllChatItems", unref(cloneData));
}

function quickEnter(e) {
  if (e.keyCode == 13 && !e.shiftKey && !generating.value) {
    send();
  }
}

async function send(text) {
  cloneData.value = props.data.map((o) => ({
    role: o.role,
    content: o.content,
  }));
  text = text || value.value;
  text = text.trim();
  const req = { role: "user", content: text, chatId: props.chatId };
  cloneData.value.push(req);
  value.value = "";
  nextTick(scrollToBottom);
  const content = await gen();
  emit("qa", [req, { role: "model", content, chatId: props.chatId }]);
}

async function gen() {
  genFuns = [];
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
        if (generating.value) {
          i += 20;
          const g = () => {
            if (generating.value) {
              content += chat;
              resItem.content = content;
              cloneData.value.splice(
                cloneData.value.length - 1,
                cloneData.value.length - 1,
                Object.assign({}, resItem)
              );
              nextTick(scrollToBottom);
            }
          };
          genFuns.push(setTimeout(g, i));
        }
      }
    }
  } catch (e) {
    console.error(e);
    const eText = e.toString();
    if (eText.includes("The user aborted a request")) {
      alert({ text: "取消成功" });
    } else if (eText.includes("API key not valid")) {
      alert({ text: "点击左下角设置您的key", type: "warn" });
    } else {
      alert({ text: "出现点问题请稍候，或点击左下角设置", type: "warn" });
    }
    return new Promise((_, rej) => {
      setTimeout(() => {
        generating.value = false;
        inputRef.value.focus();
      }, 500);

      rej(e.toString());
    });
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      setTimeout(() => {
        generating.value = false;
      }, 500);
      resolve(content);
    }, i + 300);
  });
}

function multiTurn() {
  let key = "";
  let array = [];
  for (let item of cloneData.value) {
    if (item.role == key) {
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

let extShow = false;

function copy(text) {
  copy0(text);
  alert({ text: "复制成功" });
}

function clickPrompt(item) {
  if (item.x) {
    toChat(item);
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

async function toChat(item) {
  const chatId = await createChat([
    {
      promptId: item.id,
      name: item.name,
      role: "user",
      content: item.prompt,
    },
  ]);
  router.push("/chats/" + chatId);
}

let initFun = null;

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
      }, 300);
      extShow = true;
    }
  });
  initFun = setTimeout(() => {
    initEl();
  }, 30);
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
    padding: 2rem 1.5rem;
  }
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
    overflow: hidden;
  }
  .message-actions {
    display: flex;
    justify-content: flex-start;
    min-height: 28px;
    // margin-top: 0.5rem;
  }
}
.input-warp {
  // position: absolute;
  // width: calc(100% - 2rem);

  bottom: -70px;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  grid-gap: 0.5rem;
  align-items: center;
  background: rgb(var(--v-theme-surface));
  padding: 0.5rem;
  border-radius: 1.2rem;
  border: 1px solid rgb(var(--v-theme-code));
  box-shadow: 0px 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 2px 2px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 1px 3px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
  .textarea {
    outline: none;
    // padding-inline-start: 1rem;
    height: 2rem;
    max-height: 12rem;
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
.name {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty {
  text-align: center;
  margin-top: 20vh;
  .bold {
    font-weight: 500;
    font-size: 1.5rem;
  }
}
@media screen and(max-width:768px) {
  .empty {
    margin-top: 3vh;
  }
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
.textarea {
  display: block;
  resize: none;
  width: 100%;
  outline: none;
  overflow-y: hidden;
  line-height: 2rem;
  height: 2rem;
}
.textarea:disabled {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
.text-center {
  text-align: center;
}
.tip {
  opacity: 0.5;
}
@keyframes up {
  0% {
    transform: translateY(3rem);
    opacity: 0;
  }
  10% {
    transform: translateY(0);
    opacity: 0.3;
  }
  20% {
    opacity: 1;
    bottom: 1rem;
  }
  100% {
    bottom: 1rem;
  }
}
.explore-warp {
  position: absolute;
  bottom: 1rem;
  display: grid;
  width: calc(100% - 2rem);
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.5rem;
  animation: up 3s;
  > * {
    display: grid;
    grid-template-columns: 1fr 1rem;
    align-items: center;
    border: 1px solid rgb(var(--v-theme-code));
    padding: 0.5rem 1rem;
    border-radius: 0.8rem;
    small {
      opacity: 0.5;
    }
    &:hover {
      background: rgb(var(--v-theme-code));
      cursor: pointer;
      .v-icon {
        display: block;
      }
    }
    .v-icon {
      display: none;
    }
  }
}
</style>
<style lang="less">
.hiddenoverflow {
  overflow: hidden !important;
}
.message {
  img,
  * {
    max-width: 100%;
    overflow-y: auto;
  }
}
.message ol,
.message ul {
  margin-inline-start: 1rem;
}
.message pre {
  position: relative;
  max-width: calc(var(--v-warp-widht) - 32px - 1rem);
  overflow: auto;
  background: rgba(var(--v-theme-on-code), 0.8);
  color: rgb(var(--v-theme-code));
  padding: 1rem;
  border-radius: 0.5rem;
  pointer-events: none;
  &::before {
    position: absolute;
    content: "复制";
    background: rgba(var(--v-theme-on-code), 0.8);
    top: 0rem;
    right: 0rem;
    padding: 0.3rem 1rem;
    border-top-right-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    pointer-events: all;
  }
  code {
    max-width: calc(var(--v-warp-widht) - 32px - 1rem);
    .generating {
      display: none;
    }
  }
}
@keyframes scale {
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
  background: rgba(
    var(--v-theme-on-background),
    var(--v-high-emphasis-opacity)
  );
  display: inline-block;
  margin: 0 0.5rem;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  animation-name: scale; // 动画名称
  animation-direction: alternate; // 动画在奇数次（1、3、5...）正向播放，在偶数次（2、4、6...）反向播放。
  animation-timing-function: linear;
  animation-delay: 0s; // 动画延迟时间
  animation-iteration-count: infinite; //  动画播放次数，infinite：一直播放
  animation-duration: 1s; // 动画完成时间
}
</style>
