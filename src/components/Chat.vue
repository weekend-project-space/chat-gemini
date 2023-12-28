<template>
  <div class="chat-warp" ref="chatPanelRef">
    <div class="warp">
      <div class="chat-line" v-for="(item, i) in data" :key="i">
        <div class="user" v-if="!item.hideReq">
          <div class="message">
            <div v-for="(img, i) in item.imgdatas" :key="i" class="thum-warp">
              <img
                :src="
                  'data:' +
                  img.inline_data.mime_type +
                  ';base64,' +
                  img.inline_data.data
                "
                alt=""
              />
            </div>
            <div v-html="item.req"></div>
          </div>
          <v-avatar color="primary">S</v-avatar>
        </div>
        <div class="vwman">
          <v-avatar color="primary">{{ props.name.substring(0, 1) }}</v-avatar>
          <div class="message" v-html="micromark(item.res)"></div>
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
import { nextTick, onMounted, reactive, ref } from "vue";
import { llm } from "@/service/llmAdapter";
import micromark from "@/service/micromark";
const props = defineProps(["prompt", "name"]);
const data = reactive([]);
const value = ref("");
const lockInput = ref(false);
const inputRef = ref();
const fileRef = ref();
const chatPanelRef = ref();
const imgdatas = ref([]);
const imgDialog = ref(false);
const imgPre = ref({});

onMounted(() => {
  send(props.prompt, true);
});

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

async function send(text, hideReq) {
  lockInput.value = true;
  text = text || value.value;

  const item = reactive({
    req: text,
    loading: true,
    res: "正在思考中...",
    imgdatas: imgdatas.value,
    hideReq,
  });
  data.push(item);
  value.value = "";
  imgdatas.value = [];
  nextTick(scrollToBottom);
  try {
    item.res = await llm(multiTurn());
    item.loading = false;
  } catch (e) {
    console.error(e);
    item.res = "出现点问题请稍候，或点击右上角设置";
  }
  lockInput.value = false;
  nextTick(() => {
    scrollToBottom();
    inputRef.value.focus();
  });
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
  console.log(imgdatas.value);
}

function multiTurn() {
  const contents = [];
  data.forEach((o) => {
    if (o.imgdatas.length) {
      console.log(o.imgdatas);
      contents.push({
        role: "user",
        parts: [
          {
            text: o.req,
          },
          ...o.imgdatas,
        ],
      });
    } else {
      contents.push({
        role: "user",
        parts: [
          {
            text: o.req,
          },
        ],
      });
    }
    if (!o.loading) {
      contents.push({
        role: "model",
        parts: [
          {
            text: o.res,
          },
        ],
      });
    }
  });
  return { contents };
}
</script>
<style lang="less" scoped>
.warp {
  margin: 0 auto;
  max-width: 960px;
  position: relative;
}
.chat-warp {
  height: calc(100vh - 120px);
  overflow: auto;
  padding: 0 1rem 5rem;
}
.chat-line {
  .vwman {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 1rem;
    margin-top: 2rem;
  }
  .user {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 1rem;
    margin-top: 2rem;
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
