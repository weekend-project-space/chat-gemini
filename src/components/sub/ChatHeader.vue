<template>
  <div class="px-3 pt-3 sticky d-flex">
    <!-- <v-switch
      color="primary"
      hide-details=""
      :model-value="modelValue"
      @update:modelValue="(v) => emit('update:modelValue', v)"
    >
      <template #label>
        <v-tooltip text="支持联网，生成思维导图，天气查询" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props">
              
            </div>
          </template>
        </v-tooltip>
      </template>
    </v-switch> -->
    <!-- <v-tooltip text="支持联网，生成思维导图，天气查询" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn
          variant="text"
          v-bind="props"
          class="d-flex align-center"
          @click="() => emit('update:modelValue', !modelValue)"
        >
          <v-icon icon=" mdi-puzzle-outline"></v-icon>
          <span class="mx-2">联网插件:{{ modelValue ? "开启" : "关闭" }}</span>
        </v-btn>
      </template>
    </v-tooltip> -->
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn variant="text" v-bind="props"> {{ modelValue }} </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in models"
          :key="index"
          :value="index"
          @click="emit('update:modelValue', item.title)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script setup>
import { listModel } from "@/service/llmAdapter";
import { onMounted, ref } from "vue";
defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const models = ref([]);
onMounted(async () => {
  models.value = (await listModel()).map((title) => ({ title }));
});
</script>
<style lang="less" scoped>
.sticky {
  position: sticky;
  top: 0;
  background: rgb(var(--v-theme-background));
  z-index: 10;
}
</style>
