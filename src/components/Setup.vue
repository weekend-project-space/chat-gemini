<template>
  <div class="warp">
    <div for="" class="mb-3">{{ index > -1 ? "修改" : "添加" }}</div>
    <v-text-field label="名称" v-model="item.name"></v-text-field>
    <v-textarea label="提示词" v-model="item.prompt">></v-textarea>
    <v-btn color="primary" @click="submit">确定</v-btn>
    <v-divider class="my-6"></v-divider>
    <v-btn
      @click="onAdd"
      icon="mdi-plus"
      class="mb-3"
      size="small"
      color="primary"
    ></v-btn>
    <v-table class="mb-3" fixed-header>
      <thead>
        <tr>
          <th class="text-left">名字</th>
          <th class="text-left">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cloneItems" :key="item.name">
          <td>{{ item.name }}</td>
          <td>
            <v-btn
              icon="mdi-close"
              variant="text"
              color="error"
              size="small"
              @click="del(index - 1)"
            ></v-btn>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="onEdit(index, item)"
            ></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const cloneItems = computed(() => JSON.parse(JSON.stringify(props.modelValue)));
let index = -1;
const item = ref({});
function del(index) {
  cloneItems.value.splice(index, 1);
  emit("update:modelValue", cloneItems.value);
}

function onAdd() {
  index = -1;
  item.value = {};
}

function onEdit(i, v) {
  index = i;
  item.value = JSON.parse(JSON.stringify(v));
}

function submit() {
  if (index > -1) {
    update(index, item.value);
  } else {
    add(item.value);
  }
}

function add(item) {
  cloneItems.value.push(item);
  emit("update:modelValue", cloneItems.value);
}

function update(index, item) {
  cloneItems.value.splice(index, 1);
  cloneItems.value.push(item);
  emit("update:modelValue", cloneItems.value);
}
</script>
