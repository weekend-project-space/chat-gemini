<template>
  <div class="mx-3 my-2">
    <div class="d-flex flex header">
      <v-list-subheader>发现 </v-list-subheader>
      <!-- <v-btn
        prepend-icon=" mdi-github"
        size="small"
        color="primary"
        href="https://github.com/weekend-project-space/vwman-chat"
      >
        源码
      </v-btn> -->
      <v-btn
        prepend-icon="mdi-wechat"
        size="small"
        color="primary"
        href="https://zhidayingxiao.cn/to/06g6xX"
      >
        微信客服
      </v-btn>
    </div>
    <input
      class="search-input mt-2"
      type="text"
      placeholder="search"
      v-model="value"
    />
  </div>
  <v-list nav>
    <v-list-item
      v-for="item in d"
      :title="item.name"
      :value="item.name"
      :subtitle="item.desc"
      :key="item.key"
      :to="'/discover/' + item.key"
    >
    </v-list-item>
  </v-list>
</template>
<script setup>
import { discoverList } from "@/api/discover";
import { computed, onMounted, ref } from "vue";
const data = ref([]);
const value = ref("");
onMounted(async () => {
  data.value = await discoverList();
});
const d = computed(() =>
  data.value.filter(
    (o) => o.name.toLowerCase().indexOf(value.value.toLowerCase()) > -1
  )
);
</script>
<style lang="less" scoped>
.search-input {
  width: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 1.2rem;
  height: 2.5rem;
  line-height: 2.5rem;
  padding-inline-start: 1rem;
}
.header {
  min-height: 40px;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
