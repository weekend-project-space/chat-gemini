<template>
  <div class="pa-5" :class="mobile ? 'grid-sm pl-5 ' : 'grid pl-9 '">
    <div class="message">
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="small" class="mr-2">
            {{ name.substring(0, 1) }}
          </v-avatar>
          <h5 v-text="name"></h5>
        </div>
        <div>
          <v-tooltip text="新建收藏" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-star-outline"
                variant="text"
                size="small"
                :to="'/prompts/setup?prompt=' + prompt + '&name=' + name"
                class="mx-3"
              ></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="分享" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-share-outline"
                variant="text"
                size="small"
                @click="share"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
      </div>
      <template v-for="item in d.components">
        <v-text-field
          :key="item.name + 'input'"
          v-if="item.type == 'input'"
          :label="item.name"
          v-model="d.data[item.name]"
        ></v-text-field>
        <v-textarea
          :key="item.name + 'textarea'"
          v-else-if="item.type == 'textarea'"
          :label="item.name"
          v-model="d.data[item.name]"
        ></v-textarea>
        <v-text-field
          :key="item.name + 'number'"
          v-else-if="item.type == 'number'"
          :label="item.name"
          type="number"
          v-model="d.data[item.name]"
        ></v-text-field>
        <v-select
          :key="item.name + 'select'"
          v-else-if="item.type == 'select'"
          :label="item.name"
          :items="item.value"
          v-model="d.data[item.name]"
        ></v-select>
        <v-radio-group
          :key="item.name + 'radio'"
          v-else-if="item.type == 'radio'"
          :label="item.name"
          v-model="d.data[item.name]"
        >
          <v-radio
            v-for="v in item.value"
            :key="v"
            :label="v"
            :value="v"
          ></v-radio>
        </v-radio-group>
        <component v-else :key="item.name + 'comp'" :is="item.type">{{
          item.value
        }}</component>
      </template>
      <div class="d-flex justify-space-between">
        <v-btn prepend-icon="mdi-delete-outline" rounded="lg" @click="d.rest()"
          >清空输入
        </v-btn>
        <v-btn
          :prepend-icon="
            generating ? 'mdi-stop-circle-outline' : 'mdi-send-outline'
          "
          rounded="lg"
          :disabled="!d.hasAllValue"
          color="primary"
          @click="clickBtn"
        >
          {{ generating ? "终止创作" : "开始创作" }}
        </v-btn>
      </div>
    </div>
    <div class="message">
      <div class="mt-2 mb-6">
        <h5 for=""><v-icon class="mr-3">mdi-magic-staff</v-icon>生成文案</h5>
      </div>
      <div v-if="generating" class="opacity">
        <v-skeleton-loader boilerplate type="article"></v-skeleton-loader>
        <v-skeleton-loader boilerplate type="paragraph"></v-skeleton-loader>
      </div>
      <template v-else-if="res">
        <div class="message-warp pa-5 mt-3">
          <div v-html="micromark(res.content)"></div>
        </div>
        <div class="actions-warp mt-3" v-if="!generating">
          <v-tooltip text="复制" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-content-copy"
                variant="text"
                size="small"
                @click="copy(micromark(res.content).replace(/<[^>]*>/g, ''))"
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
                @click="copy(res.content)"
              ></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="开始对话" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-message-outline"
                variant="text"
                size="small"
                @click="goChat"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { ref, nextTick, computed, watch } from "vue";
import { useDisplay } from "vuetify";
import { useInter } from "@/compose/promptInter";
import { llm } from "@/service/llmAdapter";
import { copy as copy0 } from "@/utils/copySupport";
import { share as share0 } from "@/api/share";
import { createChat } from "@/service/chatService";
import { useRouter } from "vue-router";
import alert from "@/compose/useAlert";
import micromark from "@/service/micromark";
const props = defineProps(["prompt", "name"]);
const router = useRouter();
const d = useInter(props);
const generating = ref(false);
const cloneData = ref([]);
const { mobile } = useDisplay();
const res = computed(() =>
  cloneData.value.length > 1 ? cloneData.value[1] : ""
);

