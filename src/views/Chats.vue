<template>
  <v-list density="compact" nav>
    <div class="mb-3">
      <v-list-subheader>Chats </v-list-subheader>
      <input
        class="search-input"
        type="text"
        placeholder="search"
        v-model="value"
      />
    </div>
    <v-list-item
      v-for="item in chats"
      :title="item.name"
      :value="item.name"
      :key="item.name"
      @click="click(item)"
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
import { format } from "@/utils/dateUtils";
import { useList } from "@/compose/useQuery";
import { listAll } from "@/repo/chatRepository";
import { useRouter } from "vue-router";
const { value, data: chats } = useList(listAll);
const datestr = (time) => format(new Date(time), "yyyy-MM-dd HH:mm");

const router = useRouter();
function click(item) {
  router.push("/chats/" + item.contactId);
}
</script>
<style lang="less" scoped>
small {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-background), 0.6);
}
.search-input {
  width: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 1rem;
  height: 2rem;
  line-height: 2rem;
  padding-inline-start: 1rem;
}
</style>
