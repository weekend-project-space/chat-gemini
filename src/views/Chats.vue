<template>
  <v-list density="compact" nav>
    <div class="d-flex justify-between mb-3">
      <v-list-subheader>Chats </v-list-subheader>
    </div>
    <v-list-item
      v-for="item in store.chats"
      :title="item.name"
      :value="item.name"
      :key="item.name"
      :subtitle="item.time"
      @click="goChat(item)"
    >
      <template v-slot:prepend>
        <v-avatar color="primary" size="small">
          {{ item.name.substring(0, 1) }}
        </v-avatar>
      </template>
      <template #append> <small v-text="datestr(item.time)"></small> </template>
    </v-list-item>
  </v-list>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/app";
import { format } from "@/utils/dateUtils";
const store = useAppStore();
const datestr = (time) => format(new Date(time), "yyyy-MM-dd HH:mm");
const router = useRouter();
function goChat(item) {
  router.push("/chat");
  store.pushChat(item);
}
</script>
<style lang="less" scoped>
small {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-background), 0.6);
}
</style>
