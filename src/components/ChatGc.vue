<template>
  <div class="warp">
    <div class="d-flex align-center">
      <h2 class="my-5" v-text="name"></h2>

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

    <v-btn
      block
      :icon="generating ? 'mdi-stop-circle-outline' : 'mdi-send-outline'"
      rounded="lg"
      :disabled="!d.hasAllValue"
      color="primary"
      @click="clickBtn"
    >
    </v-btn>
    <div class="message my-5" v-if="res">
      <div
        v-html="
          micromark(
            res.content + (generating ? '<span class=generating></span>' : '')
          )
        "
      ></div>
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
    </div>
  </div>
</template>
<script setup>
import { ref, nextTick, computed, watch } from "vue";
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

function initEl() {
  nextTick(() => {
    scrollToBottom();
    setTimeout(() => {
      const buttons = document.querySelectorAll("pre");
      console.log(buttons);
      buttons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          copy(e.target.innerText);
        });
      });
    }, 1000);
  });
}

function clickBtn() {
  if (generating.value) {
    generating.value = false;
    controller.abort();
    genFuns.forEach(clearTimeout);
  } else {
    send();
  }
}

async function send(text) {
  cloneData.value = [];
  text = d.value.inter();
  text = text.trim();
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
  let i = 0;
  generating.value = true;
  const reqData = multiTurn(data);
  const resItem = { role: "model", content: "", chatId: props.chatId };
  try {
    cloneData.value.push(resItem);
    controller = new AbortController();
    let content = "";
    for await (const line of llm(reqData, controller.signal)) {
      if (line.type == "text") {
        for (let chat of line.data) {
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
      } else {
        console.error(line);
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
      alert({ text: "抱歉，请重新试下或换个问法", type: "warn" });
    }
    resItem.content = "抱歉，请重新试下或换个问法";
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
      resolve(resItem);
    }, i + 300);
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
  background: rgba(var(--v-theme-code), 0.5);
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgb(var(--v-theme-code));
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
</style>
