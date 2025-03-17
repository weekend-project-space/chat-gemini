<template>
  <div class="mx-3 my-2">
    <div class="d-flex flex header">
      <v-list-subheader>创作 </v-list-subheader>
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
    <v-list-item title="全部" to="/app/all"> </v-list-item>
    <v-list-item
      v-for="item in d"
      :title="item.name"
      :value="item.name"
      :key="item.key"
      :to="'/app/' + item.key"
    >
      <!-- <template v-slot:prepend>
        <v-avatar color="primary" size="small">
          {{ item.name.substring(0, 1) }}
        </v-avatar>
      </template> -->
    </v-list-item>
  </v-list>
</template>
<script setup>
import { discoverList } from "@/api/discover";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
const data = ref([]);
const value = ref("");
const { mobile } = useDisplay();
const route = useRoute();
onMounted(async () => {
  data.value = await discoverList();
  nextTick(() => {
    if (!mobile.value && route.path == "/app") {
      document
        .querySelector(".v-navigation-drawer:last-of-type .v-list-item")
        .click();
    }
  });
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
