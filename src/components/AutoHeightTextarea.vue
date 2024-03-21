<template>
  <div
    :contenteditable="contenteditable"
    v-bind="$attrs"
    @input="update"
    @paste="handlePaste"
    ref="inputRef"
    class="textarea"
    rows="1"
    v-text="modelValue"
  />
</template>
<script setup>
import { ref } from "vue";
defineProps({
  modelValue: String,
  contenteditable: {
    type: Boolean,
    default: () => true,
  },
});
const inputRef = ref();
const emit = defineEmits(["update:modelValue"]);
function update(e) {
  emit("update:modelValue", e.target.innerText);
}
function handlePaste(e) {
  e.preventDefault();
  let text = e.clipboardData.getData("text/plain"); // 拿到纯文本
  emit("update:modelValue", text);
}
</script>
<style lang="less" scoped>
.textarea {
  outline: none;
  display: block;
  resize: none;
  overflow-y: auto;
  overflow-x: hidden;
  word-wrap: break-word;
  white-space: pre-wrap;
  &::-webkit-scrollbar {
    width: 8px;
    height: 20px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(var(--v-theme-on-background), 0.3);
  }
  &[placeholder]:empty:before {
    /*empty & before 两个伪类*/
    content: attr(placeholder); /*attr 函数*/
    color: #555;
  }
}
</style>