watch(props, () => {
  cloneData.value = [];
});

async function share() {
  const id = await share0({
    title: props.name,
    url: `${window.location.origin}/prompts/setup?name=${props.name}&prompt=${props.prompt}`,
  });
  copy0(
    `发现了一个好用的《${props.name}》AI机器人\n免费使用，点击链接🔗立即体验吧\n${id}`
  );
  alert({ text: "链接复制成功，赶快分享给好友吧" });
}

const scrollToBottom = () => {
  //   const domWrapper = document;
  //   const currentScroll = domWrapper.scrollTop; // 已经被卷掉的高度
  //   const clientHeight = domWrapper.offsetHeight; // 容器高度
  //   const scrollHeight = domWrapper.scrollHeight; // 内容总高度
  //   if (scrollHeight - 10 > currentScroll + clientHeight) {
  //     domWrapper.scrollTo(0, scrollHeight - clientHeight);
  //   }
  window.scrollTo(0, document.body.scrollHeight);
};

let genFuns = [];

let controller = new AbortController();

function clickBtn() {
  if (generating.value) {
    generating.value = false;
    controller.abort();
    genFuns.forEach(clearTimeout);
  } else {
    send();
  }
}

async function send() {
  cloneData.value = [];
  let text = d.value.inter();
  text = text.trim();
  // console.log("send", text);
  const req = { role: "user", content: text, chatId: props.chatId };
  cloneData.value.push(req);
  nextTick(scrollToBottom);
  await gen();
  //   emit("qa", [req, { role: "model", content, chatId: props.chatId }]);
}

async function gen(data) {
  genFuns = [];
  if (generating.value) {
    alert({ text: "请等回复完后再重试" });
    return;
  }
  generating.value = true;

  const reqData = multiTurn(data);

  try {
    controller = new AbortController();
    for await (const line of llm(reqData, controller.signal)) {
      if (line.type == "text") {
        const resItem = {
          role: "model",
          content: line.data,
          chatId: props.chatId,
        };
        cloneData.value.push(resItem);
      } else {
        console.error(line);
      }
    }
  } catch (e) {
    console.error(e);
    let eText = e.toString();
    if (eText.includes("The user aborted a request")) {
      eText = "终止创作成功";
    } else if (eText.includes("API key not valid")) {
      eText = "API key不正确";
    } else if (eText.includes("The model is overloaded")) {
      eText = "模型过载,不要太快 请重新生成";
    }
    alert({ text: eText, type: "warn" });
    return new Promise((_, rej) => {
      setTimeout(() => {
        generating.value = false;
      }, 500);

      rej(e.toString());
    });
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      setTimeout(() => {
        generating.value = false;
      }, 500);
      resolve("");
    }, 300);
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

async function goChat() {
  const items = cloneData.value.map((item) => ({
    promptId: item.content,
    name: item.content,
    role: item.role,
    content: item.content,
  }));
  const chatId = await createChat(items);
  router.push("/chats/" + chatId);
}

function copy(text) {
  copy0(text);
  alert({ text: "复制成功" });
}
</script>
<style lang="less" scoped>
.message {
  background: rgb(var(--v-theme-background));
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-code));
  min-height: calc(100vh - 2.5rem);
  .actions-warp {
    .v-btn--icon.v-btn--density-default {
      width: calc(var(--v-btn-height));
      height: calc(var(--v-btn-height));
    }
    .v-btn {
      margin: 0 0.5rem;
    }
  }
}
.grid-sm {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  .message {
    min-height: 0;
  }
}
.grid {
  display: grid;
  grid-template-columns: 30% auto;
  grid-gap: 1rem;
}
.message-warp {
  background: #f9f9f9;
  border-radius: 0.5rem;
}
</style>
<style>
*::-webkit-scrollbar {
  width: 8px;
  height: 20px;
}
*::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-background), 0.3);
}
</style>
