<template>
  <div class="chat-item-warp">
    <v-avatar
      color="#ee6A42"
      size="small"
      icon="mdi-account-circle-outline"
    ></v-avatar>
    <div>
      <div class="name">我</div>
      <textarea
        v-if="editableIndex == index"
        class="textarea"
        :value="item.content"
        @input="(event) => changeContent(event.target.value)"
        ref="textAreaRef"
        :style="{
          height: item.content
            ? textAreaRef && textAreaRef.scrollHeight + 'px'
            : '2rem',
        }"
      />
      <div class="textarea0" v-else v-text="item.content"></div>
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
import { computed, ref } from "vue";
const props = defineProps(["modelValue", "index"]);
const emit = defineEmits(["update:modelValue", "applyEdit"]);
const textAreaRef = ref();
const item = computed(() => props.modelValue);
const editableIndex = ref(-1);

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
  emit("update:modelValue", item.value);
}
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
    // margin-top: 0.5rem;
  }
  .textarea0 {
    width: 100%;
    line-height: 2rem;
  }
  .textarea {
    display: block;
    resize: none;
    width: 100%;
    outline: none;
    overflow-y: hidden;
    line-height: 2rem;
    height: 2rem;
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
