<template>
  <div class="chat-warp" ref="chatPanelRef">
    <div class="warp">
      <div class="chat-line" v-for="(item, i) in data" :key="i">
        <div class="text-center pa-1">
          <small v-text="datestr(item.time)"></small>
        </div>
        <div class="user" v-if="item.role == 'user'">
          <div class="message">
            <div v-html="item.content"></div>
          </div>
          <v-avatar color="primary">S</v-avatar>
        </div>

        <div class="vwman" v-else-if="item.role == 'model'">
          <v-avatar color="primary">{{ props.name.substring(0, 1) }}</v-avatar>
          <div class="message" v-html="micromark(item.content)"></div>
        </div>
      </div>
      <!--  -->

      <div class="chat-line">
        <div class="user" v-if="sendText">
          <div class="message">
            <div v-html="sendText"></div>
          </div>
          <v-avatar color="primary">S</v-avatar>
        </div>
        <div class="vwman" v-if="tip">
          <v-avatar color="primary">{{ props.name.substring(0, 1) }}</v-avatar>
          <div class="message" v-text="tip"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="warp">
    <div class="input-warp">
      <div>
        <template v-if="imgdatas.length">
          <div v-for="(img, i) in imgdatas" :key="i" class="thum-warp">
            <img
              :src="
                'data:' +
                img.inline_data.mime_type +
                ';base64,' +
                img.inline_data.data
              "
              alt=""
              class="thumb"
              @click="openImgPre(img)"
            />
            <v-icon
              icon="mdi-close"
              size="small"
              class="close"
              @click="imgdatas = []"
            ></v-icon>
          </div>
        </template>
        <v-btn
          v-else
          icon="mdi-panorama-variant-outline"
          variant="text"
          @click="trigerFileUpload"
          disabled
        >
        </v-btn>
        <input
          ref="fileRef"
          type="file"
          @change="fileChange"
          style="display: none"
        />
      </div>
      <input
        type="text"
        placeholder="请输入"
        v-model="value"
        @keydown.enter="send()"
        :disabled="lockInput"
        ref="inputRef"
      />
      <v-btn
        icon="mdi-send"
        variant="text"
        :disabled="lockInput"
        @click="send()"
      ></v-btn>
    </div>
  </div>
  <v-dialog v-model="imgDialog" max-width="640">
    <v-img
      :src="
        'data:' +
        imgPre.inline_data.mime_type +
        ';base64,' +
        imgPre.inline_data.data
      "
    ></v-img>
  </v-dialog>
</template>
<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
import { llm } from "@/service/llmAdapter";
import micromark from "@/service/micromark";
import { format } from "@/utils/dateUtils";
const props = defineProps(["data", "name", "contactId"]);
const emit = defineEmits("qa");
const value = ref("");
const lockInput = ref(false);
const tip = ref("");
const inputRef = ref();
const fileRef = ref();
const chatPanelRef = ref();
const imgdatas = ref([]);
const imgDialog = ref(false);
const imgPre = ref({});
const sendText = ref("");

const datestr = (time) => format(new Date(time), "yyyy-MM-dd HH:mm");
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

function initEl() {
  scrollToBottom();
  inputRef.value.focus();
}

let cloneData = [];
async function send(text) {
  cloneData = props.data.map((o) => ({ role: o.role, content: o.content }));
  lockInput.value = true;
  text = text || value.value;
  sendText.value = text;
  tip.value = "正在思考中...";
  const req = { role: "user", content: text };
  cloneData.push(req);
  value.value = "";
  imgdatas.value = [];
  nextTick(scrollToBottom);
  try {
    const res = await llm(multiTurn());
    emit("qa", [req, { role: "model", content: res }]);
    tip.value = "";
    sendText.value = "";
  } catch (e) {
    console.error(e);
    tip.value = "出现点问题请稍候，或点击右上角设置";
  }
  lockInput.value = false;
}

function trigerFileUpload() {
  fileRef.value.click();
}

function openImgPre(item) {
  imgDialog.value = true;
  imgPre.value = item;
}

async function fileChange() {
  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
    return {
      inline_data: {
        data: await base64EncodedDataPromise,
        mime_type: file.type,
      },
    };
  }
  imgdatas.value = await Promise.all(
    [...fileRef.value.files].map(fileToGenerativePart)
  );
}

function multiTurn() {
  return {
    contents: cloneData.map((o) => ({
      role: o.role,
      parts: [
        {
          text: o.content,
        },
      ],
    })),
  };
}

onMounted(() => {
  watch(
    () => props.contactId,
    () => {
      nextTick(initEl);
    }
  );
  watch(
    () => props.data,
    () => {
      nextTick(initEl);
    }
  );
  setTimeout(() => {
    scrollToBottom();
  }, 30);
});
</script>
<style lang="less" scoped>
.chat-warp {
  height: calc(100vh - 65px);
  overflow: auto;
  padding: 0 1rem 5rem;
}
.chat-line {
  .vwman {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 1rem;
    margin-bottom: 2rem;
  }
  .user {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 1rem;
    margin-bottom: 2rem;
  }
  .message {
    background: rgb(var(--v-theme-surface));
    min-height: 2rem;
    border-radius: 1rem;
    padding: 1rem;
    line-height: 2rem;
    overflow: auto;
  }
}
.input-warp {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  grid-gap: 0.5rem;
  align-items: center;
  background: rgb(var(--v-theme-surface));
  padding: 0.5rem;
  border-radius: 1rem;
  input {
    outline: none;
    padding-inline-start: 1rem;
  }
}
.thumb {
  max-height: 48px;
  max-width: 48px;
  border: 1px solid #eee;
}
.thum-warp {
  position: relative;
  .close {
    position: absolute;
    top: -5px;
    right: -5px;
    cursor: pointer;
  }
}
</style>
<style lang="less">
.message ol,
.message ul {
  margin-inline-start: 1rem;
}
.message pre {
  overflow: auto;
  background-color: rgb(var(--v-theme-background));
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
