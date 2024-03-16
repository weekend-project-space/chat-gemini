<template>
  <div class="chat-item-warp" ref="chatitemRef">
    <!-- ee6A42 -->
    <v-avatar
      color="primary"
      size="small"
      icon="mdi-account-circle-outline"
    ></v-avatar>
    <div>
      <div class="name">我</div>
      <autotextarea
        :contenteditable="editableIndex == index"
        class="textarea"
        :modelValue="item.content"
        @update:modelValue="(v) => changeContent(v)"
      />
      <div class="message-actions">
        <div class="actions" v-if="editableIndex == index">
          <v-btn size="small" color="primary" @click="applyEdit()">
            确认
          </v-btn>
          <v-btn size="small" @click="cancleEdit(item)"> 取消 </v-btn>
        </div>
        <div class="actions-warp" v-else>
          <v-tooltip text="编辑" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-pencil-outline"
                variant="text"
                size="small"
                @click="edit(item.content, index)"
              ></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="新建收藏" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-star-outline"
                variant="text"
                size="small"
                :to="
                  '/prompts/setup?prompt=' +
                  item.content +
                  (item.name ? '&name=' + item.name : '')
                "
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
const props = defineProps(["modelValue", "index"]);
const emit = defineEmits(["update:modelValue", "applyEdit"]);
const item = computed(() => props.modelValue);
const height = ref(0);
const editableIndex = ref(-1);
const chatitemRef = ref();

let tempContent = "";
function edit(content, index) {
  tempContent = content;
  editableIndex.value = index;
}

function cancleEdit(item) {
  emit("update:modelValue", Object.assign({}, item, { content: tempContent }));
  editableIndex.value = -1;
}

function applyEdit() {
  emit("applyEdit", props.index, () => {
    editableIndex.value = -1;
  });
}

function changeContent(content) {
  item.value.content = content;
  height.value = chatitemRef.value.clientHeight + 16;
  emit("update:modelValue", item.value);
}

onMounted(() => {
  height.value = chatitemRef.value.clientHeight + 16;
});

defineExpose({
  height,
});
</script>
<style lang="less" scoped>
.chat-item-warp {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1rem;
  margin-bottom: 1rem;
  .name {
    font-weight: 600;
    margin-bottom: 0.3rem;
  }

  .message-actions {
    display: flex;
    justify-content: flex-start;
    min-height: 28px;
    margin-top: 0.5rem;
  }
  .textarea0 {
    //width: calc(100% - 1rem);
    line-height: 2rem;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
  .textarea {
    display: block;
    resize: none;
    width: 100%;
    outline: none;
    overflow-y: hidden;
    line-height: 2rem;
    // height: 2rem;
  }

  .actions {
    // margin: 0 auto;
    .v-btn {
      margin-right: 1rem;
    }
  }

  .actions-warp {
    .v-btn {
      margin-right: 0.5rem;
    }
  }
}
</style>
