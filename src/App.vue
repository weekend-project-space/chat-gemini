<template>
  <router-view />
</template>

<script setup>
import { onMounted, provide, ref } from "vue";
import { getSurplus } from "@/api/surplus.js";
const surplusText = ref("");
onMounted(async () => {
  document.body.removeChild(document.getElementById("loading"));
  document.addEventListener("llmEnd", async () => {
    surplusText.value = await getSurplus();
  });
  if (localStorage.getItem("qaiKey")) {
    surplusText.value = await getSurplus();
  }
});
provide("surplusText", surplusText);
</script>
<style lang="less">
.warp-sm {
  margin: 0 auto;
  max-width: 640px;
  position: relative;
}

:root {
  --v-warp-widht: 760px;
}
.v-card--variant-elevated,
.v-card--variant-flat {
  background-color: rgb(var(--v-theme-background));
}

html {
  overflow-y: auto;
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tip {
  opacity: 0.8;
}
.justify-between {
  justify-content: space-between;
}

.warp {
  margin: 0 auto;
  max-width: var(--v-warp-widht);
  // position: relative;
  padding: 0 1rem;
}
.warp .v-theme--light,
.warp .v-theme--dark {
  --v-theme-surface: var(--v-theme-background);
}
#app .v-navigation-drawer--left {
  border-right-width: 0;
}
// chat begin
.chat-item-warp {
  .message {
    > div p ul li {
      line-height: 2rem;
      overflow: hidden;
    }
  }
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

.hiddenoverflow {
  overflow: hidden !important;
}
.message-actions {
  .v-btn {
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
}
.message {
  img,
  pre,
  code {
    max-width: 100%;
    overflow-y: auto;
  }
  /* CSS Table Style */
  ul li {
    list-style: none;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  th,
  td {
    border: 1px solid rgb(var(--v-theme-surface));
    padding: 0.5rem;
  }
  tr:nth-child(even) {
    background-color: rgb(var(--v-theme-surface));
  }
  th {
    background-color: rgba(var(--v-theme-on-code), 0.1);
    text-align: center;
  }

  td {
    text-align: center;
  }
}
.message ol,
.message ul {
  margin-inline-start: 1rem;
}
.message pre {
  position: relative;
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
    top: 0;
    right: 0;
    padding: 0.3rem 1rem;
    border-top-right-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    pointer-events: all;
  }
  code {
    .generating {
      display: none;
    }
  }
}
//chat end
.font-sm {
  font-size: 0.85rem;
}

.opacity {
  animation: opacity 2s linear infinite;
  -webkit-animation: opacity 2s linear infinite;
}

@keyframes opacity {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

@-webkit-keyframes opacity {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}
</style>
