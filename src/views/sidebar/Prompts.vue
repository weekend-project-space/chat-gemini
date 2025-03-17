<template>
  <div class="mx-3 my-2">
    <div class="d-flex flex">
      <v-list-subheader>收藏 </v-list-subheader>
      <v-btn
        prepend-icon="mdi-plus"
        size="small"
        color="primary"
        to="/prompts/setup"
      >
        新建收藏
      </v-btn>
    </div>
    <input
      class="search-input mt-2"
      type="text"
      placeholder="search"
      v-model="value"
    />
  </div>
  <div class="list">
    <v-list nav>
      <v-list-item
        v-for="item in contacts"
        :title="item.name"
        :value="item.name"
        :key="item.name"
        :to="'/prompts/' + item.id"
      >
        <template v-slot:prepend>
          <v-avatar color="primary" size="small">
            {{ item.name.substring(0, 1) }}
          </v-avatar>
        </template>
        <template #append>
          <div class="actions">
            <v-btn
              size="small"
              variant="text"
              icon="mdi-delete-outline"
              @click.prevent="del(item.id)"
            ></v-btn>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>
<script setup>
import { useList } from "@/compose/useQuery";
import { listAll, del } from "@/repo/promptRepository";
const { value, data: contacts } = useList(listAll);
</script>
<style lang="less" scoped>
.list .v-list {
  .v-btn--icon.v-btn--density-default {
    width: 30px;
    height: 30px;
  }
  .actions {
    display: none;
  }
  .v-list-item:hover {
    .actions {
      display: block;
    }
  }
}
.search-input {
  width: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 1.2rem;
  height: 2.5rem;
  line-height: 2.5rem;
  padding-inline-start: 1rem;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
