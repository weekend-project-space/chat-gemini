<template>
  <v-list density="compact" nav>
    <div class="mb-3">
      <v-list-subheader>Contacts </v-list-subheader>
      <input
        class="search-input"
        type="text"
        placeholder="search"
        v-model="value"
      />
    </div>
    <v-list-item
      v-for="item in contacts"
      :title="item.name"
      :value="item.name"
      :key="item.name"
      @click="click(item)"
    >
      <template v-slot:prepend>
        <v-avatar color="secondary" size="small">
          {{ item.name.substring(0, 1) }}
        </v-avatar>
      </template>
    </v-list-item>
  </v-list>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useList } from "@/compose/useQuery";
import { listAll } from "@/repo/contactRepository";
const { value, data: contacts } = useList(listAll);

const router = useRouter();

function click(item) {
  router.push("/contacts/" + item.id);
}
</script>
<style lang="less" scoped>
.search-input {
  width: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 1rem;
  height: 2rem;
  line-height: 2rem;
  padding-inline-start: 1rem;
}
</style>
