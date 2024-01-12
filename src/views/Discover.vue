<template>
  <div class="mx-3 my-2">
    <div class="d-flex flex header">
      <v-list-subheader>Discover </v-list-subheader>
    </div>
    <input
      class="search-input mt-2"
      type="text"
      placeholder="search"
      v-model="value"
    />
  </div>
  <v-list density="compact" nav>
    <v-list-item
      v-for="item in d"
      :title="item.name"
      :value="item.name"
      :subtitle="item.desc"
      :key="item.key"
      :to="'/discover/' + item.key"
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
  min-height: 48px;
}
</style>
