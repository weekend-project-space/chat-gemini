<template>
  <textarea
    v-bind="$attrs"
    :value="modelValue"
    @input="update"
    ref="inputRef"
    class="textarea"
    rows="1"
  />
</template>
<script setup>
import { onMounted, ref } from "vue";
defineProps(["modelValue"]);
const inputRef = ref();
const emit = defineEmits(["update:modelValue"]);
function update(e) {
  inputRef.value.style.height = "auto";
  inputRef.value.style.height = inputRef.value.scrollHeight + "px";
  emit("update:modelValue", e.target.value);
}
onMounted(() => {
  inputRef.value.style.height = "auto";
  inputRef.value.style.height = inputRef.value.scrollHeight + "px";
});
</script>
<style lang="less" scoped>
.textarea {
  outline: none;
  display: block;
  resize: none;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 8px;
    height: 20px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(var(--v-theme-on-background), 0.3);
  }
}
</style>
