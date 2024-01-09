<template>
  <v-list density="compact" nav>
    <div class="mb-3">
      <v-list-subheader>Discover </v-list-subheader>
      <input
        class="search-input"
        type="text"
        placeholder="search"
        v-model="value"
      />
    </div>
    <v-list-item
      v-for="item in d"
      :title="item.name"
      :value="item.name"
      :subtitle="item.desc"
      :key="item.key"
      :to="'/discover/' + item.key"
    >
      <template v-slot:prepend>
        <v-avatar color="primary" size="small">
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
  border-radius: 1rem;
  height: 2rem;
  line-height: 2rem;
  padding-inline-start: 1rem;
}
</style>
