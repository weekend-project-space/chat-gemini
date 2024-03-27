<template>
  <div class="warp empty">
    <div class="">
      <div class="logo-warp mx-auto">
        <img src="/logo.png" style="width: 80px" alt="" />
      </div>
    </div>

    <v-card flat>
      <v-card-subtitle class="mt-3">卡密</v-card-subtitle>
      <v-card-text>
        <!-- <v-text-field label="geminiApi" v-model="geminiApi"></v-text-field> -->
        <v-text-field label="卡密" v-model="qaiKey"></v-text-field>
        <!-- <a href="https://makersuite.google.com/app/apikey" target="_blank"
          >获取apiKey</a
        > -->
      </v-card-text>
      <div class="mx-3 my-2">
        <v-btn color="primary" @click="ok"> 立即激活 </v-btn>
        <br />
        <br />
        <v-btn
          prepend-icon="mdi-credit-card"
          text="去购买"
          href="https://item.taobao.com/item.htm?ft=t&id=771495870230&spm=a21dvs.23580594.0.0.47b33d0dHMMXEU"
        ></v-btn>
      </div>
    </v-card>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import confirm from "@/compose/useConfirm";
const router = useRouter();
const qaiKey = ref(localStorage.getItem("qaiKey"));

// const geminiApi = ref(
//   localStorage.getItem("geminiApi") ||
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="
// );
async function ok() {
  localStorage.setItem("qaiKey", qaiKey.value);
  setTimeout(() => {
    const sendEvent = new Event("llmEnd");
    document.dispatchEvent(sendEvent);
  }, 100);
  // localStorage.setItem("geminiApi", geminiApi.value);
  await confirm({ text: "保存成功, 立刻开始对话?" });
  router.push("/chats");
}
</script>
<style lang="less" scoped>
.logo-warp {
  width: 80px;
  height: 80px;
}
.empty {
  text-align: center;
  margin-top: 20vh;
  .bold {
    font-weight: 500;
    font-size: 1.5rem;
  }
  .tip {
    opacity: 0.5;
  }
}
</style>
