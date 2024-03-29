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
    <v-tooltip text="支持联网，生成思维导图，天气查询" location="bottom">
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
    </v-tooltip>
  </div>
</template>
<script setup>
defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
</script>
<style lang="less" scoped>
.sticky {
  position: sticky;
  top: 0;
  background: rgb(var(--v-theme-background));
  z-index: 10;
}
</style>
